// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { Flashcard } from '../models/flashcard-model';

// @Injectable({ providedIn: 'root' })
// export class FlashcardsService {
//   constructor(private http: HttpClient) {}
//   public getFlashcards(): Observable<Flashcard[]> {
//     return this.http.get<Flashcard[]>('assets/flashcards.json');
//   }
// }
// src/app/services/flashcards.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay } from 'rxjs';
import { Flashcard } from '../models/flashcard-model';

@Injectable({
  providedIn: 'root',
})
export class FlashcardsService {
  private readonly JSON_PATH = 'assets/flashcards.json';

  constructor(private http: HttpClient) {}

  /**
   * Pobiera wszystkie flashcards z pliku JSON
   * Symuluje zapytanie HTTP z małym opóźnieniem
   */
  getAllFlashcards(): Observable<Flashcard[]> {
    return this.http.get<Flashcard[]>(this.JSON_PATH).pipe(
      delay(500) // Symulujemy opóźnienie sieciowe
    );
  }

  /**
   * Pobiera flashcards dla określonego poziomu
   */
  getFlashcardsByLevel(level: 1 | 2 | 3): Observable<Flashcard[]> {
    return new Observable((observer) => {
      this.getAllFlashcards().subscribe({
        next: (flashcards) => {
          const filtered = flashcards.filter((card) => card.level === level);
          observer.next(filtered);
          observer.complete();
        },
        error: (error) => observer.error(error),
      });
    });
  }

  /**
   * Pobiera pojedynczą flashcard po ID
   */
  getFlashcardById(id: number): Observable<Flashcard | undefined> {
    return new Observable((observer) => {
      this.getAllFlashcards().subscribe({
        next: (flashcards) => {
          const card = flashcards.find((card) => card.id === id);
          observer.next(card);
          observer.complete();
        },
        error: (error) => observer.error(error),
      });
    });
  }
}
