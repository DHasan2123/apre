import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from '../../../shared/table/table.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-feedback-by-month',
  standalone: true,
  imports: [ReactiveFormsModule, TableComponent],
  template: `
    <h1>Customer Feedback by Month</h1>
    <div class="feedback-container">

      <!-- Form to select month -->
      <form class="form" [formGroup]="monthForm" (ngSubmit)="onSubmit()">
        <div class="form__group">
          <label for="month">Select Month:</label>
          <select class="select" formControlName="month" id="month" name="month" required>
            <option value="" disabled selected>Select a month</option>
            <option value=1>January</option>
            <option value=2>February</option>
            <option value=3>March</option>
            <option value=4>April</option>
            <option value=5>May</option>
            <option value=6>June</option>
            <option value=7>July</option>
            <option value=8>August</option>
            <option value=9>September</option>
            <option value=10>October</option>
            <option value=11>November</option>
            <option value=12>December</option>
          </select>
        </div>

        <div class="form__actions">
          <input type="submit" class="button button--primary" value="Generate Report" />
        </div>
      </form>

      <!-- Display table only if data exists -->
      <div *ngIf="feedbackData.length > 0" class="card chart-card">
        <app-table
          [title]="'Feedback for ' + selectedMonth"
          [data]="feedbackData"
          [headers]="headers">
        </app-table>
      </div>
    </div>
  `,
  styles: [`
    /* Add your styles here */
  `]
})
export class FeedbackByMonthComponent {
  feedbackData: any[] = [];

  headers = ['region', 'category', 'channel', 'salesperson', 'customer', 'feedbackType', 'feedbackText', 'feedbackSource', 'feedbackStatus'];

  monthForm = this.fb.group({
    month: [null as number | null, Validators.required]
  });

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  get selectedMonth(): string {
    const monthNum = this.monthForm.controls['month'].value;

    switch (monthNum) {
      case 1: return 'January';
      case 2: return 'February';
      case 3: return 'March';
      case 4: return 'April';
      case 5: return 'May';
      case 6: return 'June';
      case 7: return 'July';
      case 8: return 'August';
      case 9: return 'September';
      case 10: return 'October';
      case 11: return 'November';
      case 12: return 'December';
      default: return '';
    }
  }

  onSubmit() {
    const selectedMonth = this.monthForm.controls['month'].value;

    this.http.get(`${environment.apiBaseUrl}/reports/customer-feedback/feedback-by-month?month=${selectedMonth}`).subscribe({
      next: (data) => {
        this.feedbackData = data as any[];
      },
      error: (err) => {
        console.error('Error fetching customer feedback data:', err);
      }
    });
  }
}
