import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface UserRegisterRequest {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  password: string;
  isAdmin?: boolean;
}

export interface UserRegisterResponse {
  id: number;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  isAdmin: boolean;
}

export interface UserResponseDTO {
  id: number;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  isAdmin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) {}

  register(userData: UserRegisterRequest): Observable<UserRegisterResponse> {
    return this.http.post<UserRegisterResponse>(`${this.apiUrl}`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  
  getUserById(id: number): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  
  getUserByEmail(email: string): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${this.apiUrl}/email/${email}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  
  getUserByCpf(cpf: string): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${this.apiUrl}/cpf/${cpf}`)
      .pipe(
        catchError(this.handleError)
      );
  }

 
  updateUser(id: number, userData: UserRegisterRequest): Observable<UserResponseDTO> {
    return this.http.put<UserResponseDTO>(`${this.apiUrl}/${id}`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  
  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/email/${email}`)
      .pipe(
        catchError(() => throwError(() => new Error('Erro ao verificar email')))
      );
  }

  checkCpfExists(cpf: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/cpf/${cpf}`)
      .pipe(
        catchError(() => throwError(() => new Error('Erro ao verificar CPF')))
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
          errorMessage = 'Usuário não encontrado.';
          break;
        case 409:
          errorMessage = 'Email ou CPF já cadastrado no sistema.';
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