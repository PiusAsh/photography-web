import { Component } from '@angular/core';
import { SidebarService } from '../../../../shared/services/sidebar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  showNotifications = false;
  showUserMenu = false;

  constructor(
    public sidebarService: SidebarService,
    private router: Router
  ) { }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.showUserMenu = false;
    }
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    if (this.showUserMenu) {
      this.showNotifications = false;
    }
  }

  logout() {
    // Clear any stored tokens/session data
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    
    // Navigate to login page
    this.router.navigate(['/login']);
  }
}
