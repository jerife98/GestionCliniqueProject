import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdvDetailsDialog } from './rdv-details-dialog';

describe('RdvDetailsDialog', () => {
  let component: RdvDetailsDialog;
  let fixture: ComponentFixture<RdvDetailsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RdvDetailsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RdvDetailsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
