import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersComponent } from './users.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UserRow } from '../models/user-row';
import { of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { FormsModule } from '@angular/forms';
import { UserSearchFormComponent } from '../user-search-form/user-search-form.component';
import { UserPaginationComponent } from '../user-pagination/user-pagination.component';
import { UserListRowComponent } from '../user-list-row/user-list-row.component';
import { UserService } from '../services/user.service';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let injectedService: UserService;
  let pageData = {
    users: [
      {
        id: uuidv4(),
        username: 'test',
        roles: ['admin'],
        enabled: true,
      },
      {
        id: uuidv4(),
        username: 'test2',
        roles: ['admin'],
        enabled: true,
      },
      {
        id: uuidv4(),
        username: 'test3',
        roles: ['admin'],
        enabled: false,
      },
      {
        id: uuidv4(),
        username: 'test4',
        roles: ['admin'],
        enabled: false,
      },
    ],
    totalPages: 3,
    offScreen: {
      id: uuidv4(),
      username: 'user1',
      roles: ['admin'],
      enabled: false,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        UsersComponent,
        UserSearchFormComponent,
        UserPaginationComponent,
        UserListRowComponent,
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'users', component: UsersComponent },
        ]),
        FormsModule,
      ],
    }).compileComponents();
    injectedService = TestBed.get(UserService);
    spyOn(injectedService, 'getPage').and.returnValue(pageData);
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // fetchUserPage
  it('displays users list on start', () => {
    const event = 1;
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(injectedService.getPage).toHaveBeenCalledWith(event, '');
    expect(
      fixture.nativeElement.querySelector('.container').textContent,
    ).toContain(pageData.users[2].roles[0]);
    expect(
      fixture.nativeElement.querySelector('.container').textContent,
    ).not.toContain(pageData.users[2].username);
  });

  // fetchUserPage
  it('should call fetchUserPage with the correct event data', () => {
    const event = 2;
    component.fetchUserPage(event);
    expect(injectedService.getPage).toHaveBeenCalledWith(event, '');
  });

  // handleDeleteUser
  it('should call handleDeleteUser with the correct event data', () => {
    const event: UserRow = {
      id: '123',
      username: '',
      roles: [],
      enabled: false,
      delete: {
        loading: false,
      },
      disable: {
        loading: false,
      },
    };
    spyOn(injectedService, 'deleteUser').and.returnValue(
      of({ itemsDeleted: 1 }),
    );
    spyOn(window, 'confirm').and.callFake(() => true);
    component.handleDeleteUser(event);
    expect(injectedService.deleteUser).toHaveBeenCalledWith(event.id);
  });

  // handleDisableUser
  it('should call handleDisableUser with the correct event data', () => {
    const event: UserRow = {
      id: '123',
      username: '',
      roles: [],
      enabled: false,
      delete: {
        loading: false,
      },
      disable: {
        loading: false,
      },
    };
    spyOn(injectedService, 'setUserActiveState').and.returnValue(of(true));
    spyOn(window, 'confirm').and.callFake(() => true);
    component.handleDisableUser(event);
    expect(injectedService.setUserActiveState).toHaveBeenCalledWith(
      event.id,
      true,
    );
  });

  // onSearchFormSubmit
  it('should call onSearchFormSubmit with the correct event data', () => {
    const event = 'search text';
    component.onSearchFormSubmit(event);
    expect(injectedService.getPage).toHaveBeenCalledWith(1, event);
  });
});
