import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FeedbackByMonthComponent } from './feedback-by-month.component';
import { TableComponent } from '../../../shared/table/table.component';
import { By } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';

describe('FeedbackByMonthComponent', () => {
  let component: FeedbackByMonthComponent;
  let fixture: ComponentFixture<FeedbackByMonthComponent>;
  let httpMock: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, TableComponent],
      declarations: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackByMonthComponent);
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

  it('should make the month form control required', () => {
    const monthControl = component.monthForm.controls['month'];
    expect(monthControl.valid).toBeFalse();

    monthControl.setValue(5); // May
    expect(monthControl.valid).toBeTrue();
  });

  it('should fetch data on form submit and update feedbackData', () => {
    const testData = [
      { region: 'East', category: 'Service', feedbackText: 'Great!' },
      { region: 'West', category: 'Product', feedbackText: 'Good' }
    ];

    component.monthForm.controls['month'].setValue(3); // March

    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/reports/customer-feedback/feedback-by-month?month=3`);
    expect(req.request.method).toBe('GET');

    req.flush(testData);

    expect(component.feedbackData.length).toBe(2);
    expect(component.feedbackData[0].region).toBe('East');
    expect(component.feedbackData[1].feedbackText).toBe('Good');
  });
});
