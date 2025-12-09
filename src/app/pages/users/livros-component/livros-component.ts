import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService, BookResponseDTO } from '../../../services/book.service';
import { AuthService } from '../../../services/auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-livros-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './livros-component.html',
  styleUrl: './livros-component.css',
})
export class LivrosComponent implements OnInit {
  
  livros: BookResponseDTO[] = [];
  livroSelecionado: BookResponseDTO | null = null;
  carregando = false;
  processandoReserva = false; 

  constructor(
    private bookService: BookService,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    this.listarLivrosDisponiveis();
  }

  listarLivrosDisponiveis() {
    this.carregando = true;
    this.bookService.getAvailableBooks().subscribe({
      next: (dados) => {
        this.livros = dados;
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao buscar livros:', erro);
        this.carregando = false;
      }
    });
  }

  showReservModal(livro: BookResponseDTO) {
    this.livroSelecionado = livro;
    const modalElement = document.getElementById('livroReservModal');
    if (modalElement) {
      const userReservModal = new bootstrap.Modal(modalElement);
      userReservModal.show();
    }
  }

  confirmarReserva() {
    if (!this.livroSelecionado) return;

    const usuarioLogado = this.authService.currentUserValue;
    if (!usuarioLogado || !usuarioLogado.id) {
      alert('Erro: Usuário não identificado. Por favor, faça login novamente.');
      return;
    }

    const requestDTO = {
      bookId: this.livroSelecionado.id,
      userId: usuarioLogado.id
    };

    this.processandoReserva = true;

    this.bookService.allocateBook(requestDTO).subscribe({
      next: (sucesso) => {
        console.log('Reserva realizada:', sucesso);
        alert(`Livro "${this.livroSelecionado?.title}" reservado com sucesso!`);
        
        this.listarLivrosDisponiveis();
        this.processandoReserva = false;
      },
      error: (erro) => {
        console.error('Erro na reserva:', erro);
        alert('Falha ao reservar o livro. Tente novamente.');
        this.processandoReserva = false;
      }
    });
  }
}