import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPaginationComponent } from './user-pagination.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('UserPaginationComponent', () => {
  let component: UserPaginationComponent;
  let fixture: ComponentFixture<UserPaginationComponent>;
  let mockData = {
    currentPage: 2,
    totalPages: 5,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserPaginationComponent],
    });
    fixture = TestBed.createComponent(UserPaginationComponent);
    component = fixture.componentInstance;
    component.currentPage = mockData.currentPage;
    component.totalPages = mockData.totalPages;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows current page', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.page-item.active')?.textContent).toContain(
      mockData.currentPage,
    );
  });

  it('shows all pages where the first and last buttons are next and previous', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const pageItems = compiled.querySelectorAll('.page-item');
    expect(pageItems.length).toEqual(mockData.totalPages + 2);
    expect(pageItems[0].textContent).toContain('«');
    expect(pageItems[mockData.totalPages + 1].textContent).toContain('»');
  });

  it('shows fetch page on demand ex: page 3', (done) => {
    const pageNumber = 3;
    const spy = jasmine.createSpy('fetchSpy');
    component.fetchUserPage.subscribe(spy);
    fixture.whenStable().then(() => {
      const compiled = fixture.debugElement;
      // previous [0] page-1[1]... page-3 [3]
      const button = compiled.queryAll(By.css('.page-item a'))[pageNumber].nativeElement;
      button.click();

      expect(spy).toHaveBeenCalledWith(pageNumber);
      done();
    });
  });
});
