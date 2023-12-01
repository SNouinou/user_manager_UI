import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppStateService } from '../services/app-state.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  submited = false;
  errorMsg: string | null = null;
  authState!: any;

  public noWhitespaceValidator(
    control: FormControl,
  ): { [key: string]: any } | null {
    return (control.value || '').trim().length ? null : { whitespace: true };
  }
  usernameControl: FormControl<string | null> = new FormControl<string>('', [
    Validators.required,
    this.noWhitespaceValidator,
  ]);
  passwordControl: FormControl<string | null> = new FormControl<string>('', [
    Validators.required,
  ]);

  loginFormGroup: FormGroup = new FormGroup({
    username: this.usernameControl,
    password: this.passwordControl,
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private appStateService: AppStateService,
  ) {}

  ngOnInit(): void {
    this.authState = this.appStateService.authState;
  }

  async handleLogin(): Promise<void> {
    this.appStateService.setAuthState({ error: undefined });
    this.errorMsg = null;
    this.submited = true;

    if (!this.loginFormGroup.valid) {
      return;
    }

    const { username, password } = this.loginFormGroup.value;
    try {
      await this.authService.login(username, password);
      this.router.navigateByUrl('/users');
    } catch (err: any) {
      this.errorMsg =
        err instanceof Error ? err.message : err.message || JSON.stringify(err);
    }
  }
}
