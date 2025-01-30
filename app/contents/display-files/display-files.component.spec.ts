import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayFilesComponent } from './display-files.component';

describe('DisplayFilesComponent', () => {
  let component: DisplayFilesComponent;
  let fixture: ComponentFixture<DisplayFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayFilesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplayFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
