import { Component, HostListener } from '@angular/core';
import { SharedModule } from '../../../shared/shared-module';
import { Footer } from "../../../shared/components/footer/footer";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [SharedModule, Footer],
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
  constructor(private route: Router) {}
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

   categories: string[] = ['Wedding', 'Beauty', 'Fashion & Lifestyle', 'Corporate Portrait'];
  selectedCategory: string = 'Wedding'; // Default selected tab for portfolio

  portfolioItems: any[] = [
    // Wedding Category
    { imageUrl: '/images/slide10.JPEG.jpg', description: 'Joyful wedding moment, captured with love.', category: 'Wedding' },
    { imageUrl: '/images/slide3.JPEG.jpg', description: 'Bride walking down the aisle, anticipation in her eyes.', category: 'Wedding' },
    { imageUrl: '/images/slide4.JPEG.jpg', description: 'First dance under soft lights.', category: 'Wedding' },
    { imageUrl: '/images/slide6.JPEG.jpg', description: 'Groom awaiting his bride.', category: 'Wedding' },
    { imageUrl: '/images/slide7.JPEG.jpg', description: 'Emotional vows exchanged.', category: 'Wedding' },
    { imageUrl: '/images/slide8.JPEG.jpg', description: 'Wedding rings close-up.', category: 'Wedding' },
    { imageUrl: '/images/slide9.JPEG.jpg', description: 'Elegant reception decor.', category: 'Wedding' },
    // Beauty Category
    { imageUrl: '/images/slide10.JPEG.jpg', description: 'Stunning portrait highlighting natural beauty.', category: 'Beauty' },
    { imageUrl: '[https://picsum.photos/id/1063/600/400](https://picsum.photos/id/1063/600/400)', description: 'Glamorous shot with striking makeup.', category: 'Beauty' },
    { imageUrl: '[https://picsum.photos/id/1064/600/400](https://picsum.photos/id/1064/600/400)', description: 'Soft focus capturing delicate features.', category: 'Beauty' },
    { imageUrl: '[https://picsum.photos/id/1065/600/400](https://picsum.photos/id/1065/600/400)', description: 'Artistic use of light in a beauty shoot.', category: 'Beauty' },
    { imageUrl: '[https://picsum.photos/id/1066/600/400](https://picsum.photos/id/1066/600/400)', description: 'Expressive eyes in a close-up.', category: 'Beauty' },
    { imageUrl: '[https://picsum.photos/id/1067/600/400](https://picsum.photos/id/1067/600/400)', description: 'Radiant skin and subtle glow.', category: 'Beauty' },
    { imageUrl: '[https://picsum.photos/id/1068/600/400](https://picsum.photos/id/1068/600/400)', description: 'Bold and vibrant beauty editorial.', category: 'Beauty' },
    // Fashion & Lifestyle Category
    { imageUrl: '[https://picsum.photos/id/1069/600/400](https://picsum.photos/id/1069/600/400)', description: 'Urban fashion street style.', category: 'Fashion & Lifestyle' },
    { imageUrl: '[https://picsum.photos/id/1070/600/400](https://picsum.photos/id/1070/600/400)', description: 'Relaxed lifestyle shot outdoors.', category: 'Fashion & Lifestyle' },
    { imageUrl: '[https://picsum.photos/id/1071/600/400](https://picsum.photos/id/1071/600/400)', description: 'High fashion editorial pose.', category: 'Fashion & Lifestyle' },
    { imageUrl: '[https://picsum.photos/id/1072/600/400](https://picsum.photos/id/1072/600/400)', description: 'Candid moment capturing everyday life.', category: 'Fashion & Lifestyle' },
    { imageUrl: '[https://picsum.photos/id/1073/600/400](https://picsum.photos/id/1073/600/400)', description: 'Elegant evening wear in a unique setting.', category: 'Fashion & Lifestyle' },
    { imageUrl: '[https://picsum.photos/id/1074/600/400](https://picsum.photos/id/1074/600/400)', description: 'Sporty look with dynamic background.', category: 'Fashion & Lifestyle' },
    { imageUrl: '[https://picsum.photos/id/1075/600/400](https://picsum.photos/id/1075/600/400)', description: 'Bohemian style, free spirit.', category: 'Fashion & Lifestyle' },
    // Corporate Portrait Category
    { imageUrl: '[https://picsum.photos/id/1076/600/400](https://picsum.photos/id/1076/600/400)', description: 'Professional headshot for corporate profile.', category: 'Corporate Portrait' },
    { imageUrl: '[https://picsum.photos/id/1077/600/400](https://picsum.photos/id/1077/600/400)', description: 'Executive portrait conveying confidence.', category: 'Corporate Portrait' },
    { imageUrl: '[https://picsum.photos/id/1078/600/400](https://picsum.photos/id/1078/600/400)', description: 'Team leader in a modern office environment.', category: 'Corporate Portrait' },
    { imageUrl: '[https://picsum.photos/id/1079/600/400](https://picsum.photos/id/1079/600/400)', description: 'Thoughtful gaze, perfect for a professional biography.', category: 'Corporate Portrait' },
    { imageUrl: '[https://picsum.photos/id/1080/600/400](https://picsum.photos/id/1080/600/400)', description: 'Client-facing professional, approachable and competent.', category: 'Corporate Portrait' },
    { imageUrl: '[https://picsum.photos/id/1081/600/400](https://picsum.photos/id/1081/600/400)', description: 'Formal business portrait with clean backdrop.', category: 'Corporate Portrait' },
    { imageUrl: '[https://picsum.photos/id/1082/600/400](https://picsum.photos/id/1082/600/400)', description: 'Dynamic pose for a startup founder.', category: 'Corporate Portrait' },
  ];
 // Portfolio methods
  // Portfolio methods
  get filteredPortfolioItems(): any[] {
    return this.portfolioItems.filter(item => item.category === this.selectedCategory);
  }
showPortfolioGrid: boolean = true;
  selectCategory(category: string): void {
    if (this.selectedCategory !== category) {
      this.selectedCategory = category;
      // Temporarily hide and show the grid to re-trigger CSS animations
      this.showPortfolioGrid = false;
      setTimeout(() => {
        this.showPortfolioGrid = true;
      }, 10); // A small delay is enough to trigger reflow and animation
    }
  }
}
