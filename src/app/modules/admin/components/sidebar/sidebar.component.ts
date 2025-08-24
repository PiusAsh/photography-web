import { Component } from '@angular/core';
import { SidebarService } from '../../../../shared/services/sidebar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  constructor(
    public sidebarService: SidebarService,
    private router: Router
  ) { }

  logout() {
    // Clear any stored tokens/session data
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    
    // Navigate to login page
    this.router.navigate(['/auth']);
  }
}
