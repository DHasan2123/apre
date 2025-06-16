import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AgentPerformanceDataComponent } from './agent-performance-data.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('AgentPerformanceDataComponent', () => {
  let component: AgentPerformanceDataComponent;
  let fixture: ComponentFixture<AgentPerformanceDataComponent>;
  let httpMock: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AgentPerformanceDataComponent, HttpClientTestingModule, ReactiveFormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentPerformanceDataComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should disable submit button when form is invalid', () => {
    component.agentForm.controls['agentId'].setValue(null);
    fixture.detectChanges();
    const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitBtn.disabled).toBeTrue();

    component.agentForm.controls['agentId'].setValue(1000);
    fixture.detectChanges();
    expect(submitBtn.disabled).toBeFalse();
  });

  it('should fetch performance data on form submit', () => {
    component.agentForm.controls['agentId'].setValue(1000);

    component.onSubmit();

    const req = httpMock.expectOne('/reports/agent-performance/performance-by-agent?agentId=1000');
    expect(req.request.method).toBe('GET');

    const mockResponse = [
      {
        date: '2023-01-15T00:00:00.000Z',
        region: 'North America',
        team: 'TeleSales Titans',
        customerFeedback: 'Very helpful and professional.',
        callDuration: 300,
        resolutionTime: 120
      }
    ];

    req.flush(mockResponse);

    expect(component.performanceData).toEqual(mockResponse);
  });
});
