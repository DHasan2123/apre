import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from '../../../shared/table/table.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-sales-by-year',
  standalone: true,
  imports: [ReactiveFormsModule, TableComponent],
  template: `
    <h1>Sales by Year</h1>
    <div class="sales-container">

      <!-- form for year selection -->
      <form class="form" [formGroup]="yearForm" (ngSubmit)="onSubmit()">
        <div class="form__group">
          <label for="year">Select Year:</label>
          <select class="select" formControlName="year" id="year">
            <option value="" disabled selected>Select a year</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
            <option value="2029">2029</option>
            <option value="2030">2030</option>
          </select>
        </div>

        <div class="form__actions">
          <input type="submit" class="button button--primary" value="Generate Report" />
        </div>
      </form>

      <!-- display data table -->
      @if (salesData.length > 0) {
        <div class="card chart-card">
          <app-table
            [title]="'Sales for ' + selectedYear"
            [data]="salesData"
            [headers]="['region', 'product', 'category', 'salesperson', 'channel', 'amount']"
          ></app-table>
        </div>
      }
    </div>
  `,
  styles: `.sales-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
    }

    .form {
      max-width: 400px;
      width: 100%;
      background: #fff;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    }

    .form__group {
      margin-bottom: 1.25rem;
      display: flex;
      flex-direction: column;
    }

    label {
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .select {
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
    }

    .form__actions {
      text-align: right;
    }

    .button {
      padding: 0.5rem 1rem;
      font-size: 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .button--primary {
      background-color: #007bff;
      color: #fff;
    }

    .button--primary:hover {
      background-color: #0056b3;
    }

    .chart-card {
      margin-top: 2rem;
      width: 100%;
    }`
})
export class SalesByYearComponent {
  salesData: any[] = [];

  yearForm = this.fb.group({
  year: this.fb.control<string | null>(null, Validators.required)
});

  get selectedYear(): string {
  const year = this.yearForm.controls['year'].value;
  return year !== null ? String(year) : '';
}

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  onSubmit() {
  console.log('Form submitted:', this.yearForm.value);

  const selectedYear = this.yearForm.controls['year'].value;
  console.log('Selected year:', selectedYear);
  this.http.get(`${environment.apiBaseUrl}/reports/sales/sales-by-year?year=${selectedYear}`).subscribe({
    next: (data) => {
      console.log('Sales data received:', data);
      this.salesData = data as any[];
    },
    error: (err) => {
      console.error('Error fetching yearly sales data:', err);
    }
  });
}
}
