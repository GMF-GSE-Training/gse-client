import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ViewCertificateComponent } from './view-certificate.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CertificateService } from '../../../../shared/service/certificate.service';
import { SweetalertService } from '../../../../shared/service/sweetalert.service';
import { ErrorHandlerService } from '../../../../shared/service/error-handler.service';
import { EnvironmentService } from '../../../../shared/service/environment.service';

// Mock child components
@Component({
  selector: 'app-display-files',
  template: '<ng-content></ng-content>'
})
class MockDisplayFilesComponent {
  @Input() pageTitle: string = '';
  @Input() navigationLinks: string = '';
  @Input() isLoading: boolean = false;
  @Input() showDeleteButton: boolean = false;
  @Output() downloadChange = new EventEmitter<void>();
  @Output() deleteChange = new EventEmitter<void>();
}

@Component({
  selector: 'app-loader',
  template: '<div>Loading...</div>'
})
class MockLoaderComponent {}

describe('ViewCertificateComponent', () => {
  let component: ViewCertificateComponent;
  let fixture: ComponentFixture<ViewCertificateComponent>;

  beforeEach(async () => {
    const mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('test-certificate-id')
        }
      }
    };

    const mockRouter = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    const mockLocation = {
      back: jasmine.createSpy('back')
    };

    const mockDomSanitizer = {
      bypassSecurityTrustResourceUrl: jasmine.createSpy('bypassSecurityTrustResourceUrl').and.callFake((url: string) => {
        return {
          changingThisBreaksApplicationSecurity: url,
          toString: () => url
        } as any;
      })
    };

    const mockCertificateService = {
      getCertificateById: jasmine.createSpy('getCertificateById').and.returnValue(of({
        data: {
          id: 'test-certificate-id',
          cotId: 'test-cot-id',
          participantId: 'test-participant-id',
          participant: {
            id: 'test-participant-id',
            name: 'Test Participant',
            idNumber: '12345'
          }
        }
      })),
      getCertificatePdf: jasmine.createSpy('getCertificatePdf').and.returnValue(of(new Blob(['mock PDF'], { type: 'application/pdf' }))),
      deleteCertificate: jasmine.createSpy('deleteCertificate').and.returnValue(of({ message: 'Success' }))
    };

    const mockSweetalertService = {
      confirm: jasmine.createSpy('confirm').and.returnValue(Promise.resolve(true)),
      alert: jasmine.createSpy('alert').and.returnValue(Promise.resolve()),
      loading: jasmine.createSpy('loading'),
      close: jasmine.createSpy('close')
    };

    const mockErrorHandlerService = {
      alertError: jasmine.createSpy('alertError')
    };

    const mockEnvironmentService = {
      apiUrl: '',
      buildUrl: jasmine.createSpy('buildUrl').and.returnValue('/api')
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation },
        { provide: DomSanitizer, useValue: mockDomSanitizer },
        { provide: CertificateService, useValue: mockCertificateService },
        { provide: SweetalertService, useValue: mockSweetalertService },
        { provide: ErrorHandlerService, useValue: mockErrorHandlerService },
        { provide: EnvironmentService, useValue: mockEnvironmentService }
      ]
    })
    
    // Override the imports for the standalone component
    TestBed.overrideComponent(ViewCertificateComponent, {
      set: {
        imports: [MockDisplayFilesComponent, MockLoaderComponent],
        template: `
          <app-display-files
            pageTitle="View Certificate"
            [navigationLinks]="getNavigationLink()"
            [isLoading]="isLoading"
            [showDeleteButton]="true"
            (downloadChange)="downloadPdf()"
            (deleteChange)="deleteCertificate()">
            
            @if(isLoading) {
              <app-loader></app-loader>
            } @else {
              @if(pdfUrl && !isLoadingPdf && !pdfError) {
                <div>PDF Content Mock</div>
              } @else if(isLoadingPdf) {
                <div>Loading PDF...</div>
              } @else if(pdfError) {
                <div>PDF Error</div>
              } @else if(!certificate) {
                <div>Certificate not found</div>
              }
            }
          </app-display-files>
        `
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with certificate ID from route params', () => {
    expect(component.certificateId).toBe('test-certificate-id');
  });

  it('should load certificate data on init', () => {
    const certificateService = TestBed.inject(CertificateService);
    expect(certificateService.getCertificateById).toHaveBeenCalledWith('test-certificate-id');
    expect(component.certificate).toBeTruthy();
    expect(component.certificate?.id).toBe('test-certificate-id');
  });

  it('should return correct navigation link when certificate is loaded', () => {
    const navigationLink = component.getNavigationLink();
    expect(navigationLink).toBe('/cot/test-cot-id/detail');
  });

  it('should return default navigation link when certificate is not loaded', () => {
    component.certificate = null;
    const navigationLink = component.getNavigationLink();
    expect(navigationLink).toBe('/cot');
  });

  it('should call router.navigateByUrl when deleteCertificate is successful', async () => {
    const router = TestBed.inject(Router);
    const sweetalertService = TestBed.inject(SweetalertService);
    
    await component.deleteCertificate();
    
    expect(sweetalertService.confirm).toHaveBeenCalled();
    expect(sweetalertService.loading).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/cot/certificate/test-cot-id/create/test-participant-id');
  });

  it('should handle loading state correctly', () => {
    component.isLoading = true;
    expect(component.isLoading).toBe(true);
    
    component.isLoading = false;
    expect(component.isLoading).toBe(false);
  });
  
  it('should have proper initial state', async () => {
    // Reset component to initial state before the ngOnInit lifecycle
    component = new ViewCertificateComponent(
      TestBed.inject(CertificateService),
      TestBed.inject(SweetalertService),
      TestBed.inject(ErrorHandlerService),
      TestBed.inject(ActivatedRoute),
      TestBed.inject(Router),
      TestBed.inject(Location),
      TestBed.inject(DomSanitizer)
    );
    
    // Check initial state before any lifecycle methods are called
    expect(component.pdfUrl).toBeNull();
    expect(component.isLoadingPdf).toBeFalse();
    expect(component.pdfError).toBeFalse();
  });
});
