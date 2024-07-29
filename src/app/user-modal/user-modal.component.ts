import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { RouterExtService } from '../router-ext-service.service';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent implements OnInit{

  modal :Modal | undefined;

  constructor(private el: ElementRef, private router: Router, private routerExt: RouterExtService) {}

  ngOnInit(): void {
  this.modal = new Modal(this.el.nativeElement.querySelector('#modalId'));
    if(this.routerExt.getNavigationStart() === "/") {
      this.showModal();
    }
  }

  showModal(){
    this.modal!.show();
  }

  closeModal() {
    this.modal!.hide();
    this.router.navigateByUrl('/generate');
  }

}
