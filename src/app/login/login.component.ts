import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  submited = false;
  authenticated: boolean = false;
  errorMsg: string | null = null;

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
  ) {}

  ngOnInit(): void {}

  async handleLogin(): Promise<void> {
    this.errorMsg = null;
    if (!this.loginFormGroup.valid) {
      this.submited = true;
      return;
    }
    const { username, password } = this.loginFormGroup.value;
    try {
      await this.authService.login(username, password);
      this.router.navigateByUrl('/users');
    } catch (err) {
      this.errorMsg = '' + err;
    }
  }
}
