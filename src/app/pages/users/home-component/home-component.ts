import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { UserService, UserResponseDTO } from '../../../services/user.service';
import { BookService, BookResponseDTO } from '../../../services/book.service';
import { AvaliationService, AvaliationRequestDTO } from '../../../services/avaliation.service';

declare var bootstrap: any;

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-component.html',
  styleUrls: ['./home-component.css'],
})
export class HomeComponent implements OnInit {
  
  usuarioLogado: UserResponseDTO | null = null;
  carregandoUsuario = true;
  erroUsuario: string | null = null;

  livrosAlocados: BookResponseDTO[] = [];
  carregandoLivros = false;
  
  bookStates: string[] = []; 

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private bookService: BookService,
    private avaliationService: AvaliationService
  ) {}

  ngOnInit() {
    this.carregarDadosUsuario();
  }


  carregarDadosUsuario() {
    this.carregandoUsuario = true;
    const usuarioAtual = this.authService.currentUserValue;

    if (!usuarioAtual) {
      this.erroUsuario = 'Sessão expirada. Faça login novamente.';
      this.carregandoUsuario = false;
      return;
    }

    const request = usuarioAtual.id 
      ? this.userService.getUserById(usuarioAtual.id)
      : this.userService.getUserByEmail(usuarioAtual.email);

    request.subscribe({
      next: (dados) => {
        this.usuarioLogado = dados;
        this.carregandoUsuario = false;
        
        if (dados.id) {
          this.carregarLivrosAlocados(dados.id);
        }
      },
      error: (erro) => {
        console.error('Erro user:', erro);
        this.erroUsuario = 'Erro ao carregar perfil.';
        this.carregandoUsuario = false;
      }
    });
  }

  carregarLivrosAlocados(userId: number) {
    this.carregandoLivros = true;
    this.bookService.getBooksAllocatedToUser(userId).subscribe({
      next: (livros) => {
        this.livrosAlocados = livros;
        this.bookStates = new Array(livros.length).fill('indefinido');
        this.carregandoLivros = false;
      },
      error: (erro) => {
        console.error('Erro livros:', erro);
        this.carregandoLivros = false;
      }
    });
  }

 
  avaliarLivro(index: number, livro: BookResponseDTO, estado: 'bom' | 'regular' | 'ruim') {
    this.bookStates[index] = estado;

    if (!this.usuarioLogado?.id) return;

    const request: AvaliationRequestDTO = {
      bookId: livro.id,
      userId: this.usuarioLogado.id,
      date: new Date().toISOString().split('T')[0], // Data de hoje (YYYY-MM-DD)
      avalBom: estado === 'bom' ? 1 : 0,
      avalRegular: estado === 'regular' ? 1 : 0,
      avalRuim: estado === 'ruim' ? 1 : 0
    };

    this.avaliationService.registrarAvaliacao(request).subscribe({
      next: (res) => {
        console.log(`Avaliação '${estado}' registrada para o livro ${livro.title}`);
      },
      error: (err) => {
        console.error('Erro ao avaliar:', err);
        alert('Não foi possível salvar sua avaliação. Tente novamente.');
        this.bookStates[index] = 'indefinido';
      }
    });
  }

  desalocarLivro(bookId: number) {
    if (!confirm('Deseja realmente devolver este livro?')) return;

    this.bookService.deallocateBook(bookId).subscribe({
      next: () => {
        alert('Livro devolvido com sucesso!');
        // Recarrega a lista
        if (this.usuarioLogado?.id) {
          this.carregarLivrosAlocados(this.usuarioLogado.id);
        }
      },
      error: (err) => {
        alert('Erro ao devolver livro.');
        console.error(err);
      }
    });
  }


  stateClass(state: string): string {
    switch (state) {
      case 'bom': return 'btn-success';
      case 'regular': return 'btn-warning';
      case 'ruim': return 'btn-danger';
      default: return 'btn-secondary';
    }
  }

  stateLabel(state: string): string {
    switch (state) {
      case 'bom': return 'Bom';
      case 'regular': return 'Regular';
      case 'ruim': return 'Ruim';
      default: return 'Avaliar';
    }
  }

  showEditModal() {
    const modalElement = document.getElementById('userEditModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}