import { Priorytet, Kategoria } from './form-enum';

export interface FormSaveDto {
  id: string;
  nazwaZadania: string;
  kategoria: Kategoria;
  data: Date;
  priorytet: Priorytet;
  status?: boolean;
}
