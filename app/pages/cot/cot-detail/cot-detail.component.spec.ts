import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotDetailComponent } from './cot-detail.component';

describe('CotDetailComponent', () => {
  let component: CotDetailComponent;
  let fixture: ComponentFixture<CotDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CotDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CotDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
