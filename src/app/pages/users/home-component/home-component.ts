import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, Usuario } from '../../../services/auth.service';
import { UserService, UserResponseDTO } from '../../../services/user.service';

declare var bootstrap: any;

@Component({
  selector: 'app-home-component',
  imports: [CommonModule],
  templateUrl: './home-component.html',
  styleUrls: ['./home-component.css'],
})
export class HomeComponent implements OnInit {
  // Dados do usuário logado
  usuarioLogado: UserResponseDTO | null = null;
  carregandoUsuario = true;
  erroUsuario: string | null = null;

  // Estados de conservação para cada livro listado
  bookStates: Array<'bom' | 'regular' | 'ruim' | 'perda' | 'indefinido'> = [
    'indefinido',
    'indefinido',
    'indefinido'
  ];

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.carregarDadosUsuario();
  }

  /**
   * Carrega os dados do usuário logado
   */
  carregarDadosUsuario() {
  this.carregandoUsuario = true;
  this.erroUsuario = null;

  // Obtém o usuário atual do AuthService
  const usuarioAtual = this.authService.currentUserValue;

  console.log('🔍 Usuário atual:', usuarioAtual);
  console.log('📦 localStorage:', localStorage.getItem('currentUser'));

  if (!usuarioAtual) {
    this.erroUsuario = 'Usuário não identificado. Faça login novamente.';
    this.carregandoUsuario = false;
    return;
  }

  // Se não tiver ID, tenta buscar pelo email
  const userId = usuarioAtual.id;
  const userEmail = usuarioAtual.email;

  if (!userId && !userEmail) {
    this.erroUsuario = 'Dados do usuário incompletos. Faça login novamente.';
    this.carregandoUsuario = false;
    return;
  }

  // Busca pelo ID se tiver, senão busca pelo email
  const requisicao = userId 
    ? this.userService.getUserById(userId)
    : this.userService.getUserByEmail(userEmail);

  requisicao.subscribe({
    next: (dados) => {
      this.usuarioLogado = dados;
      console.log('✅ Dados do usuário carregados:', dados);
      this.carregandoUsuario = false;
    },
    error: (erro) => {
      console.error('❌ Erro ao carregar dados do usuário:', erro);
      this.erroUsuario = 'Erro ao carregar dados do usuário. Tente novamente.';
      this.carregandoUsuario = false;
    }
  });
}

  /**
   * Abre o modal de edição
   */
  showEditModal() {
    const userEditModal = new bootstrap.Modal(
      document.getElementById('userEditModal')
    );
    userEditModal.show();
  }

  /**
   * Define o estado de conservação de um livro
   */
  setState(index: number, state: 'bom' | 'regular' | 'ruim' | 'perda') {
    if (index < 0 || index >= this.bookStates.length) return;
    this.bookStates[index] = state;
  }

  /**
   * Retorna a classe CSS do botão baseado no estado
   */
  stateClass(state: string) {
    switch (state) {
      case 'bom':
        return 'btn btn-success';
      case 'regular':
        return 'btn btn-warning';
      case 'ruim':
        return 'btn btn-danger';
      case 'perda':
        return 'btn btn-dark';
      default:
        return 'btn btn-secondary';
    }
  }

  /**
   * Retorna o label do estado
   */
  stateLabel(state: string) {
    switch (state) {
      case 'bom':
        return 'Bom';
      case 'regular':
        return 'Regular';
      case 'ruim':
        return 'Ruim';
      case 'perda':
        return 'Perda';
      default:
        return 'Não avaliado';
    }
  }
}