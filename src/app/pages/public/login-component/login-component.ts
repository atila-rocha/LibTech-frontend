import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css'],
})
export class LoginComponent {
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ])
  })

  /**
   * Login como Aluno
   */
  onSubmitAluno() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.login(false);
  }

  /**
   * Login como Administrador
   */
  onSubmitAdmin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.login(true);
  }

  /**
   * Método genérico de login
   */
  private login(tipoEsperado: boolean) {
    this.errorMessage = '';
    this.isLoading = true;

    const { email, password } = this.loginForm.value;

    console.log('🔐 Iniciando login:', { email, tipoEsperado });

    this.authService.login(email!, password!).subscribe({
      next: (response) => {
        console.log('✅ Login bem-sucedido:', response);
        this.isLoading = false;

        // Validar tipo de usuário
        if (response.tipo === true && tipoEsperado === false) {
          this.errorMessage = 'Este usuário é ADMIN. Use o login de administrador.';
          this.authService.logout();
          return;
        }

        if (response.tipo === false && tipoEsperado === true) {
          this.errorMessage = 'Este usuário não é ADMIN. Use o login de aluno.';
          this.authService.logout();
          return;
        }

        console.log('🎯 Tipo de usuário validado. Redirecionando...');

        // Redirecionar conforme o tipo
        if (response.tipo === true) {
          console.log('➡️ Navegando para /admin/dashboardadm');
          this.router.navigate(['/admin/dashboardadm']).then(success => {
            console.log('✅ Navegação bem-sucedida:', success);
          });
        } else {
          console.log('➡️ Navegando para /users/dashboard');
          this.router.navigate(['/users/dashboard']).then(success => {
            console.log('✅ Navegação bem-sucedida:', success);
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('❌ Erro no login:', error);
        this.errorMessage = error.message || 'Erro ao fazer login. Tente novamente.';
      }
    });
  }

  goToCadastro() {
    this.router.navigate(['/cadastro']);
  }
}