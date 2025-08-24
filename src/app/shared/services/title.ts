import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
titleUpdated = new Subject<string>();

  constructor(
    private title: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  // Initialize the service and set up the router event listener
  init(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setTitle();
      });
  }

  public setTitle(): void {
    const pageTitle = this.getPageTitle(this.activatedRoute.root);
    const baseTitle = 'Benny Hosea'; // Base title
    const slogan = 'Creative Photographer in Lagos, Nigeria';

    if (pageTitle) {
      const newTitle = `${pageTitle} » ${baseTitle} | ${slogan}`;
      this.title.setTitle(newTitle);
      this.titleUpdated.next(newTitle);
    } else {
      const newTitle = `${baseTitle} | ${slogan}`;
      this.title.setTitle(newTitle);
      this.titleUpdated.next(newTitle);
    }
  }

  // Helper method to extract the title from the route tree
  public getPageTitle(route: ActivatedRoute): string {
    let title = '';

    // Traverse down the route tree to find the title
    while (route.firstChild) {
      route = route.firstChild;
      if (route.snapshot.data && route.snapshot.data['title']) {
        if (title) {
          title += ` > ${route.snapshot.data['title']}`; // Concatenate the titles
        } else {
          title = route.snapshot.data['title']; // Start the title with the first one found
        }
      }
    }

    return title;
  }
}
