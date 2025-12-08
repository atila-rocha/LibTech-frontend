import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tipo: 'ALUNO' | 'ADMIN';
  email: string;
  nome?: string;
}

export interface Usuario {
  email: string;
  nome?: string;
  tipo: 'ALUNO' | 'ADMIN';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api'; // Usando proxy
  private currentUserSubject: BehaviorSubject<Usuario | null>;
  public currentUser: Observable<Usuario | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Recupera usuário do localStorage ao iniciar
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<Usuario | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Usuario | null {
    return this.currentUserSubject.value;
  }

  /**
   * Faz login no sistema
   * @param email Email do usuário
   * @param password Senha do usuário
   * @returns Observable com resposta do login
   */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          // Armazena token e dados do usuário
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            const usuario: Usuario = {
              email: response.email,
              nome: response.nome,
              tipo: response.tipo
            };
            localStorage.setItem('currentUser', JSON.stringify(usuario));
            this.currentUserSubject.next(usuario);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Faz logout do sistema
   */
  logout(): void {
    // Remove dados do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    
    // Redireciona para login
    this.router.navigate(['/']);
  }

  /**
   * Verifica se usuário está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Obtém o token JWT armazenado
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Verifica se o token JWT expirou
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      return (Math.floor((new Date).getTime() / 1000)) >= expiry;
    } catch (e) {
      return true; // Se não conseguir decodificar, considera expirado
    }
  }

  /**
   * Verifica se usuário é administrador
   */
  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user?.tipo === 'ADMIN';
  }

  /**
   * Verifica se usuário é aluno
   */
  isAluno(): boolean {
    const user = this.currentUserValue;
    return user?.tipo === 'ALUNO';
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
        case 401:
          errorMessage = 'Email ou senha inválidos!';
          break;
        case 403:
          errorMessage = 'Acesso negado!';
          break;
        case 404:
          errorMessage = 'Serviço não encontrado!';
          break;
        case 500:
          errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
          break;
        default:
          errorMessage = `Erro ${error.status}: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
