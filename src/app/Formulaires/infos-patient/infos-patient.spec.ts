import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosPatient } from './infos-patient';

describe('InfosPatient', () => {
  let component: InfosPatient;
  let fixture: ComponentFixture<InfosPatient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfosPatient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfosPatient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
