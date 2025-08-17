import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentUser } from './current-user';

describe('CurrentUser', () => {
  let component: CurrentUser;
  let fixture: ComponentFixture<CurrentUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
