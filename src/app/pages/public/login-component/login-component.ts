import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css'],
})
export class LoginComponent {

  constructor(private router: Router) {}

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

  onSubmit() {
    if(this.loginForm.invalid) {
      this.loginForm.markAllAsTouched()
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
