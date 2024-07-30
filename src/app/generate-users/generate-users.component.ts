import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { finalize, firstValueFrom, tap } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-generate-users',
  templateUrl: './generate-users.component.html',
  styleUrls: ['./generate-users.component.scss'],
})
export class GenerateUsersComponent {
  submited = false;
  errorMsg: string | null = null;
  static MAX_SIZE = 1000;
  generating: boolean = false;
  file: File | undefined;

  get maxSize(): number {
    return GenerateUsersComponent.MAX_SIZE;
  }

  dataSizeControl: FormControl<number | null> = new FormControl<number>(1, [
    Validators.required,
    Validators.max(GenerateUsersComponent.MAX_SIZE),
    Validators.min(1),
  ]);

  constructor(private userService: UserService) {}

  ngOnInit(): void {}

  downloadFile(fileContent: any, filename: string | null): any {
    const content = JSON.stringify(
      fileContent,
      null,
      2,
    );
    const mimeType = 'application/json';
    const blob = new Blob([content], {
      type: mimeType,
    });
    const dataUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename || 'users_list';

    link.click();

    URL.revokeObjectURL(dataUrl);
  }

  async handleGenerate(): Promise<void> {
    this.generating = true;
    this.submited = true;
    this.errorMsg = null;

    try {
      if (!this.dataSizeControl.value || !this.dataSizeControl.valid) {
        throw new Error("data size isn't correct");
      }

      const count = this.dataSizeControl.value;

      const { filename, content } = await this.userService.generate(count);

      this.downloadFile(content, filename);
    } catch (err) {
      this.errorMsg = '' + JSON.stringify(err);
    } finally {
      this.generating = true;
    }
  }
}
