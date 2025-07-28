import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subject, takeUntil, take, map } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from '../../../services/manager.service';
import { Form } from '../../../form/form';
import { FormSaveDto } from '../../../models/form-save-dto';

/**
 * @title Binding event handlers and properties to the table rows.
 */
@Component({
  selector: 'table-row-binding-example',
  standalone: true,
  styleUrl: './tabel-mat.scss',
  templateUrl: './tabel-mat.html',
  imports: [MatTableModule],
})
export class TableRowBindingExample implements OnInit, OnDestroy {
  tasks$!: Observable<FormSaveDto[]>;
  selectedTasksMap: { [id: string]: boolean } = {};
  allSelected = false;

  // Subject do zarządzania unsubscribe
  private destroy$ = new Subject<void>();

  //Deklaracja zmiennej komunikatu do edycji
  public editErrorMessage: string | null = null;
  public showAlert = false;

  private currentTasks: FormSaveDto[] = [];

  constructor(
    private readonly taskService: TaskService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.tasks$ = this.taskService.getTasks();

    // Pojedyncza subskrypcja z wynikami
    this.tasks$.pipe(takeUntil(this.destroy$)).subscribe((tasks) => {
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
      // alert('Musisz zaznaczyć zadanie/a, żeby zmienić status.'); //fajny alert
      return; // Brak zaznaczonych elementów
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
      //alert('Zaznacz dokładnie jedno zadanie do edycji.'); //alternatywa alertu
      this.editErrorMessage = 'Zaznacz dokładnie jedno zadanie do edycji.';
      this.showAlert = true;

      setTimeout(() => {
        this.showAlert = false;
        setTimeout(() => {
          this.editErrorMessage = null;
        }, 400);
      }, 3500);

      return;
    }
    this.editErrorMessage = null; // czyszczę zmienną

    const taskToEdit = this.currentTasks.find(
      (task) => task.id === selectedTaskIds[0]
    );
    if (!taskToEdit) return;

    const modalRef = this.modalService.open(Form);
    modalRef.componentInstance.formDataToEdit = taskToEdit; //To było potrzebne
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
      // alert('Musisz zaznaczyć zadanie/a, żeby je usunąć.'); //alternatywa alertu
      return; // Gdy nic nie zaznaczone
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
}
