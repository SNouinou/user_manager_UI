import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.scss'],
})
export class BatchComponent {
  uploadLoading: boolean = false;
  file: File | undefined;
  errorMsg: string | null = null;
  successMsg: string | undefined;

  constructor(private userService: UserService) {}

  onFileSelected(event: any) {
    console.log(console.log(event.target.files));
    this.file = event.target.files[0];
  }

  async handleBatch() {
    if (this.file) {
      this.uploadLoading = true;
      try {
        const upload$ = await this.userService.uploadUserList(this.file);
        this.successMsg = JSON.stringify(upload$);
      } catch (error) {
        this.errorMsg = error + '';
      } finally {
        this.uploadLoading = false;
      }
    }
  }
}
