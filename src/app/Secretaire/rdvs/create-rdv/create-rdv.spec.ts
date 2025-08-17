import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRdv } from './create-rdv';

describe('CreateRdv', () => {
  let component: CreateRdv;
  let fixture: ComponentFixture<CreateRdv>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRdv]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRdv);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
