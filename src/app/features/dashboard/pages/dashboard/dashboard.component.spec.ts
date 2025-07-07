import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { CotService } from '../../../../shared/service/cot.service';
import { of } from 'rxjs';
import { CotResponse } from '../../../../shared/model/cot.model';
import { WebResponse } from '../../../../shared/model/web.model';
import { CommonModule } from '@angular/common';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockCotService: jasmine.SpyObj<CotService>;

  beforeEach(async () => {
    mockCotService = jasmine.createSpyObj('CotService', ['listCot']);

    const mockCotResponse: CotResponse[] = [
      {
        id: 'cot1',
        startDate: '2025-03-01',
        endDate: '2025-03-09',
        trainingLocation: 'Jakarta',
        numberOfParticipants: 1,
        status: true,
        capability: {
          id: 'cap1',
          ratingCode: 'A1',
          trainingCode: 'TC001',
          trainingName: 'Ground Power System',
        },
        theoryInstructorRegGse: '',
        theoryInstructorCompetency: '',
        practicalInstructor1: '',
        practicalInstructor2: '',
      },
    ];

    const mockResponse: WebResponse<CotResponse[]> = {
      code: 200,
      status: 'success',
      data: mockCotResponse,
      paging: { totalPage: 1, currentPage: 1, size: 6 },
    };

    mockCotService.listCot.and.returnValue(of(mockResponse));

    await TestBed.configureTestingModule({
      imports: [CommonModule, DashboardComponent],
      providers: [
        { provide: CotService, useValue: mockCotService },
        provideRouter([]),
        provideLocationMocks(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map cot data correctly', async () => {
    await component['fetchData']();
    expect(component.cot.length).toBe(1);
    expect(component.cot[0].trainingName).toBe('Ground Power System');
    expect(component.cot[0].ratingCode).toBe('A1');
  });
});
