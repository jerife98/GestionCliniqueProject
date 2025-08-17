import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Malade } from './malade';

describe('Malade', () => {
  let component: Malade;
  let fixture: ComponentFixture<Malade>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Malade]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Malade);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
