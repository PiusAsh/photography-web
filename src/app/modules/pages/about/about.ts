import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Navbar } from "../../../shared/components/navbar/navbar";
import { Footer } from "../../../shared/components/footer/footer";
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-about',
  imports: [Navbar, Footer, CommonModule, NgbModule],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})


export class About implements OnInit, AfterViewInit, OnDestroy {

  // Data for Philosophy Tabs
  philosophyTabs = [
    {
      id: 'connection',
      title: 'Connection',
      content: 'I believe the most captivating images are born from genuine moments and real connections. Building a rapport that allows your true self to shine through is my priority.'
    },
    {
      id: 'creativity',
      title: 'Creativity',
      content: 'I constantly push artistic boundaries, experimenting with new techniques and perspectives to deliver unique and innovative visuals that truly stand out.'
    },
    {
      id: 'precision',
      title: 'Precision',
      content: 'Mastering light, composition, and technical execution is fundamental. Every detail is meticulously crafted to ensure flawless and impactful photography.'
    },
    {
      id: 'storytelling',
      title: 'Storytelling',
      content: 'Beyond just a picture, I aim to weave narratives that evoke emotion, capture the essence of your moment, and create visuals that truly stand the test of time.'
    }
  ];
  activePhilosophyTabId: string = this.philosophyTabs[0].id; // Default active tab

  // Data for Journey Timeline (simplified for component logic)
  journeyEvents = [
    { year: '2021', description: 'Began professional photographic journey, focused on portraiture.' },
    { year: '2022', description: 'Expanded into fashion and lifestyle photography, collaborating with local brands.' },
    { year: '2023', description: 'Launched dedicated wedding photography services, capturing intimate celebrations.' },
    { year: '2024', description: 'Diversified portfolio with corporate portraiture, serving businesses and executives.' },
    { year: '2025', description: 'Continued artistic exploration, integrating advanced techniques and visual storytelling.' }
  ];

  // Data for Testimonial Carousel
  testimonials = [
    { quote: "Benny didn't just take our wedding photos; he captured the soul of our day. Every image tells a story, and his calm professionalism made us feel so at ease.", author: "Sarah & David, Wedding Clients" },
    { quote: "For our new campaign, Benny understood our brand vision perfectly. His fashion photography is vibrant, dynamic, and truly stands out.", author: "Elegance Apparel Co." },
    { quote: "The corporate headshots Benny delivered for our entire team were exceptional. Professional, modern, and everyone felt comfortable during the shoot.", author: "TechSolutions Inc." },
    { quote: "An incredible eye for detail and a knack for making you feel comfortable. Benny truly exceeded our expectations for our lifestyle shoot.", author: "Emily R., Lifestyle Client" },
    { quote: "The beauty portraits were stunning! Benny has a way of highlighting your best features while keeping it natural and authentic.", author: "Jessica M., Beauty Client" }
  ];

  // Scroll animation observer
  private observer: IntersectionObserver | undefined;
  @ViewChild('aboutMeSection') aboutMeSection!: ElementRef; // Reference to the main section

  // Image URL for Benny Hosea's photo
  bennyPhotoUrl: string = '/images/about.jpg'; // Placeholder photo

  constructor() { }

  ngOnInit(): void {
    // No direct initialization of observables or intervals needed here,
    // as ngbNav and ngbCarousel handle their own state.
    // Intersection Observer setup in ngAfterViewInit for DOM readiness.
  }

  ngAfterViewInit(): void {
    // Set up Intersection Observer for scroll-triggered animations
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible'); // Trigger animation class
          this.observer?.unobserve(entry.target); // Stop observing once visible
        }
      });
    }, { threshold: 0.1 }); // Trigger when 10% of element is visible

    // Observe specific elements
    const elementsToAnimate = this.aboutMeSection.nativeElement.querySelectorAll('.fade-in-on-scroll');
    elementsToAnimate.forEach((el: Element) => this.observer?.observe(el));
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  // Method to select tab for ngbNav
  selectPhilosophyTab(tabId: string): void {
    this.activePhilosophyTabId = tabId;
  }
}