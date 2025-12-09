import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { UserService, UserResponseDTO } from '../../../services/user.service';
import { BookService, BookResponseDTO } from '../../../services/book.service';

// Declaração para o Bootstrap funcionar sem tipagem estrita
declare var bootstrap: any;

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-component.html',
  styleUrls: ['./home-component.css'],
})
export class HomeComponent implements OnInit {
  
  // --- Dados do Usuário ---
  usuarioLogado: UserResponseDTO | null = null;
  carregandoUsuario = true;
  erroUsuario: string | null = null;

  // --- Dados dos Livros Locados ---
  livrosAlocados: BookResponseDTO[] = [];
  carregandoLivros = false; // Começa falso, só carrega após ter o usuário
  erroLivros: string | null = null;

  // --- Controle Visual dos Estados (Bom, Regular, Ruim) ---
  // Array paralelo à lista de livros para controlar o dropdown de cada linha
  bookStates: Array<'bom' | 'regular' | 'ruim' | 'perda' | 'indefinido'> = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private bookService: BookService
  ) {}

  ngOnInit() {
    this.carregarDadosUsuario();
  }

  /**
   * 1. Carrega os dados do usuário logado.
   * Se tiver sucesso, chama automaticamente o carregamento dos livros.
   */
  carregarDadosUsuario() {
    this.carregandoUsuario = true;
    this.erroUsuario = null;

    const usuarioAtual = this.authService.currentUserValue;

    if (!usuarioAtual) {
      this.erroUsuario = 'Sessão expirada ou usuário não identificado.';
      this.carregandoUsuario = false;
      return;
    }

    // Prioriza busca por ID, senão tenta por email
    const request = usuarioAtual.id 
      ? this.userService.getUserById(usuarioAtual.id)
      : this.userService.getUserByEmail(usuarioAtual.email);

    request.subscribe({
      next: (dados) => {
        this.usuarioLogado = dados;
        console.log('✅ Usuário carregado:', dados);
        this.carregandoUsuario = false;

        // Assim que temos o usuário (e seu ID), buscamos os livros dele
        if (dados.id) {
          this.carregarLivrosAlocados(dados.id);
        }
      },
      error: (erro) => {
        console.error('❌ Erro ao carregar usuário:', erro);
        this.erroUsuario = 'Não foi possível carregar seus dados.';
        this.carregandoUsuario = false;
      }
    });
  }

  /**
   * 2. Busca os livros que estão alocados para este usuário
   */
  carregarLivrosAlocados(userId: number) {
    this.carregandoLivros = true;
    this.erroLivros = null;

    this.bookService.getBooksAllocatedToUser(userId).subscribe({
      next: (livros) => {
        this.livrosAlocados = livros;
        
        // Inicializa o array de estados com "indefinido" para cada livro encontrado
        // Isso garante que cada linha da tabela tenha seu próprio controle de estado
        this.bookStates = new Array(livros.length).fill('indefinido');
        
        console.log(`✅ ${livros.length} livros alocados encontrados.`);
        this.carregandoLivros = false;
      },
      error: (erro) => {
        console.error('❌ Erro ao carregar livros alocados:', erro);
        this.erroLivros = 'Erro ao buscar seus livros locados.';
        this.carregandoLivros = false;
      }
    });
  }

  /**
   * 3. Ação de Devolver (Desalocar) o livro
   */
  desalocarLivro(bookId: number) {
    if (!confirm('Tem certeza que deseja devolver este livro?')) {
      return;
    }

    // Opcional: Mostrar loading global ou no botão
    this.bookService.deallocateBook(bookId).subscribe({
      next: () => {
        alert('Livro devolvido com sucesso!');
        // Recarrega a lista para remover o livro da tabela
        if (this.usuarioLogado?.id) {
          this.carregarLivrosAlocados(this.usuarioLogado.id);
        }
      },
      error: (erro) => {
        console.error('Erro na devolução:', erro);
        alert('Erro ao devolver o livro. Tente novamente.');
      }
    });
  }

  // --- Métodos Auxiliares de UI (Estados do Livro) ---

  setState(index: number, state: 'bom' | 'regular' | 'ruim' | 'perda') {
    if (index >= 0 && index < this.bookStates.length) {
      this.bookStates[index] = state;
    }
  }

  stateClass(state: string): string {
    switch (state) {
      case 'bom': return 'btn-success';
      case 'regular': return 'btn-warning';
      case 'ruim': return 'btn-danger';
      case 'perda': return 'btn-dark';
      default: return 'btn-secondary';
    }
  }

  stateLabel(state: string): string {
    switch (state) {
      case 'bom': return 'Bom';
      case 'regular': return 'Regular';
      case 'ruim': return 'Ruim';
      case 'perda': return 'Perda/Dano';
      default: return 'Avaliar';
    }
  }

  /**
   * Abre o modal de edição de usuário (Mantido do seu código original)
   */
  showEditModal() {
    const modalElement = document.getElementById('userEditModal');
    if (modalElement) {
      const userEditModal = new bootstrap.Modal(modalElement);
      userEditModal.show();
    }
  }
}