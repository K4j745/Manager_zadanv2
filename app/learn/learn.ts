// src/app/learn/learn.component.ts

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Flashcard } from '../models/flashcard-model';
import { FlashcardsState } from '../../state/flashcard.state';
import { FlashcardsActions } from '../../state/flashcard.action';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './learn.html',
  styleUrls: ['./learn.scss'],
})
export class Learn implements OnInit {
  // Observables połączone ze stanem NGXS
  //@Select(UsersState.getUsers) users$!: Observable<User[]>;

  // Should become the following
  //users$: Observable<User[]> = inject(Store).select(UsersState.getUsers);
  //@Select(FlashcardsState.getFlashcards) flashcards$!: Observable<Flashcard[]>;
  // flashcards$: Observable<Flashcard[]> = inject(Store).select(
  //   FlashcardsState.getFlashcards
  // );
  // //@Select(FlashcardsState.getSelectedFlashcard)
  // selectedFlashcard$!: Observable<Flashcard | null>;
  // @Select(FlashcardsState.isLoading) loading$!: Observable<boolean>;
  // @Select(FlashcardsState.getError) error$!: Observable<string | null>;
  // @Select(FlashcardsState.getCurrentLevelFilter)
  // currentLevelFilter$!: Observable<1 | 2 | 3 | null>;
  private store = inject(Store);

  // === Selektory jako obserwable ===
  flashcards$: Observable<Flashcard[]> = this.store.select(
    FlashcardsState.getFlashcards
  );
  selectedFlashcard$: Observable<Flashcard | null> = this.store.select(
    FlashcardsState.getSelectedFlashcard
  );
  loading$: Observable<boolean> = this.store.select(FlashcardsState.isLoading);
  error$: Observable<string | null> = this.store.select(
    FlashcardsState.getError
  );
  currentLevelFilter$: Observable<1 | 2 | 3 | null> = this.store.select(
    FlashcardsState.getCurrentLevelFilter
  );
  // Lokalne zmienne dla UI
  showAnswer = false;
  currentCardIndex = 0;
  studyMode: 'all' | 'level' = 'all';

  //constructor(private store: Store) {}

  ngOnInit(): void {
    // Załaduj flashcards przy inicjalizacji
    this.loadFlashcards();
  }

  // === METODY ŁADOWANIA DANYCH ===
  loadFlashcards(): void {
    this.store.dispatch(new FlashcardsActions.LoadFlashcards());
  }

  // === METODY FILTROWANIA ===
  filterByLevel(level: 1 | 2 | 3 | null): void {
    this.store.dispatch(new FlashcardsActions.FilterByLevel(level));
    this.studyMode = level ? 'level' : 'all';
    this.currentCardIndex = 0;
    this.showAnswer = false;
  }

  // === METODY NAUKI ===
  selectFlashcard(flashcardId: number): void {
    this.store.dispatch(new FlashcardsActions.SelectFlashcard(flashcardId));
    this.showAnswer = false;
  }

  toggleAnswer(): void {
    this.showAnswer = !this.showAnswer;
  }

  nextCard(flashcards: Flashcard[]): void {
    if (flashcards.length > 0) {
      this.currentCardIndex = (this.currentCardIndex + 1) % flashcards.length;
      this.showAnswer = false;
      this.selectFlashcard(flashcards[this.currentCardIndex].id);
    }
  }

  previousCard(flashcards: Flashcard[]): void {
    if (flashcards.length > 0) {
      this.currentCardIndex =
        this.currentCardIndex === 0
          ? flashcards.length - 1
          : this.currentCardIndex - 1;
      this.showAnswer = false;
      this.selectFlashcard(flashcards[this.currentCardIndex].id);
    }
  }

  // === UTILITY METHODS ===
  getCurrentCard(flashcards: Flashcard[]): Flashcard | null {
    return flashcards.length > 0 ? flashcards[this.currentCardIndex] : null;
  }

  getProgressPercentage(flashcards: Flashcard[]): number {
    return flashcards.length > 0
      ? Math.round(((this.currentCardIndex + 1) / flashcards.length) * 100)
      : 0;
  }

  clearSelection(): void {
    this.store.dispatch(new FlashcardsActions.ClearSelectedFlashcard());
    this.showAnswer = false;
  }

  // === METODY DO RESTART NAUKI ===
  restartLearning(): void {
    this.currentCardIndex = 0;
    this.showAnswer = false;
    this.loadFlashcards();
  }
}
