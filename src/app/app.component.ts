import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AppStateService } from './services/app-state.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { RouterExtService } from './router-ext-service.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'user-manager';
  authState: any;
  currentUrl!: Observable<any>;
  constructor(private appStateService: AppStateService, private authService: AuthService, private router: Router, private routerExt: RouterExtService) {
    this.currentUrl = this.routerExt.watchNavigation();
  }
  ngOnInit(): void {
    this.authState = this.appStateService.authState;
  }
  handleDisconnect() {
    this.authService.disconnect();
    this.router.navigateByUrl('/login');
  }
}
