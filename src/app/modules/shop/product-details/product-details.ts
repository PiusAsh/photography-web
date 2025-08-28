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

  uniqueTypes: any;
  availableSizes: any;
  selectedType: string | null = null;
  selectedSize: string | null = null;
  currentPrice: number = 0;
  variantPriceRange: string = '';

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
      this.updateCalculatedPrice();
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
          this.populateTypes();
          this.calculateVariantPriceRange();
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
    this.selectedType = null;
    this.selectedSize = null;
    this.currentPrice = 0;
    this.quantity = 1;
  }

  populateTypes(): void {
    if (this.product?.variants) {
      this.uniqueTypes = [...new Set(this.product.variants.map((v: { type: any; }) => v.type))];
    }
  }

  onTypeChange(): void {
    this.selectedSize = null; // Reset size when type changes
    this.currentPrice = 0; // Reset price
    this.availableSizes = [];

    if (this.selectedType && this.product?.variants) {
      const filteredVariants = this.product.variants.filter((v: { type: string | null; }) => v.type === this.selectedType);
      this.availableSizes = [...new Set(filteredVariants.map((v: { size: any; }) => v.size))];
    }
    this.updateCalculatedPrice();
  }

  onSizeChange(): void {
    this.updateCalculatedPrice();
  }

  updateCalculatedPrice(): void {
    if (this.selectedType && this.selectedSize && this.product?.variants) {
      const matchingVariant = this.product.variants.find(
        (v: { type: string | null; size: string | null; }) => v.type === this.selectedType && v.size === this.selectedSize
      );
      if (matchingVariant) {
        this.currentPrice = matchingVariant.price;
      } else {
        this.currentPrice = 0;
      }
    } else {
      this.currentPrice = 0;
    }
    const cartItem = this.cartService.findItemInCart(this.product.id, { type: this.selectedType, size: this.selectedSize });
    this.quantity = cartItem ? cartItem.quantity : 1;
  }

  isCurrentSelectionInCart(): boolean {
    if (this.product && this.selectedType && this.selectedSize) {
      return !!this.cartService.findItemInCart(this.product.id, { type: this.selectedType, size: this.selectedSize });
    }
    return false;
  }

  addToCart(): void {
    if (this.product && this.selectedType && this.selectedSize && this.currentPrice > 0) {
      const productToAdd = { ...this.product, price: this.currentPrice };
      this.cartService.addToCart(productToAdd, this.quantity, {
        type: this.selectedType,
        size: this.selectedSize
      });
    } else {
      this.toast.info('Please select a Type and Size.');
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
      this.cartService.updateQuantity(this.product.id, this.quantity, { type: this.selectedType, size: this.selectedSize });
    }
  }

  getCartQuantity(): number {
    if (this.product && this.selectedType && this.selectedSize) {
      const cartItem = this.cartService.findItemInCart(this.product.id, { type: this.selectedType, size: this.selectedSize });
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

  calculateVariantPriceRange(): void {
    if (this.product?.variants && this.product.variants.length > 0) {
      const prices = this.product.variants.map((v: { price: number; }) => v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      this.variantPriceRange = `₦${minPrice.toLocaleString()} – ₦${maxPrice.toLocaleString()}`;
    } else {
      this.variantPriceRange = 'N/A';
    }
  }
}
