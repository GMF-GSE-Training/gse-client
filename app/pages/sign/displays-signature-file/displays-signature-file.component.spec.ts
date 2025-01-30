import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaysSignatureFileComponent } from './displays-signature-file.component';

describe('DisplaysSignatureFileComponent', () => {
  let component: DisplaysSignatureFileComponent;
  let fixture: ComponentFixture<DisplaysSignatureFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplaysSignatureFileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplaysSignatureFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
