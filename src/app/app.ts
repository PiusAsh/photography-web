import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared-module';
import { NgToastService, ToasterPosition } from 'ng-angular-popup';
import { TitleService } from './shared/services/title';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SharedModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'photography-frontend';
  constructor(
    private titleService: TitleService,
    private toast: NgToastService
  ) {}

  ngOnInit() {
    this.titleService.init();
    
  }
  ToasterPosition = ToasterPosition;

}
