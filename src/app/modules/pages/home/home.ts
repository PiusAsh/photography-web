import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { SharedModule } from '../../../shared/shared-module';
import { Footer } from "../../../shared/components/footer/footer";
import { Router } from '@angular/router';
import { PortfolioService } from '../../admin/pages/add-portfolio/portfolio.service';
import { AdminRoutingModule } from "../../admin/admin-routing.module";

@Component({
  selector: 'app-home',
  imports: [SharedModule, Footer, AdminRoutingModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
 title = 'photography-site';
  isScrolled = false;

  // Background Image Slider Variables
  carouselImages: string[] = [
    '/images/slidee1.jpg',
    '/images/slidee2.jpg',
    '/images/slidee3.jpg',
    '/images/slidee4.jpg',
    '/images/slidee5.jpg',
    '/images/slidee7.jpg',

  ];
  // carouselImages: string[] = [
  //   '/images/about.jpg',
  //   '/images/slidee1.jpg',
  //   '/images/slide.jpg',
  //   '/images/slide1.jpg',
  //   '/images/slide3.JPEG.jpg',
  //   '/images/slide4.JPEG.jpg',
  //   // '/images/slide5.JPG.jpg',
  //   '/images/slide6.JPEG.jpg',
  //   '/images/slide8.JPEG.jpg',
  //   '/images/slide9.JPEG.jpg',
  //   '/images/slide10.JPEG.jpg',
  // ];
  currentImageIndex: number = 0;
  currentBackgroundImage: string = ''; // Holds the current image URL for binding
  imageChangeInterval: any; // To store the interval ID for image cycling

  // Dynamic Word in Heading Variables
  dynamicWords: string[] = ['memory', 'journey', 'story', 'moments', 'future'];
  currentWordIndex: number = 0;
  dynamicWord: string = ''; // Holds the current dynamic word for binding
  wordChangeInterval: any; // To store the interval ID for word cycling
isMenuCollapsed = true;
  constructor(private route: Router, private portfolioService: PortfolioService, private cdr: ChangeDetectorRef) {}
 gotoPage(pageUrl: string) {
    this.route.navigate([`${pageUrl}`]);
    window.scrollTo(0, 0);
  }
  ngOnInit(): void {
    // Initialize the first background image and dynamic word
    this.currentBackgroundImage = this.carouselImages[this.currentImageIndex];
    this.dynamicWord = this.dynamicWords[this.currentWordIndex];

    // Start cycling background images every 5 seconds (5000ms)
    this.imageChangeInterval = setInterval(() => {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.carouselImages.length;
      this.currentBackgroundImage = this.carouselImages[this.currentImageIndex];
    }, 5000); // Change image every 5 seconds

    // Start cycling dynamic words every 3 seconds (3000ms)
    this.wordChangeInterval = setInterval(() => {
      this.currentWordIndex =
        (this.currentWordIndex + 1) % this.dynamicWords.length;
      this.dynamicWord = this.dynamicWords[this.currentWordIndex];
    }, 3000); // Change word every 3 seconds
    this.loadCategories()
  }

  // Clear intervals when the component is destroyed to prevent memory leaks
  ngOnDestroy(): void {
    if (this.imageChangeInterval) {
      clearInterval(this.imageChangeInterval);
    }
    if (this.wordChangeInterval) {
      clearInterval(this.wordChangeInterval);
    }
  }

  // HostListener for sticky navbar effect on scroll
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    // Set 'isScrolled' to true if scroll position is greater than 50px from top
    this.isScrolled = window.scrollY > 50;
  }

   categories: any[] = [];
  selectedCategory: string = 'All'; // Default selected tab for portfolio

  allPortfolioItems: any[] = []; // Store all fetched portfolio items
  filteredPortfolioItems: any[] = []; // Filtered items based on selected category
  showPortfolioGrid: boolean = true;

  loadCategories(): void {
    this.portfolioService.getAllCategories().subscribe({
      next: (response) => {
        if (response.status && response.data) {
          // Add an "All" category at the beginning
          this.categories = [{ id: 0, name: 'All', description: '', status: '', dateCreated: '' }, ...response.data];

          this.loadPortfolioItems(this.selectedCategory === 'All' ? '' : this.selectedCategory);
                    this.selectedCategory = 'All'; // Select "All" by default
          this.cdr.detectChanges();
        } else {
          console.error('Failed to load categories:', response.errorMessage);
        }
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    });
  }

  loadPortfolioItems(searchTerm: string = ''): void {
    // Fetch all portfolio items (adjust pageNumber and pageSize as needed)
    this.portfolioService.getPortfolioItems(1, 8, searchTerm).subscribe({
      next: (response) => {
        if (response.status && response.data && response.data.items) {
          this.allPortfolioItems = response.data.items;
          this.filteredPortfolioItems = this.allPortfolioItems; // Update filtered items after loading
        } else {
          console.error('Failed to load portfolio items:', response.errorMessage);
        }
      },
      error: (err) => {
        console.error('Error fetching portfolio items:', err);
      }
    });
  }


 selectCategory(categoryName: string): void {
  if (this.selectedCategory !== categoryName) {
    this.selectedCategory = categoryName;
    this.showPortfolioGrid = false; 

    setTimeout(() => {
      const searchTerm = categoryName === 'All' ? '' : categoryName;
      this.loadPortfolioItems(searchTerm);
      this.showPortfolioGrid = true;
    }, 10);
  }}

  goTo(){
    this.route.navigate(["/portfolio"]);
    window.scrollTo(0, 0);
  }
}
