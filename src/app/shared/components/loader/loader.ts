import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Loader } from '../../services/loader';

@Component({
  selector: 'app-loader',
 standalone: false,
  templateUrl: './loader.html',
  styleUrl: './loader.scss'
})
export class LoaderComponent {
  isLoading$!: Observable<boolean>;
  constructor(private loaderService: Loader) {}
  ngOnInit(): void {
    this.isLoading$ = this.loaderService.isLoading();
  }
}
