import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rdvs } from './rdvs';

describe('Rdvs', () => {
  let component: Rdvs;
  let fixture: ComponentFixture<Rdvs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rdvs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Rdvs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
