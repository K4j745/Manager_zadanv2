import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Form } from '../form/form';
import { ListaZadComponent } from '../components/lista-zad/lista-zad';
import { Testy } from '../testy/testy';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
// import { TaskList } from '../lista-zad/lista-zad';

@Component({
  selector: 'app-home',
  imports: [
    // Form /*, TaskList*/,
    ListaZadComponent /*Testy*/,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  constructor(private modalService: NgbModal) {}

  openModal() {
    console.log('Przycisk działa');
    this.modalService.open(Form, {
      backdrop: 'static',
      //centered: true,
    });
  }
}
