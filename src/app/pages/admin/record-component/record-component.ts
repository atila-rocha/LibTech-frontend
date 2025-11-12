import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-record-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './record-component.html',
  styleUrl: './record-component.css',
})
export class RecordComponent {
  cadastroForm = new FormGroup({
      titulo: new FormControl('', [
      Validators.required,
     
    ]),
      autor: new FormControl('', [
      Validators.required,
      
    ]), 
      tema: new FormControl('', [
      Validators.required,
      
    ]),
      anoPublicacao: new FormControl('', [
      Validators.required,
      
    ]), 
      isbn: new FormControl('', [
      Validators.required,
      
    ]),

     
    

  })

  onSubmit() {
    if(this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched()
      return;
    }
  }
}
