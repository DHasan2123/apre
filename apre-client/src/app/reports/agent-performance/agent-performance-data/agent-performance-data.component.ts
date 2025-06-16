import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-agent-performance-data',
  template: `
    <h2>Agent Performance Data</h2>

    <form [formGroup]="agentForm" (ngSubmit)="onSubmit()">
      <label for="agentId">Select Agent:</label>
      <select id="agentId" formControlName="agentId">
        <option value="" disabled>Select an agent</option>
        <option *ngFor="let agent of agents" [value]="agent">{{ agent }}</option>
      </select>
      <button type="submit" [disabled]="agentForm.invalid">Get Performance</button>
    </form>

    <table *ngIf="performanceData.length > 0">
      <thead>
        <tr>
          <th>Date</th>
          <th>Region</th>
          <th>Team</th>
          <th>Customer Feedback</th>
          <th>Call Duration (sec)</th>
          <th>Resolution Time (sec)</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let record of performanceData">
          <td>{{ record.date | date:'mediumDate' }}</td>
          <td>{{ record.region }}</td>
          <td>{{ record.team }}</td>
          <td>{{ record.customerFeedback }}</td>
          <td>{{ record.callDuration }}</td>
          <td>{{ record.resolutionTime }}</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
    form {
      margin-bottom: 1rem;
    }
    select {
      margin-left: 0.5rem;
      margin-right: 1rem;
    }
    button {
      cursor: pointer;
    }
    table {
      width: 100%;
      border-collapse: collapse; /* replaces cellspacing="0" */
      margin-top: 1rem;
      border: 1px solid #ccc;
    }
    th, td {
      padding: 0.5rem 1rem;
      border: 1px solid #ccc;
      text-align: left;
    }
    th {
      background-color: #eee;
    }
  `]
})
export class AgentPerformanceDataComponent implements OnInit {
  agents: number[] = [];
  performanceData: any[] = [];

  agentForm = this.fb.group({
    agentId: [null as number | null, Validators.required]
  });

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAgents();
  }

  loadAgents(): void {
    this.http.get<number[]>('/reports/agent-performance/agents').subscribe({
      next: agents => this.agents = agents,
      error: err => console.error('Error loading agents', err)
    });
  }

  onSubmit(): void {
    if (this.agentForm.invalid) return;
    const agentId = this.agentForm.value.agentId!;
    this.http.get<any[]>(`/reports/agent-performance/performance-by-agent?agentId=${agentId}`).subscribe({
      next: data => this.performanceData = data,
      error: err => console.error('Error loading performance data', err)
    });
  }
}
