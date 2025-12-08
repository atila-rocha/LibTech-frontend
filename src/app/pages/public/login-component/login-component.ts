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
    if(this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.login('ALUNO');
  }

  /**
   * Login como Administrador
   */
  onSubmitAdmin() {
    if(this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.login('ADMIN');
  }

  /**
   * Método genérico de login
   */
  private login(tipoEsperado: 'ALUNO' | 'ADMIN') {
    this.errorMessage = '';
    this.isLoading = true;

    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // Verifica se o tipo de usuário corresponde ao botão clicado
        if (response.tipo !== tipoEsperado) {
          this.errorMessage = `Você não tem permissão de ${tipoEsperado.toLowerCase()}.`;
          this.authService.logout();
          return;
        }

        // Redireciona conforme o tipo de usuário
        if (response.tipo === 'ADMIN') {
          this.router.navigate(['/admin/dashboardadm']);
        } else {
          this.router.navigate(['/users/dashboard']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Erro ao fazer login. Tente novamente.';
        console.error('Erro no login:', error);
      }
    });
  }

  onSubmit() {
    // Método mantido para compatibilidade (pode remover se não usar)
    if(this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
  }

  /** Soft reload: re-navega para a mesma rota sem forçar reload total da página. */
  softReload() {
    const current = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(current);
    });
  }

  /** Full reload: recarrega toda a página (equivalente a F5). */
  fullReload() {
    window.location.reload();
  }

  /** Navega para a página de cadastro de usuário */
  goToCadastro() {
    this.router.navigate(['/cadastro']);
  }

}
