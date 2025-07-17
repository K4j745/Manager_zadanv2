import { Form, FormControl } from '@angular/forms';
import { Kategoria, Priorytet } from './form-enum';

export type FormModel = {
  nazwaZadania: FormControl<string | null>;
  kategoria: FormControl<Kategoria | null>;
  data: FormControl<Date | null>;
  priorytet: FormControl<Priorytet | null>;
};
