import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotListComponent } from './cot-list.component';

describe('CotListComponent', () => {
  let component: CotListComponent;
  let fixture: ComponentFixture<CotListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CotListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
