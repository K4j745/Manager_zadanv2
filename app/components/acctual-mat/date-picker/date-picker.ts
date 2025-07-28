import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';

/** @title Basic datepicker */
@Component({
  selector: 'app-datepicker',
  templateUrl: './date-picker.html',
  providers: [provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Datepicker implements OnInit {
  public minDate!: string;
  ngOnInit(): void {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = (today.getMonth() + 1).toString().padStart(2, '0');
    const dd = today.getDate().toString().padStart(2, '0');
    this.minDate = `${yyyy}-${mm}-${dd}`;
  }
}
