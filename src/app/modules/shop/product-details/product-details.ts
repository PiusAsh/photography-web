import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../_services/cart.service';
import { ProductService } from '../_services/product.service';
import { Product } from '../models/product';
import { SharedModule } from '../../../shared/shared-module';
import { Footer } from "../../../shared/components/footer/footer";
import { Navbar } from "../../../shared/components/navbar/navbar";
import { NgToastService } from 'ng-angular-popup';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-details',
  imports: [SharedModule, Footer, Navbar],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss'
})
export class ProductDetails implements OnInit, OnDestroy {
  product: any | null = null;
  selectedImage: string = '';
  quantity = 1;
  suggestedProducts: Product[] = [];
  selectedPrint: any | null = null;
  selectedSize: any | null = null;
  calculatedAmount = 0;
  priceRange = '';

  private routeSub: Subscription | undefined;
  private cartSub: Subscription | undefined;

  @ViewChild('thumbnailContainer', { static: false }) thumbnailContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    public cartService: CartService,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.loadProduct(productId);
      } else {
        this.router.navigate(['/store']);
      }
    });

    this.cartSub = this.cartService.cart$.subscribe(() => {
      this.onSelectionChange();
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.cartSub?.unsubscribe();
  }

  private loadProduct(productId: string): void {
    this.productService.getProductById(productId).subscribe({
      next: (response: any) => {
        if (response?.data) {
          this.product = response.data;
          this.selectedImage = this.product?.mainImage || '';
          this.buildPriceRange();
          this.loadSuggestedProducts();
          this.resetSelectionsAndState();
        } else {
          this.router.navigate(['/store']);
        }
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.router.navigate(['/store']);
      }
    });
  }

  private resetSelectionsAndState(): void {
    this.selectedPrint = null;
    this.selectedSize = null;
    this.calculatedAmount = 0;
    this.quantity = 1;
  }

  onSelectionChange(): void {
    if (this.selectedPrint && this.selectedSize) {
      this.calculatedAmount = this.selectedPrint.amount + this.selectedSize.amount;
      const cartItem = this.cartService.findItemInCart(this.product.id, { size: this.selectedSize, print: this.selectedPrint });
      this.quantity = cartItem ? cartItem.quantity : 1;
    } else {
      this.calculatedAmount = 0;
      this.quantity = 1;
    }
  }

  isCurrentSelectionInCart(): boolean {
    if (this.product && this.selectedPrint && this.selectedSize) {
      return !!this.cartService.findItemInCart(this.product.id, { size: this.selectedSize, print: this.selectedPrint });
    }
    return false;
  }

  addToCart(): void {
    if (this.product && this.selectedPrint && this.selectedSize) {
      const productToAdd = { ...this.product, price: this.calculatedAmount };
      this.cartService.addToCart(productToAdd, this.quantity, {
        size: this.selectedSize,
        print: this.selectedPrint
      });
    }
  }

  changeQty(action: 'increase' | 'decrease'): void {
    const originalQuantity = this.quantity;

    if (action === 'increase') {
      this.quantity++;
    } else if (this.quantity > 1) {
      this.quantity--;
    }

    if (this.quantity !== originalQuantity && this.isCurrentSelectionInCart()) {
      this.cartService.updateQuantity(this.product.id, this.quantity, { size: this.selectedSize, print: this.selectedPrint });
    }
  }

  getCartQuantity(): number {
    if (this.product && this.selectedPrint && this.selectedSize) {
      const cartItem = this.cartService.findItemInCart(this.product.id, { size: this.selectedSize, print: this.selectedPrint });
      return cartItem ? cartItem.quantity : 0;
    }
    return 0;
  }

  private loadSuggestedProducts(): void {
    this.productService.getProducts(1, 20).subscribe({
      next: (response: any) => {
        if (response && response.data && response.data.items) {
          const otherProducts = response?.data?.items.filter((p: Product) => p.id !== this.product?.id);
          this.suggestedProducts = this.getRandomProducts(otherProducts, 15);
        }
      },
      error: (error) => console.error('Error loading suggested products:', error)
    });
  }

  private getRandomProducts(products: Product[], count: number): Product[] {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  viewProduct(product: Product): void {
    this.router.navigate([`/store/product/${product?.id}`]);
    // window.scrollTo(0, 0);
  }

  goToCart(): void {
    this.router.navigate(['/store/cart']);
    window.scrollTo(0, 0);
  }

  scrollThumbnails(direction: 'left' | 'right'): void {
    const container = this.thumbnailContainer.nativeElement;
    const scrollAmount = 150;
    container.scrollLeft += (direction === 'left' ? -scrollAmount : scrollAmount);
  }

  buildPriceRange(): void {
    const sizes = this.product?.size || [];
    const prints = this.product?.print || [];

    if (sizes.length > 0 && prints.length > 0) {
      const sizeAmounts = sizes.map((s: { amount: any; }) => s.amount);
      const printAmounts = prints.map((p: { amount: any; }) => p.amount);
      const minPrice = Math.min(...sizeAmounts) + Math.min(...printAmounts);
      const maxPrice = Math.max(...sizeAmounts) + Math.max(...printAmounts);
      this.priceRange = `₦${minPrice.toLocaleString()} – ₦${maxPrice.toLocaleString()}`;
    } else {
      this.priceRange = 'N/A';
    }
  }
}
