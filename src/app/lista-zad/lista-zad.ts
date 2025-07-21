import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { TaskService } from '../services/manager.service';
import { FormSaveDto } from '../models/form-save-dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subject, takeUntil, take, map } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Form } from '../form/form';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  MatExpansionModule,
  MatExpansionPanel,
} from '@angular/material/expansion';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-lista-zad',
  standalone: true,
  templateUrl: './lista-zad.html',
  styleUrls: ['./lista-zad.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    CdkTableModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    //MatSnackBar,
    MatSnackBarModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class ListaZadComponent implements OnInit, OnDestroy {
  tasks$!: Observable<FormSaveDto[]>;
  @ViewChild('filtersPanel') filtersPanel!: MatExpansionPanel;
  selectedTasksMap: { [id: string]: boolean } = {};
  allSelected = false;
  filters = {
    kategoria: [] as string[],
    priorytet: [] as string[],
    status: null as boolean | null,
  };
  availableCategories: string[] = ['Praca', 'Dom', 'Zakupy', 'Studia'];
  availablePriorities: string[] = ['Niski', 'Średni', 'Wysoki'];
  availableStatuses = [
    { value: null, viewValue: 'Wszystkie' },
    { value: true, viewValue: 'Ukończone' },
    { value: false, viewValue: 'Nieukończone' },
  ];

  // Subject do zarządzania unsubscribe
  private destroy$ = new Subject<void>();

  //Deklaracja zmiennej komunikatu do edycji
  //public editErrorMessage: string | null = null; //nie potrzebne bo robimysnackbarem
  public showAlert = false;

  public currentTasks: FormSaveDto[] = [];
  private allTasks: FormSaveDto[] = [];
  private filteredTasks: FormSaveDto[] = [];
  displayedColumns: string[] = [
    'select',
    'index',
    'nazwaZadania',
    'kategoria',
    'data',
    'priorytet',
    'status',
  ];

  constructor(
    private snackBar: MatSnackBar,
    private readonly taskService: TaskService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.tasks$ = this.taskService.getTasks();

    // Pojedyncza subskrypcja z wynikami
    this.tasks$.pipe(takeUntil(this.destroy$)).subscribe((tasks) => {
      this.allTasks = tasks || [];
      this.filteredTasks = [...this.allTasks];
      this.currentTasks = tasks || [];
      this.updateAllSelectedState();
    });
  }

  ngOnDestroy(): void {
    // Czyszczenie subskrypcji
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.allSelected = checked;

    // Używaj cached tasks zamiast nowej subskrypcji
    this.currentTasks.forEach((task) => {
      this.selectedTasksMap[task.id] = checked;
    });
  }

  markSelectedAsCompleted(): void {
    // Sprawdź czy są zaznaczone elementy
    const selectedTaskIds = Object.keys(this.selectedTasksMap).filter(
      (id) => this.selectedTasksMap[id]
    );

    if (selectedTaskIds.length === 0) {
      this.snackBar.open(
        'Żeby ukończyć zadanie/a, musisz je najpierw zaznaczyć.',
        'OK',
        {
          duration: 3500,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        }
      );
      return;
      // alert('Musisz zaznaczyć zadanie/a, żeby zmienić status.'); //fajny alert
      //return; // Brak zaznaczonych elementów
    }

    // Używaj cached tasks i wykonaj operacje asynchronicznie
    const tasksToUpdate = this.currentTasks.filter(
      (task) => this.selectedTasksMap[task.id]
    );

    tasksToUpdate.forEach((task) => {
      if (task.status !== true) {
        const updatedTask = { ...task, status: true };
        this.taskService.updateTask(updatedTask);
      }
    });

    this.clearSelection();
  }

  editSelected(): void {
    const selectedTaskIds = Object.keys(this.selectedTasksMap).filter(
      (id) => this.selectedTasksMap[id]
    );

    if (selectedTaskIds.length !== 1) {
      this.snackBar.open('Zaznacz dokładnie jedno zadanie do edycji.', 'OK', {
        duration: 3500,
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
      return;
      //alert('Zaznacz dokładnie jedno zadanie do edycji.'); //alternatywa alertu
      // this.editErrorMessage = 'Zaznacz dokładnie jedno zadanie do edycji.';
      // this.showAlert = true;
      // setTimeout(() => {
      //   this.showAlert = false;
      //   setTimeout(() => {
      //     this.editErrorMessage = null;
      //   }, 400);
      // }, 3500);
      // return;
    }
    //this.editErrorMessage = null; // czyszczę zmienną nie potrzebne - snackbar

    const taskToEdit = this.currentTasks.find(
      (task) => task.id === selectedTaskIds[0]
    );
    if (!taskToEdit) return;

    const modalRef = this.modalService.open(Form);
    modalRef.componentInstance.formDataToEdit = taskToEdit; //To było potrzebne
    modalRef.componentInstance.isEditMode = true;
    //modalRef.componentInstance.form.patchValue(taskToEdit);

    modalRef.result
      .then((result) => {
        if (result?.dto) {
          const updatedTask: FormSaveDto = {
            ...result.dto,
            id: taskToEdit.id,
            status: taskToEdit.status ?? false,
          };
          this.taskService.updateTask(updatedTask);
          this.clearSelection();
        }
      })
      .catch(() => {
        // Modal zamknięty bez zapisu
      });
    //   //dane do formularza
    //   modalRef.componentInstance.taskData = taskToEdit;

    //   modalRef.result
    //     .then((updatedTask: FormSaveDto) => {
    //       this.taskService.updateTask(updatedTask);
    //       this.clearSelection();
    //     })
    //     .catch(() => {
    //       // np. kliknięto „Anuluj”
    //     });
  }

  removeSelected(): void {
    //Czy zaznaczone?
    const selectedTaskIds = Object.keys(this.selectedTasksMap).filter(
      (id) => this.selectedTasksMap[id]
    );

    if (selectedTaskIds.length === 0) {
      this.snackBar.open(
        'Żeby usunąć zadanie/a, musisz je najpierw zaznaczyć.',
        'OK',
        {
          duration: 3500,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        }
      );
      return;
      // alert('Musisz zaznaczyć zadanie/a, żeby je usunąć.'); //alternatywa alertu
      // return; // Gdy nic nie zaznaczone
    }

    const tasksToRemove = this.currentTasks.filter(
      (task) => this.selectedTasksMap[task.id]
    );

    // Wykonywanie usunięć
    tasksToRemove.forEach((task) => {
      this.taskService.removeTask(task.id);
      delete this.selectedTasksMap[task.id];
    });

    // Czyszczenie selekcji
    this.clearSelection();
  }

  // Metoda do czyszczenia selekcji
  private clearSelection(): void {
    this.selectedTasksMap = {};
    this.allSelected = false;
  }

  // Metoda do aktualizacji stanu "select all"
  private updateAllSelectedState(): void {
    const totalTasks = this.currentTasks.length;
    const selectedCount = Object.values(this.selectedTasksMap).filter(
      Boolean
    ).length;

    this.allSelected = totalTasks > 0 && selectedCount === totalTasks;
  }

  // Metoda do sprawdzania czy task jest zaznaczony
  isTaskSelected(taskId: string): boolean {
    return !!this.selectedTasksMap[taskId];
  }

  // Metoda do przełączania pojedynczego zadania
  toggleTaskSelection(taskId: string): void {
    this.selectedTasksMap[taskId] = !this.selectedTasksMap[taskId];
    this.updateAllSelectedState();
  }

  // Metoda do sprawdzania czy są jakieś zaznaczone zadania
  hasSelectedTasks(): boolean {
    return Object.values(this.selectedTasksMap).some(Boolean);
  }

  // Metoda do zliczania zaznaczonych zadań
  getSelectedTasksCount(): number {
    return Object.values(this.selectedTasksMap).filter(Boolean).length;
  }
  applyFilters(): void {
    this.filteredTasks = this.allTasks.filter((task) => {
      //filtrowanie kategoriia
      if (
        this.filters.kategoria.length > 0 &&
        !this.filters.kategoria.includes(task.kategoria)
      ) {
        return false;
      }

      //filtrowanie priorytet
      if (
        this.filters.priorytet.length > 0 &&
        !this.filters.priorytet.includes(task.priorytet)
      ) {
        return false;
      }
      //status
      if (this.filters.status !== null && task.status !== this.filters.status) {
        return false;
      }
      return true;
    });
    this.currentTasks = this.filteredTasks;
    this.updateAllSelectedState();
    this.filtersPanel.close();
  }
  resetFilters(): void {
    this.filters = {
      kategoria: [],
      priorytet: [],
      status: null,
    };
    this.filteredTasks = [...this.allTasks];
    this.currentTasks = this.filteredTasks;
    this.updateAllSelectedState();
  }
}
