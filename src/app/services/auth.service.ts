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
  acess_token: string;
  tipo: boolean;
  email: string;
  nome?: string;
  id?: number;
}

export interface Usuario {
  email: string;
  nome?: string;
  tipo: boolean;
  id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private currentUserSubject: BehaviorSubject<Usuario | null>;
  public currentUser: Observable<Usuario | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<Usuario | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Usuario | null {
      const user = this.currentUserSubject.value;
      console.log('🔍 currentUserValue:', user);
      console.log('📦 localStorage currentUser:', localStorage.getItem('currentUser'));
      return user;
      }


  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          console.log('📦 Resposta do servidor:', response);
          
          if (response && response.acess_token) {
            localStorage.setItem('token', response.acess_token);
            console.log('✅ Token salvo');
          
            const usuario: Usuario = {
              email: response.email,
              nome: response.nome,
              tipo: response.tipo,
              id: response.id  
            };
            
            console.log('👤 Usuário a ser salvo:', usuario);
            localStorage.setItem('currentUser', JSON.stringify(usuario));
            console.log('✅ currentUser salvo:', usuario);
          
            localStorage.setItem('userType', response.tipo.toString());
            console.log('✅ userType salvo:', response.tipo);
          
            this.currentUserSubject.next(usuario);
          }
        }),
        catchError(this.handleError)
      );
  }


  logout(): void {
    console.log('🚪 Fazendo logout...');
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }


  isAuthenticated(): boolean {
    const token = this.getToken();
    const isAuth = !!token && !this.isTokenExpired(token);
    console.log('🔍 isAuthenticated:', isAuth);
    return isAuth;
  }


  getToken(): string | null {
    return localStorage.getItem('token');
  }

 
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      return (Math.floor((new Date).getTime() / 1000)) >= expiry;
    } catch (e) {
      return true;
    }
  }


  isAdmin(): boolean {
    const user = this.currentUserValue;
    const isAdm = user?.tipo === true;
    console.log('🔍 isAdmin:', isAdm, '(tipo:', user?.tipo, ')');
    return isAdm;
  }


  isAluno(): boolean {
    const user = this.currentUserValue;
    const isAl = user?.tipo === false;
    console.log('🔍 isAluno:', isAl, '(tipo:', user?.tipo, ')');
    return isAl;
  }


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido!';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
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
    
    console.error('❌ Erro:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}