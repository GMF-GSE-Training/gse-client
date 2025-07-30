import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DataJumlahPemegangSertifikatComponent } from './data-jumlah-pemegang-sertifikat.component';

describe('DataJumlahPemegangSertifikatComponent', () => {
  let component: DataJumlahPemegangSertifikatComponent;
  let fixture: ComponentFixture<DataJumlahPemegangSertifikatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataJumlahPemegangSertifikatComponent, HttpClientTestingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataJumlahPemegangSertifikatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
