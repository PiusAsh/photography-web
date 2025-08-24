import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CartService } from '../_services/cart.service';
import { CartItem } from '../models/product';
import { SharedModule } from '../../../shared/shared-module';
import { Navbar } from "../../../shared/components/navbar/navbar";
import { Footer } from "../../../shared/components/footer/footer";
import { HttpClient } from '@angular/common/http';
import { StoreService } from '../_services/store.service'; // Import StoreService

declare var PaystackPop: any;

@Component({
  selector: 'app-checkout-page',
  imports: [SharedModule, Navbar, Footer,],
  templateUrl: './checkout-page.html',
  styleUrls: ['./checkout-page.scss']
})
export class CheckoutPage implements OnInit {
  @ViewChild('addressText') addressText!: ElementRef;

  checkoutForm!: FormGroup;
  cartItems: CartItem[] = [];
  isProcessing = false;

  private paystackPublicKey = 'pk_test_6ee7c5aeba238b0bddfc086bda335727a81967d2'; // Replace with your actual Paystack public key

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private ngZone: NgZone,
    private http: HttpClient,
    private storeService: StoreService // Inject StoreService
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();

    this.checkoutForm = this.fb.group({
      name: ['Pius Ashogbon', Validators.required],
      email: ['pius1ash@gmail.com', [Validators.required, Validators.email]],
      phone: ['09052794388', [Validators.required, Validators.pattern(/^0[789][01]\d{8}$/)]],
      address: ['34, something street, Lagos', Validators.required]
    });
  }

  onAddressChange(address: any) {
    this.checkoutForm.patchValue({
      address: address.address,
    });
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  submitOrder(): void {
    if (this.checkoutForm.valid) {
      this.payWithPaystack();
    }
  }

  payWithPaystack(): void {
    this.isProcessing = true;
    const transactionRef = `_${Math.random().toString(36).substr(2, 9)}`;

    // Log pending payment before opening Paystack iframe
    const logPayload = {
      customerEmail: this.checkoutForm.value.email,
      transactionReference: transactionRef,
      amount: this.getTotal(),
      currency: 'NGN', // Assuming NGN as currency
      paymentMethod: 'Paystack',
      orderItems: this.cartItems?.map(item => ({
        ProductName: item.product?.name,
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.price,
        totalPrice: item.product.price * item.quantity,
        options: item.options
      })),
    };

    this.storeService.logPendingPayment(logPayload).subscribe({
      next: (logRes) => {
        const handler = PaystackPop.setup({
          key: this.paystackPublicKey,
          email: this.checkoutForm.value.email,
          amount: this.getTotal() * 100, // Amount in kobo
          ref: transactionRef,
          callback: (response: any) => {
            this.ngZone.run(() => {
              if (response.status === 'success') {
                // Update payment status after successful payment
                const updatePayload = {
                  paymentStatus: response.status,
                  transactionReference: response.reference
                };
                this.storeService.updatePaymentStatus(response.reference, updatePayload).subscribe({
                  next: (updateRes) => {
                    this.submitFinalOrder(response.reference, logPayload?.transactionReference);
                  },
                  error: (updateErr) => {
                    console.error('Error updating payment status:', updateErr);
                    this.isProcessing = false;
                    alert('Payment successful, but there was an error updating status. Please contact support.');
                  }
                });
              } else {
                this.isProcessing = false;
                alert('Payment was not successful. Please try again.');
              }
            });
          },
          onClose: () => {
            this.ngZone.run(() => {
              this.isProcessing = false;
              alert('Transaction was not completed, window closed.');
            });
          },
        });
        handler.openIframe();
      },
      error: (logErr) => {
        console.error('Error logging pending payment:', logErr);
        this.isProcessing = false;
        alert('There was an error preparing your payment. Please try again.');
      }
    });
  }

  submitFinalOrder(paymentReference: string, transactionReference: string): void {
    const orderPayload = {
      customer: {
        name: this.checkoutForm.value.name,
        email: this.checkoutForm.value.email,
        phone: this.checkoutForm.value.phone,
        address: this.checkoutForm.value.address
      },
      totalAmount: this.getTotal(),
      paymentReference: paymentReference,
      transactionReference: transactionReference,
      paymentMethod: "paystack",
      paymentStatus: "paid", // Set to paid as payment is successful
      status: "pending",
      orderDate: new Date().toISOString(),
      items: this.cartItems.map(item => ({
        productName: item?.product?.name,
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.price,
        totalPrice: item.product.price * item.quantity,
        options: item.options
      })),
    };

    this.storeService.checkout(orderPayload).subscribe({
      next: (res) => {
        this.isProcessing = false;
        alert('Order placed successfully!');
        this.cartService.clearCart();
        this.cartItems = []
        this.checkoutForm.reset();
      },
      error: (err) => {
        console.error('Error sending order to backend:', err);
        this.isProcessing = false;
        alert('There was an error placing your order. Please contact support.');
      }
    });
  }

  get f() {
    return this.checkoutForm.controls;
  }

  goBackToCart(): void {
    window.history.back();
  }
}