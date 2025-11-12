import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cadastro-component.html',
  styleUrl: './cadastro-component.css',
})
export class CadastroComponent {

   cadastroForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ]),  
      passwordConfirm: new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ]),

     cpf: new FormControl('', [
      Validators.required,
      Validators.minLength(11)
    ]),
     nome: new FormControl('', [
      Validators.required
    ]),
     telefone: new FormControl('', [
      Validators.required,
      Validators.minLength(11)
    ]),
    

  })

  onSubmit() {
    if(this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched()
      return;
    }
  }

}
