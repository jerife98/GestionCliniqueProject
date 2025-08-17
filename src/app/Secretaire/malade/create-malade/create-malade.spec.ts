import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMalade } from './create-malade';

describe('CreateMalade', () => {
  let component: CreateMalade;
  let fixture: ComponentFixture<CreateMalade>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMalade]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMalade);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
