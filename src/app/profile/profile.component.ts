import { Component, OnChanges, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Profile } from '../models/profile';
import * as _ from 'lodash';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AppStateService } from '../services/app-state.service';
import { Observable, catchError, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  username: string = '';
  profile$: Observable<Profile | undefined | null> = of(undefined);

  errorMsg!: string;

  loading!: boolean;

  authToken: string = '';

  obs: any;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private appStateService: AppStateService,
  ) {}

  ngOnInit(): void {
    let authToken = this.appStateService.authState.token;
    if (!authToken || authToken == null) {
      this.errorMsg = 'missing authorization property';
      return;
    }

    this.authToken = authToken;

    this.profile$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.userService
          .getUserProfileObs(params.get('id')!, this.authToken)
          .pipe(
            catchError((err) => {
              this.errorMsg =
                err instanceof Error
                  ? err.message
                  : err.message || JSON.stringify(err);
              return of(null);
            }),
          ),
      ),
    );
  }
}
