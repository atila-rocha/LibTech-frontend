import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface BookRequestDTO {
  title: string;
  author: string;
  isbn?: string;
  publishedYear: number;
  tema: string;
}

export interface BookResponseDTO {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  publishedYear: number;
}

export interface BookWithStatsDTO {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  publishedYear: number;
  totalAvaliacoes: number;
  percentualBom: number;
  percentualRegular: number;
  percentualRuim: number;
}

export interface BookAllocationRequestDTO {
  bookId: number;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8080/books';
  private allocationUrl = 'http://localhost:8080/allocation';

  constructor(private http: HttpClient) {}

  
  createBook(bookData: BookRequestDTO): Observable<BookResponseDTO> {
    return this.http.post<BookResponseDTO>(`${this.apiUrl}`, bookData)
      .pipe(
        catchError(this.handleError)
      );
  }

  
  getBookById(id: number): Observable<BookResponseDTO> {
    return this.http.get<BookResponseDTO>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  
  getBookByTitle(title: string): Observable<BookResponseDTO> {
    return this.http.get<BookResponseDTO>(`${this.apiUrl}/title/${title}`)
      .pipe(
        catchError(this.handleError)
      );
  }

 
  getBookByIsbn(isbn: string): Observable<BookResponseDTO> {
    return this.http.get<BookResponseDTO>(`${this.apiUrl}/isbn/${isbn}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  
  getAllBooks(): Observable<BookResponseDTO[]> {
    return this.http.get<BookResponseDTO[]>(`${this.apiUrl}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  
  getAllBooksWithStats(): Observable<BookWithStatsDTO[]> {
    return this.http.get<BookWithStatsDTO[]>(`${this.apiUrl}/with/stats`)
      .pipe(
        catchError(this.handleError)
      );
  }

  
  searchByTitle(title: string): Observable<BookResponseDTO[]> {
    return this.http.get<BookResponseDTO[]>(`${this.apiUrl}/title/ignoreCase/${title}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  
  searchByAuthor(author: string): Observable<BookResponseDTO[]> {
    return this.http.get<BookResponseDTO[]>(`${this.apiUrl}/author/ignoreCase/contains/${author}`)
      .pipe(
        catchError(this.handleError)
      );
  }

 
  searchByTema(tema: string): Observable<BookResponseDTO[]> {
    return this.http.get<BookResponseDTO[]>(`${this.apiUrl}/tema/ignoreCase/contains/${tema}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  
  updateBook(id: number, bookData: BookRequestDTO): Observable<BookResponseDTO> {
    return this.http.put<BookResponseDTO>(`${this.apiUrl}/${id}`, bookData)
      .pipe(
        catchError(this.handleError)
      );
  }

  
  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  
  checkIsbnExists(isbn: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/isbn/${isbn}`)
      .pipe(
        catchError(() => throwError(() => new Error('Erro ao verificar ISBN')))
      );
  }

  
  checkTitleExists(title: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/title/${title}`)
      .pipe(
        catchError(() => throwError(() => new Error('Erro ao verificar título')))
      );
  }

  
  allocateBook(allocationRequest: BookAllocationRequestDTO): Observable<BookResponseDTO> {
    return this.http.post<BookResponseDTO>(`${this.allocationUrl}/allocate`, allocationRequest)
      .pipe(
        catchError(this.handleError)
      );
  }

  
  deallocateBook(bookId: number): Observable<BookResponseDTO> {
    return this.http.delete<BookResponseDTO>(`${this.allocationUrl}/deallocate/${bookId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  
  getBooksAllocatedToUser(userId: number): Observable<BookResponseDTO[]> {
    return this.http.get<BookResponseDTO[]>(`${this.allocationUrl}/user/${userId}/allocated`)
      .pipe(
        catchError(this.handleError)
      );
  }

 
  getAvailableBooks(): Observable<BookResponseDTO[]> {
    return this.http.get<BookResponseDTO[]>(`${this.allocationUrl}/available`)
      .pipe(
        catchError(this.handleError)
      );
  }

  
  countBooksAllocatedToUser(userId: number): Observable<number> {
    return this.http.get<number>(`${this.allocationUrl}/user/${userId}/allocation-count`)
      .pipe(
        catchError(this.handleError)
      );
  }

 
  isBookAllocated(bookId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.allocationUrl}/${bookId}/is-allocated`)
      .pipe(
        catchError(this.handleError)
      );
  }

 
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido!';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.';
          break;
        case 404:
          errorMessage = 'Livro não encontrado.';
          break;
        case 409:
          errorMessage = 'Este livro já está cadastrado no sistema.';
          break;
        case 422:
          errorMessage = 'Dados inválidos. Verifique todos os campos.';
          break;
        case 500:
          errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
          break;
        default:
          errorMessage = error.error?.message || `Erro ${error.status}: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}