import { Component } from '@angular/core';
import { SidebarService } from '../../shared/services/sidebar.service';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  constructor(public sidebarService: SidebarService) {}
}
