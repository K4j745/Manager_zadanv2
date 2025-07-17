import { Component } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AdresyComponent } from '../components/materials_t/adresy/adresy.component';
import { NavigatorComponent } from '../components/materials_t/navigator/navigator.component';
import { TablicaComponent } from '../components/materials_t/tablica/tablica.component';
import { GrziComponent } from '../components/materials_t/grzi/grzi.component';
import { BonsaiComponent } from '../components/materials_t/bonsai/bonsai.component';
import { PrzeniesUpuscComponent } from '../components/materials_t/przenies-upusc/przenies-upusc.component';

@Component({
  selector: 'app-testy',
  imports: [
    MatSlideToggleModule,
    AdresyComponent,
    NavigatorComponent,
    TablicaComponent,
    GrziComponent,
    BonsaiComponent,
    PrzeniesUpuscComponent,
  ],
  templateUrl: './testy.html',
  styleUrl: './testy.scss',
})
export class Testy {}
