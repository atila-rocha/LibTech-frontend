import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BookService, BookWithStatsDTO } from "../../../services/book.service";

@Component({
  selector: 'app-control-component',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './control-component.html',
  styleUrls: ['./control-component.css'],
})
export class ControlComponent implements OnInit {

  // Dados dos livros
  livros: BookWithStatsDTO[] = [];
  carregandoLivros = true;
  erroLivros: string | null = null;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.carregarLivros();
  }

  carregarLivros() {
    this.carregandoLivros = true;
    this.erroLivros = null;

    this.bookService.getAllBooksWithStats().subscribe({
      next: (dados) => {
        console.log('✅ Livros carregados:', dados);
        this.livros = dados;
        this.carregandoLivros = false;
      },
      error: (erro) => {
        console.error('❌ Erro ao carregar livros:', erro);
        this.erroLivros = 'Erro ao carregar livros. Tente novamente.';
        this.carregandoLivros = false;
      }
    });
  }

  /**
   * Define a cor do texto baseada na porcentagem
   */
  getPercentualClass(percentual: number): string {
    if (percentual >= 70) return 'text-success'; // Verde
    if (percentual >= 40) return 'text-warning'; // Amarelo
    return 'text-danger'; // Vermelho
  }
}