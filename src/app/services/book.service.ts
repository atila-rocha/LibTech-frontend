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

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8080/books';

  constructor(private http: HttpClient) {}

  /**
   * Cria um novo livro no sistema
   */
  createBook(bookData: BookRequestDTO): Observable<BookResponseDTO> {
    return this.http.post<BookResponseDTO>(`${this.apiUrl}`, bookData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Busca livro por ID
   */
  getBookById(id: number): Observable<BookResponseDTO> {
    return this.http.get<BookResponseDTO>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Busca livro por título
   */
  getBookByTitle(title: string): Observable<BookResponseDTO> {
    return this.http.get<BookResponseDTO>(`${this.apiUrl}/title/${title}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Busca livro por ISBN
   */
  getBookByIsbn(isbn: string): Observable<BookResponseDTO> {
    return this.http.get<BookResponseDTO>(`${this.apiUrl}/isbn/${isbn}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Busca todos os livros
   */
  getAllBooks(): Observable<BookResponseDTO[]> {
    return this.http.get<BookResponseDTO[]>(`${this.apiUrl}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Busca livros por título (contém)
   */
  searchByTitle(title: string): Observable<BookResponseDTO[]> {
    return this.http.get<BookResponseDTO[]>(`${this.apiUrl}/title/ignoreCase/${title}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Busca livros por autor (contém)
   */
  searchByAuthor(author: string): Observable<BookResponseDTO[]> {
    return this.http.get<BookResponseDTO[]>(`${this.apiUrl}/author/ignoreCase/contains/${author}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Busca livros por tema (contém)
   */
  searchByTema(tema: string): Observable<BookResponseDTO[]> {
    return this.http.get<BookResponseDTO[]>(`${this.apiUrl}/tema/ignoreCase/contains/${tema}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Atualiza um livro
   */
  updateBook(id: number, bookData: BookRequestDTO): Observable<BookResponseDTO> {
    return this.http.put<BookResponseDTO>(`${this.apiUrl}/${id}`, bookData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Deleta um livro
   */
  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Verifica se ISBN já existe
   */
  checkIsbnExists(isbn: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/isbn/${isbn}`)
      .pipe(
        catchError(() => throwError(() => new Error('Erro ao verificar ISBN')))
      );
  }

  /**
   * Verifica se título já existe
   */
  checkTitleExists(title: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/title/${title}`)
      .pipe(
        catchError(() => throwError(() => new Error('Erro ao verificar título')))
      );
  }

  /**
   * Tratamento de erros HTTP
   */
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