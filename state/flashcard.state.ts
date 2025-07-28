// src/app/store/flashcards.state.ts

import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { Flashcard } from '../app/models/flashcard-model';
import { FlashcardsService } from '../app/services/flashcard.service';
import { FlashcardsActions } from './flashcard.action';

// Model stanu
export interface FlashcardsStateModel {
  flashcards: Flashcard[];
  filteredFlashcards: Flashcard[];
  selectedFlashcard: Flashcard | null;
  loading: boolean;
  error: string | null;
  currentLevelFilter: 1 | 2 | 3 | null;
}

// Początkowy stan
const defaultState: FlashcardsStateModel = {
  flashcards: [],
  filteredFlashcards: [],
  selectedFlashcard: null,
  loading: false,
  error: null,
  currentLevelFilter: null,
};

@State<FlashcardsStateModel>({
  name: 'flashcards',
  defaults: defaultState,
})
@Injectable()
export class FlashcardsState {
  constructor(private flashcardsService: FlashcardsService) {}

  // Selektory
  @Selector()
  static getFlashcards(state: FlashcardsStateModel): Flashcard[] {
    return state.filteredFlashcards.length > 0
      ? state.filteredFlashcards
      : state.flashcards;
  }

  @Selector()
  static getSelectedFlashcard(state: FlashcardsStateModel): Flashcard | null {
    return state.selectedFlashcard;
  }

  @Selector()
  static isLoading(state: FlashcardsStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static getError(state: FlashcardsStateModel): string | null {
    return state.error;
  }

  @Selector()
  static getCurrentLevelFilter(state: FlashcardsStateModel): 1 | 2 | 3 | null {
    return state.currentLevelFilter;
  }

  // Selektor dla flashcards według poziomu
  @Selector()
  static getFlashcardsByLevel(state: FlashcardsStateModel) {
    return (level: 1 | 2 | 3) => {
      return state.flashcards.filter((card) => card.level === level);
    };
  }

  // Actions handlers
  @Action(FlashcardsActions.LoadFlashcards)
  loadFlashcards(ctx: StateContext<FlashcardsStateModel>) {
    ctx.patchState({ loading: true, error: null });

    return this.flashcardsService.getAllFlashcards().pipe(
      tap((flashcards) => {
        ctx.dispatch(new FlashcardsActions.LoadFlashcardsSuccess(flashcards));
      }),
      catchError((error) => {
        ctx.dispatch(new FlashcardsActions.LoadFlashcardsError(error));
        return throwError(() => error);
      })
    );
  }

  @Action(FlashcardsActions.LoadFlashcardsSuccess)
  loadFlashcardsSuccess(
    ctx: StateContext<FlashcardsStateModel>,
    action: FlashcardsActions.LoadFlashcardsSuccess
  ) {
    ctx.patchState({
      flashcards: action.flashcards,
      filteredFlashcards: [],
      loading: false,
      error: null,
    });
  }

  @Action(FlashcardsActions.LoadFlashcardsError)
  loadFlashcardsError(
    ctx: StateContext<FlashcardsStateModel>,
    action: FlashcardsActions.LoadFlashcardsError
  ) {
    ctx.patchState({
      loading: false,
      error: 'Błąd podczas ładowania flashcards: ' + action.error.message,
    });
  }

  @Action(FlashcardsActions.FilterByLevel)
  filterByLevel(
    ctx: StateContext<FlashcardsStateModel>,
    action: FlashcardsActions.FilterByLevel
  ) {
    const state = ctx.getState();

    let filteredFlashcards: Flashcard[];

    if (action.level === null) {
      // Pokaż wszystkie
      filteredFlashcards = [];
    } else {
      // Filtruj według poziomu
      filteredFlashcards = state.flashcards.filter(
        (card) => card.level === action.level
      );
    }

    ctx.patchState({
      filteredFlashcards,
      currentLevelFilter: action.level,
    });
  }

  @Action(FlashcardsActions.SelectFlashcard)
  selectFlashcard(
    ctx: StateContext<FlashcardsStateModel>,
    action: FlashcardsActions.SelectFlashcard
  ) {
    const state = ctx.getState();
    const selectedFlashcard =
      state.flashcards.find((card) => card.id === action.flashcardId) || null;

    ctx.patchState({
      selectedFlashcard,
    });
  }

  @Action(FlashcardsActions.ClearSelectedFlashcard)
  clearSelectedFlashcard(ctx: StateContext<FlashcardsStateModel>) {
    ctx.patchState({
      selectedFlashcard: null,
    });
  }
}
