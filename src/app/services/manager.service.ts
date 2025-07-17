import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormSaveDto } from '../models/form-save-dto';

const TASKS_STORAGE_KEY = 'tasks';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksSubject = new BehaviorSubject<FormSaveDto[]>([]);
  public tasks$: Observable<FormSaveDto[]> = this.tasksSubject.asObservable();

  private get currentTasks(): FormSaveDto[] {
    return this.tasksSubject.getValue();
  }

  constructor() {
    this.loadFromLocalStorage(); // <- załaduj zadania po starcie
  }

  // Dodaje nowe zadanie
  addTask(dto: FormSaveDto): void {
    // Jeśli nie ma ID, generuj losowe
    if (!dto.id) {
      dto.id = crypto.randomUUID(); // lub jakikolwiek unikalny identyfikator
    }
    const updated = [...this.currentTasks, dto];
    this.updateState(updated);
    //this.tasksSubject.next([...this.currentTasks, dto]);
  }

  // Usuwa zadanie po ID
  removeTask(id: string): void {
    const updated = this.currentTasks.filter((task) => task.id !== id);
    this.updateState(updated);
    // this.tasksSubject.next(updated);
  }

  // Aktualizuje istniejące zadanie
  updateTask(updatedTask: FormSaveDto): void {
    const updated = this.currentTasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    this.updateState(updated);
    // this.tasksSubject.next(updated);
  }

  // Zwraca observable listy
  getTasks(): Observable<FormSaveDto[]> {
    return this.tasks$;
  }

  // Zastępuje całą listę
  setTasks(tasks: FormSaveDto[]): void {
    this.updateState(tasks);
    //this.tasksSubject.next(tasks);
  }
  private updateState(tasks: FormSaveDto[]): void {
    this.tasksSubject.next(tasks);
    this.saveToLocalStorage(tasks);
  }
  private saveToLocalStorage(tasks: FormSaveDto[]): void {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }
  private loadFromLocalStorage(): void {
    const data = localStorage.getItem(TASKS_STORAGE_KEY);
    if (data) {
      try {
        const tasks = JSON.parse(data) as FormSaveDto[];
        this.tasksSubject.next(tasks);
      } catch (err) {
        console.error('Błąd przy wczytywaniu danych z localStorage', err);
        this.tasksSubject.next([]); // fallback
      }
    }
  }
}
