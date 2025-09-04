import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFacture } from './form-facture';

describe('FormFacture', () => {
  let component: FormFacture;
  let fixture: ComponentFixture<FormFacture>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFacture]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormFacture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
