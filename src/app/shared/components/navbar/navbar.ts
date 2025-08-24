import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../../shared-module';
import { CartService } from '../../../modules/shop/_services/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [SharedModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {
 constructor(private route: Router, private cartService: CartService) {}
 gotoPage(pageUrl: string) {
    this.route.navigate([`${pageUrl}`]);
    window.scrollTo(0, 0);
  }

  isMenuCollapsed = true;
  cartCount = 0;



  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    });
  }

  

}
