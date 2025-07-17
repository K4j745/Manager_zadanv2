import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, DoCheck, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, skipWhile } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Kategoria, Priorytet } from '../../models/form-enum';

function validatorErrorMessage(
  validatorName: string,
  validatorValue?: any
): string {
  const config: {
    [key: string]: string;
  } = {
    // todo translate
    tooEarly: 'Data nie może być wcześniejsza niż dzisiejsza.',
    nazwaZadania: 'Musisz wpisać nazwę zadania.',
    kategoria: 'Musisz wybrać kategorię.',
    data: 'Musisz wybrać datę.',
    priorytet: 'Musisz określić priorytet.',
    required: 'To pole jest obowiązkowe.',
    maxlength: `Maksymalna liczba znaków to ${validatorValue['requiredLength']}.`,
    minlength: `Minimalna liczba znaków to ${validatorValue['requiredLength']}.`,
    pattern: 'Niepoprawny format.',
    requiredIfAgreementSms:
      'Numer telefonu jest wymagany, jeśli zgadzasz się na SMS/MMS.',
    backend:
      typeof validatorValue === 'object'
        ? validatorValue[Object.keys(validatorValue)[0]]
        : validatorValue,
  };

  return config[validatorName];
}

@Component({
  selector: 'www-validate-message',
  standalone: true,
  template: `
    @if (visible && control?.touched) { @if (errorMessage$ | async; as
    errorMessage) {
    <p class="vmc-error">
      {{ errorMessage }}
    </p>
    } }
  `,
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('150ms', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('150ms', style({ transform: 'translateX(100%)', opacity: 0 })),
      ]),
    ]),
  ],
  imports: [CommonModule],
  styleUrls: ['./validate-message.component.scss'],
})
export class ValidateMessageComponent implements DoCheck {
  private _errorMsg = new BehaviorSubject<string>('');
  public errorMessage$ = this._errorMsg.asObservable();
  private _touched = false;

  constructor(private readonly _destroyRef: DestroyRef) {}

  private _control: AbstractControl | null = null;

  get control(): AbstractControl | null {
    return this._control;
  }

  @Input() visible: boolean = true;
  @Input()
  set control(control: AbstractControl | null) {
    this._control = control;
    this._setValueChangeSubscription();
    this._setStatusChangeSubscription();
  }

  public ngDoCheck(): void {
    if (this._touched !== this.control?.touched) {
      this._touched = this.control?.touched || false;
      this._setErrorMessage();
    } else if (this.control?.errors && this.control?.errors['minlength']) {
      this._setErrorMessage();
    }
  }

  private _setValueChangeSubscription(): void {
    this.control?.valueChanges
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        debounceTime(25),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this._setErrorMessage();
      });
  }

  private _setStatusChangeSubscription(): void {
    this.control?.statusChanges
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        debounceTime(25),
        distinctUntilChanged(),
        skipWhile((status: string) => status !== 'INVALID')
      )
      .subscribe(() => {
        this._setErrorMessage();
      });
  }

  private _setErrorMessage(): void {
    let exists = false;
    console.warn(this.control?.errors);
    for (const propertyName in this.control?.errors) {
      // eslint-disable-next-line no-prototype-builtins
      if (this.control?.errors.hasOwnProperty(propertyName)) {
        exists = true;
        const errorMessage = validatorErrorMessage(
          propertyName,
          this.control.errors[propertyName]
        );
        this._errorMsg.next(errorMessage);
      }
    }
    if (!exists) {
      this._errorMsg.next('');
    }
  }
}
