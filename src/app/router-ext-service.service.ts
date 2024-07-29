import { Injectable } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Observable } from 'rxjs';

 /** A router wrapper, adding extra functions. */
@Injectable({providedIn: 'root',})
export class RouterExtService {
  
  private previousUrl!: string;
  private currentUrl!: string;

  constructor(private router : Router) {
    this.currentUrl = router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
        console.debug(this.currentUrl);
      };
    });
  }

  public getPreviousUrl(){
    return this.previousUrl;
  }

  public getNavigationStart(){
    return this.currentUrl;
  }

  public watchNavigation(): Observable<string>{
    return new Observable((subscriber) => {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          subscriber.next(event.url);
        };
      });
    });
  }

}