import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Calendly } from './calendly';

describe('Calendly', () => {
  let component: Calendly;
  let fixture: ComponentFixture<Calendly>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Calendly]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Calendly);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
