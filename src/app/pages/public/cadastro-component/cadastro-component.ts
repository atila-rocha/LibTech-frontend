import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { cpfValidator, phoneValidator, passwordMatchValidator, maskCpf, maskPhone } from '../../../validators/custom-validators';

@Component({
  selector: 'app-cadastro-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cadastro-component.html',
  styleUrl: './cadastro-component.css',
})
export class CadastroComponent {
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  cadastroForm = new FormGroup({
    nome: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    cpf: new FormControl('', [
      Validators.required,
      cpfValidator()
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    telefone: new FormControl('', [
      Validators.required,
      phoneValidator()
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ]),  
    passwordConfirm: new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ]),
    isAdmin: new FormControl(false, [
      Validators.required
    ])
  }, { validators: passwordMatchValidator() });


  onCpfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const maskedValue = maskCpf(input.value);
    this.cadastroForm.patchValue({ cpf: maskedValue });
  }


  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const maskedValue = maskPhone(input.value);
    this.cadastroForm.patchValue({ telefone: maskedValue });
  }


  onSubmit(): void {
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
      return;
    }

    if (this.cadastroForm.hasError('passwordMismatch')) {
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    const formValue = this.cadastroForm.value;

    const cpfLimpo = formValue.cpf?.replace(/[^\d]/g, '') || '';
    const telefoneLimpo = formValue.telefone?.replace(/[^\d]/g, '') || '';

    const isAdminValue=formValue.isAdmin===true;
    
    const userData = {
      name: formValue.nome!,
      cpf: cpfLimpo,
      email: formValue.email!,
      phone: telefoneLimpo,
      password: formValue.password!, // O backend deve fazer o hash
      isAdmin: isAdminValue //|| false
    };
    console.log(userData);
    this.userService.register(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Cadastro realizado com sucesso! Redirecionando para login...';
        this.cadastroForm.reset();
        
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Erro ao realizar cadastro. Tente novamente.';
        console.error('Erro no cadastro:', error);
      }
    });
  }


  goToLogin(): void {
    this.router.navigate(['/']);
  }
}