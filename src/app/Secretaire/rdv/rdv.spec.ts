import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RDV } from './rdv';

describe('RDV', () => {
  let component: RDV;
  let fixture: ComponentFixture<RDV>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RDV]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RDV);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
