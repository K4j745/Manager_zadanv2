import {
  Component,
  Inject,
  OnInit,
  Output,
  output,
  EventEmitter,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { FormModel } from '../models/form-model';
import { ToastrService } from 'ngx-toastr';
import { FormSaveDto } from '../models/form-save-dto';
import { ValidateMessageComponent } from '../components/validate-message/validate-message.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Kategoria, Priorytet } from '../models/form-enum';
import { PrimaryExpression } from 'typescript';
import { TaskService } from '../services/manager.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardActions, MatCardModule } from '@angular/material/card';
//import { MatCardContent } from '../../../node_modules/@angular/material/card/index';
import { Datepicker } from '../components/acctual-mat/date-picker/date-picker';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    ValidateMessageComponent,
    MatCardActions,
    //MatCardContent,
    Datepicker,
    MatCardModule,
    MatDatepickerModule,
    FormsModule,
    MatIconModule,
    CommonModule,
  ],
  providers: [provideNativeDateAdapter()],
  standalone: true,
  templateUrl: './form.html',
  styleUrl: './form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Form implements OnInit {
  @Output() sendApplication = new EventEmitter<{
    dto: FormSaveDto;
    form: FormGroup<FormModel>;
  }>();

  //nazwaFormControl = new FormControl('', [Validators.required, Validators]);
  public form!: FormGroup<FormModel>;

  // Pobieranie danych do formularza przy edycji
  @Input() formDataToEdit?: FormSaveDto;

  // Deklaracja do sprawdzenia obecnej daty
  public minDate!: string;

  constructor(
    private readonly _formBuilder: FormBuilder, //private readonly _toastr: ToastrService
    private readonly taskService: TaskService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    //ustawienie blokady dla kontrolki
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = (today.getMonth() + 1).toString().padStart(2, '0');
    const dd = today.getDate().toString().padStart(2, '0');
    this.minDate = `${yyyy}-${mm}-${dd}`;

    this.form = this._formBuilder.group<FormModel>({
      nazwaZadania: new FormControl<string | null>(null, [Validators.required]),
      kategoria: new FormControl<Kategoria | null>(null, [Validators.required]),
      data: new FormControl<Date | null>(null, [Validators.required]),
      priorytet: new FormControl<Priorytet | null>(null, [Validators.required]),
    });
    if (this.formDataToEdit) {
      this.form.patchValue({
        nazwaZadania: this.formDataToEdit.nazwaZadania,
        kategoria: this.formDataToEdit.kategoria,
        data: this.formDataToEdit.data,
        priorytet: this.formDataToEdit.priorytet,
      });
    }
    console.log('Odebrano do edycji:', this.formDataToEdit);
  }
  get f() {
    return this.form.controls;
  }
  public showValidationMessages = true;
  public onCancel(): void {
    this.showValidationMessages = false;

    // Resetujemy formularz
    this.form.reset();

    // Resetujemy dotknięcia pól (touched/dirty)
    this.form.markAsPristine();
    this.form.markAsUntouched();

    // Zamykanie modala
    this.activeModal.dismiss();
  }
  public onSendApplication(): void {
    console.warn(this.form.controls);
    //oznaczenie formularza i jego poprzez markAsTouched
    this.form.markAllAsTouched(); //*
    // console.warn(this.form.controls['data'].value);
    // console.warn(this.form.controls['priorytet'].value);
    // console.warn(this.form.controls['kategoria'].value);
    // console.warn(this.form.controls['nazwaZadania'].value);

    // Sprawdzenie czy formularz jest invlaid, jeżeli tak to przerywa funkcje
    if (this.form.invalid) {
      //this._toastr.error('Wypełnij wszystkie wymagane pola!', 'Błąd!');
      return;
    }
    // jeżeli jest w porządku to przypisuje do zmiennej savedto
    const { nazwaZadania, kategoria, data, priorytet } = this.form.value;

    if (!nazwaZadania || !kategoria || !data || !priorytet) {
      return;
    }

    const dto: FormSaveDto = {
      id: this.formDataToEdit?.id ?? crypto.randomUUID(),
      nazwaZadania: nazwaZadania!,
      kategoria: kategoria!,
      data: data!,
      priorytet: priorytet!,
      status: this.formDataToEdit?.status ?? false,
    };
    if (this.formDataToEdit) {
      this.taskService.updateTask(dto); // warunek do edycji
    } else {
      this.taskService.addTask(dto);
    }
    this.sendApplication.emit({
      dto,
      form: this.form,
    });
    console.log(this.activeModal);
    this.activeModal.close({ dto });
  }
}
