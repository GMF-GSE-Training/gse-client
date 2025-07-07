import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { CommonModule } from '@angular/common';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, CommonModule],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle menu visibility', () => {
    expect(component.isMenuVisible).toBeFalse();
    component.toggleMenu();
    expect(component.isMenuVisible).toBeTrue();
    component.onMenuClose();
    expect(component.isMenuVisible).toBeFalse();
  });

  it('should return fallback userName if not in localStorage', () => {
    localStorage.clear();
    expect(component.userName).toBe('Pengguna');
  });
});