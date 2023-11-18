import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateUsersComponent } from './generate-users.component';

describe('GenerateUsersComponent', () => {
  let component: GenerateUsersComponent;
  let fixture: ComponentFixture<GenerateUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateUsersComponent]
    });
    fixture = TestBed.createComponent(GenerateUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
