// src/app/store/flashcards.actions.ts

import { Flashcard } from '../app/models/flashcard-model';

export namespace FlashcardsActions {
  export class LoadFlashcards {
    static readonly type = '[Flashcards] Load Flashcards';
  }

  export class LoadFlashcardsSuccess {
    static readonly type = '[Flashcards] Load Flashcards Success';
    constructor(public flashcards: Flashcard[]) {}
  }

  export class LoadFlashcardsError {
    static readonly type = '[Flashcards] Load Flashcards Error';
    constructor(public error: any) {}
  }

  export class FilterByLevel {
    static readonly type = '[Flashcards] Filter By Level';
    constructor(public level: 1 | 2 | 3 | null) {} // null = wszystkie poziomy
  }

  export class SelectFlashcard {
    static readonly type = '[Flashcards] Select Flashcard';
    constructor(public flashcardId: number) {}
  }

  export class ClearSelectedFlashcard {
    static readonly type = '[Flashcards] Clear Selected Flashcard';
  }
}
