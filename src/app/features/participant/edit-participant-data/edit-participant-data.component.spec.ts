import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs'; // 'of' ditambahkan

import { EditParticipantDataComponent } from './edit-participant-data.component';
import { ParticipantService } from '../../../shared/service/participant.service';
import { SweetalertService } from '../../../shared/service/sweetalert.service';
import { Component, Input } from '@angular/core'; // Added for mock component

// Mock ParticipantFormComponent
@Component({
  selector: 'app-participant-form',
  standalone: true,
  template: '<div>Mock Participant Form</div>'
})
class MockParticipantFormComponent {
  @Input() pageTitle: string = '';
  @Input() participant: any = {};
  @Input() isUpdate: boolean = false;
  @Input() selectedCompany: string = '';
  @Input() companyName: string = '';
  @Input() showCompanyInput: boolean = false;
  @Input() backButtonRoute: string = '';
}

describe('EditParticipantDataComponent', () => {
  let router: Router;
  let navigateSpy: jasmine.Spy;
  let navigateByUrlSpy: jasmine.Spy;
  let component: EditParticipantDataComponent;
  let fixture: ComponentFixture<EditParticipantDataComponent>;

  beforeEach(async () => {
    // Mock localStorage
    spyOn(window.localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'user_profile') {
        // Ensure a more complete and safe structure, especially participant.id
        return JSON.stringify({
          role: { name: 'Admin' },
          participant: { id: 'testParticipantIdFromLocalStorage', email: 'test@example.com' }, // Make sure participant and id exist
          isDataComplete: true
        });
      }
      return null;
    });
    spyOn(window.localStorage, 'setItem');
    spyOn(window.localStorage, 'removeItem');

    await TestBed.configureTestingModule({
      imports: [EditParticipantDataComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
            paramMap: convertToParamMap({ participantId: 'testId' }), // Corrected key
            queryParamMap: convertToParamMap({}),
            queryParams: {} // Ensures params['showAlert'] is undefined in basic setup
          },
          paramMap: new BehaviorSubject(convertToParamMap({ participantId: 'testId' })), // Corrected key
          queryParamMap: new BehaviorSubject(convertToParamMap({})),
          queryParams: new BehaviorSubject({}), // Ensures params['showAlert'] is undefined
          url: new BehaviorSubject([])
          }
        },
        {
          provide: ParticipantService,
          useValue: {
            getParticipantById: jasmine.createSpy('getParticipantById').and.returnValue(of({
            data: {
              id: 'testId',
              name: 'Test Participant',
              dateOfBirth: new Date(1990, 5, 15).toISOString(), // Valid date string
              tglKeluarSuratSehatButaWarna: new Date(2023, 0, 10).toISOString(), // Valid date string
              tglKeluarSuratBebasNarkoba: new Date(2023, 0, 11).toISOString(), // Valid date string
              company: 'Test Company',
              gmfNonGmf: 'GMF'
              // Add other properties as needed by setParticipantData to avoid errors
            }
          }))
          }
        },
        {
          provide: SweetalertService,
          useValue: {
            alert: jasmine.createSpy('alert').and.resolveTo({ isConfirmed: true }),
            loading: jasmine.createSpy('loading'),
            fire: jasmine.createSpy('fire').and.resolveTo({ isConfirmed: true }),
            close: jasmine.createSpy('close')
          }
        }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditParticipantDataComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    navigateSpy = spyOn(router, 'navigate').and.callThrough();
    navigateByUrlSpy = spyOn(router, 'navigateByUrl').and.callThrough();

    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(navigateByUrlSpy).not.toHaveBeenCalled();
  });

  it('should not navigate if showAlert queryParam is not present during ngOnInit', () => {
    // ngOnInit is called in beforeEach, queryParams mock is empty by default
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(navigateByUrlSpy).not.toHaveBeenCalled();
  });

  it('should navigate to remove showAlert queryParam if present during ngOnInit', async () => {
    navigateSpy.calls.reset(); // Reset spy for this specific test
    navigateByUrlSpy.calls.reset();

    const activatedRouteMock = TestBed.inject(ActivatedRoute) as any;
    // Directly manipulate the BehaviorSubject that queryParams subscribes to
    (activatedRouteMock.queryParams as BehaviorSubject<any>).next({ showAlert: 'true' });

    // ngOnInit is already called, but the subscription will trigger with the new value.
    // If ngOnInit itself needs to be re-evaluated with new initial route state for queryParams,
    // a more complex TestBed re-configuration or component re-initialization might be needed.
    // For now, we assume the subscription reacts to the BehaviorSubject's new emission.
    fixture.detectChanges();
    await fixture.whenStable();

    expect(navigateSpy).toHaveBeenCalledWith([], {
      relativeTo: TestBed.inject(ActivatedRoute), // Access route instance via TestBed
      queryParams: { showAlert: null },
      queryParamsHandling: 'merge'
    });
  });
});
