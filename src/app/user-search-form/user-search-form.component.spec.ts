import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSearchFormComponent } from './user-search-form.component';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

describe('UserSearchFormComponent', () => {
  let component: UserSearchFormComponent;
  let fixture: ComponentFixture<UserSearchFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [UserSearchFormComponent],
    });
    fixture = TestBed.createComponent(UserSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // spy on observable subscriptions
  function createObservableSpy<T>(observable: Observable<T>) {
    const spy = jasmine.createSpy('subscribeSpy');
    observable.subscribe(spy);
    return spy;
  }

  it('should submit on button click', (done) => {
    let searchQuery: string = 'search test input';

    // Mock parent component or service as needed
    const spy = createObservableSpy(component.searchFormSubmit);

    // Check if the onSubmit function was called with the correct input
    fixture.whenStable().then(() => {
      // Fill input with something
      const inputElement = fixture.nativeElement.querySelector('input');
      inputElement.value = searchQuery;
      inputElement.dispatchEvent(new Event('input'));

      // Trigger click on the button
      const buttonElement = fixture.nativeElement.querySelector('button');
      buttonElement.click();
      expect(spy).toHaveBeenCalledWith(searchQuery);
      done();
    });
  });

  it('should submit on press Enter', (done) => {
    let searchQuery: string = 'search test input';

    // Mock parent component or service as needed
    const spy = createObservableSpy(component.searchFormSubmit);

    // Check if the onSubmit function was called with the correct input
    fixture.whenStable().then(() => {
      // Fill input with something
      const inputElement = fixture.nativeElement.querySelector('input');
      inputElement.value = searchQuery;
      inputElement.dispatchEvent(new Event('input'));

      // Trigger Enter key press event
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      inputElement.dispatchEvent(event);

      expect(spy).toHaveBeenCalledWith(searchQuery);
      done();
    });
  });
});
