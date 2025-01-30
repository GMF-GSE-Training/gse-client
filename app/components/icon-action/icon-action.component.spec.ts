import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconActionComponent } from './icon-action.component';

describe('IconActionComponent', () => {
  let component: IconActionComponent;
  let fixture: ComponentFixture<IconActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconActionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IconActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
