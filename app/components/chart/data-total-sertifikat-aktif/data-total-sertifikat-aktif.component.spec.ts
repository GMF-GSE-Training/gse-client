import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTotalSertifikatAktifComponent } from './data-total-sertifikat-aktif.component';

describe('DataTotalSertifikatAktifComponent', () => {
  let component: DataTotalSertifikatAktifComponent;
  let fixture: ComponentFixture<DataTotalSertifikatAktifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTotalSertifikatAktifComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataTotalSertifikatAktifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
