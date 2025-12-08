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

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/users'; // Usando proxy

  constructor(private http: HttpClient) {}

  /**
   * Registra um novo usuário no sistema
   * @param userData Dados do usuário para cadastro
   * @returns Observable com resposta do cadastro
   */
  register(userData: UserRegisterRequest): Observable<UserRegisterResponse> {
    return this.http.post<UserRegisterResponse>(`${this.apiUrl}`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Verifica se um email já está cadastrado
   * @param email Email a ser verificado
   * @returns Observable com booleano indicando se existe
   */
  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/users/check-email?email=${email}`)
      .pipe(
        catchError(() => throwError(() => new Error('Erro ao verificar email')))
      );
  }

  /**
   * Verifica se um CPF já está cadastrado
   * @param cpf CPF a ser verificado
   * @returns Observable com booleano indicando se existe
   */
  checkCpfExists(cpf: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/users/check-cpf?cpf=${cpf}`)
      .pipe(
        catchError(() => throwError(() => new Error('Erro ao verificar CPF')))
      );
  }

  /**
   * Tratamento de erros HTTP
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido!';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      switch (error.status) {
        case 400:
          errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.';
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
