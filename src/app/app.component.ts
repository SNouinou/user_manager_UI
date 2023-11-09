import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AppStateService } from './services/app-state.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'user-manager';
  authState: any;
  constructor(private appStateService: AppStateService, private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.authState = this.appStateService.authState;
  }
  handleDisconnect() {
    this.authService.disconnect();
    this.router.navigateByUrl('/');
  }
}
