// src/app/models/flashcard.model.ts

export interface Flashcard {
  id: number;
  front: string;
  back: string;
  level: 1 | 2 | 3; // Ograniczamy do 3 poziomów
}

// Dodatkowy typ dla odpowiedzi z API
export interface FlashcardsResponse {
  flashcards: Flashcard[];
}

// Enum dla poziomów (opcjonalnie, dla lepszej czytelności)
export enum FlashcardLevel {
  BEGINNER = 1,
  INTERMEDIATE = 2,
  ADVANCED = 3,
}
