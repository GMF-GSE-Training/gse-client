import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ParticipantListComponent } from './participant-list.component';
import { RoleBasedAccessDirective } from '../../../shared/directive/role-based-access.directive';

describe('ParticipantListComponent', () => {
  let component: ParticipantListComponent;
  let fixture: ComponentFixture<ParticipantListComponent>;

  // Mock khusus untuk RoleBasedAccessDirective
  const mockRoleBasedAccessDirective = {
    appRoleBasedAccess: jasmine.createSpy('appRoleBasedAccess'),
    loadRoleFromCache: jasmine.createSpy('loadRoleFromCache')
  };

  // Mock localStorage sebelum tes dimulai
  beforeAll(() => {
    spyOn(window.localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'user_profile') {
        return JSON.stringify({ role: { name: 'Admin' }, participant: { id: 'testId' } });
      }
      return null;
    });
    spyOn(window.localStorage, 'setItem');
    spyOn(window.localStorage, 'removeItem');
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ParticipantListComponent
      ],
      providers: [
        {
          provide: RoleBasedAccessDirective,
          useValue: mockRoleBasedAccessDirective
        },
        provideRouter([]),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [NO_ERRORS_SCHEMA]
      // No need to provide localStorage in TestBed providers if globally mocked
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    // Tidak perlu mereset panggilan spy, biarkan saja
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add other tests as needed, they will use the mocked localStorage
});
