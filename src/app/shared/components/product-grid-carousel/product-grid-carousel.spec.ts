import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGridCarousel } from './product-grid-carousel';

describe('ProductGridCarousel', () => {
  let component: ProductGridCarousel;
  let fixture: ComponentFixture<ProductGridCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductGridCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductGridCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
