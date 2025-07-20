import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { WhiteButtonComponent } from './white-button.component';

describe('WhiteButtonComponent', () => {
  let component: WhiteButtonComponent;
  let fixture: ComponentFixture<WhiteButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhiteButtonComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WhiteButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
