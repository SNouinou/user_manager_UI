import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListRowComponent } from './user-list-row.component';
import { By } from '@angular/platform-browser';

describe('UserListRowComponent', () => {
  let component: UserListRowComponent;
  let fixture: ComponentFixture<UserListRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserListRowComponent],
    });
    fixture = TestBed.createComponent(UserListRowComponent);
    component = fixture.componentInstance;

    // Mock a UserRow for testing
    component.user = {
      id: 'uuidv4()',
      username: 'admin',
      roles: ['admin'],
      enabled: false,
      delete: { loading: false },
      disable: { loading: false },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable user on button click', (done) => {
    const spy = jasmine.createSpy('spy');
    component.handleDisableUser.subscribe(spy);

    // Check if the onSubmit function was called with the correct input
    fixture.whenStable().then(() => {
      const disableButton = fixture.debugElement.query(
        By.css('[data-testid="disable-button"]')
      );
      disableButton.nativeElement.click();
      
      expect(spy).toHaveBeenCalledOnceWith(component.user);
      done();
    });
  });


  it('should delete user on button click', (done) => {
    const spy = jasmine.createSpy('spy');
    component.handleDeleteUser.subscribe(spy);

    // Check if the onSubmit function was called with the correct input
    fixture.whenStable().then(() => {
      const deleteButton = fixture.debugElement.query(
        By.css('[data-testid="delete-button"]')
      );
      deleteButton.nativeElement.click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledOnceWith(component.user);
      done();
    });
  });
});
