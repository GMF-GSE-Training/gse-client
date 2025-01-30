import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPemegangKompetensiGseOperatorComponent } from './data-pemegang-kompetensi-gse-operator.component';

describe('DataPemegangKompetensiGseOperatorComponent', () => {
  let component: DataPemegangKompetensiGseOperatorComponent;
  let fixture: ComponentFixture<DataPemegangKompetensiGseOperatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataPemegangKompetensiGseOperatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataPemegangKompetensiGseOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
