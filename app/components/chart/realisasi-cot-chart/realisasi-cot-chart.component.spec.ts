import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealisasiCotChartComponent } from './realisasi-cot-chart.component';

describe('RealisasiCotChartComponent', () => {
  let component: RealisasiCotChartComponent;
  let fixture: ComponentFixture<RealisasiCotChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealisasiCotChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealisasiCotChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
