import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookService, BookRequestDTO } from '../../../services/book.service';

@Component({
  selector: 'app-record-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './record-component.html',
  styleUrl: './record-component.css',
})
export class RecordComponent {
  cadastroForm = new FormGroup({
    titulo: new FormControl('', [Validators.required]),
    autor: new FormControl('', [Validators.required]),
    tema: new FormControl('', [Validators.required]),
    anoPublicacao: new FormControl('', [Validators.required]),
    isbn: new FormControl('', [Validators.required]),
  });

  // Estados de carregamento e feedback
  enviando = false;
  mensagemSucesso: string | null = null;
  mensagemErro: string | null = null;

  constructor(private bookService: BookService) {}

  onSubmit() {
    // Validar formulário
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      this.mensagemErro = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    // Limpar mensagens anteriores
    this.mensagemSucesso = null;
    this.mensagemErro = null;
    this.enviando = true;

    // Preparar dados para envio
    const formValue = this.cadastroForm.value;
    const bookData: BookRequestDTO = {
      title: formValue.titulo || '',
      author: formValue.autor || '',
      isbn: formValue.isbn || undefined,
      publishedYear: parseInt(formValue.anoPublicacao || '0'),
      tema: formValue.tema || '',
    };

    console.log('📤 Enviando livro:', bookData);

    // Fazer requisição à API
    this.bookService.createBook(bookData).subscribe({
      next: (response) => {
        console.log('✅ Livro criado com sucesso:', response);
        
        this.mensagemSucesso = `Livro "${response.title}" cadastrado com sucesso!`;
        this.enviando = false;

        // Limpar formulário
        this.cadastroForm.reset();

        // Limpar mensagem de sucesso após 3 segundos
        setTimeout(() => {
          this.mensagemSucesso = null;
        }, 3000);
      },
      error: (erro) => {
        console.error('❌ Erro ao criar livro:', erro);
        
        this.mensagemErro = erro.message || 'Erro ao cadastrar livro. Tente novamente.';
        this.enviando = false;
      }
    });
  }

  /**
   * Limpa as mensagens de feedback
   */
  limparMensagens() {
    this.mensagemSucesso = null;
    this.mensagemErro = null;
  }
}