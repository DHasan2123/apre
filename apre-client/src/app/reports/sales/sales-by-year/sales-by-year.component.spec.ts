import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesByYearComponent } from './sales-by-year.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SalesByYearComponent', () => {
  let component: SalesByYearComponent;
  let fixture: ComponentFixture<SalesByYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesByYearComponent, ReactiveFormsModule, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SalesByYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have 11 year options in the select dropdown', () => {
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    const yearOptions = Array.from(select.options).filter(option => option.value !== '');
    expect(yearOptions.length).toBe(11); // from 2020 to 2030
  });

 it('should have a required validator on the year field', () => {
  const yearControl = component.yearForm.get('year');
  yearControl?.setValue(null);
  expect(yearControl?.valid).toBeFalse();

  yearControl?.setValue('2024'); // <-- fixed type: string
  expect(yearControl?.valid).toBeTrue();
});
});
