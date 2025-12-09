import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BookService, BookWithStatsDTO } from "../../../services/book.service";

declare const Chart: any; // Chart.js global (from CDN)

@Component({
  selector: 'app-control-component',
  imports: [CommonModule],  // ← ADICIONE ISTO
  templateUrl: './control-component.html',
  styleUrls: ['./control-component.css'],
})
export class ControlComponent implements OnInit, AfterViewInit {

  @ViewChild('pieCanvas', { static: true }) pieCanvas!: ElementRef<HTMLCanvasElement>;
  private chartInstance: any;

  // Dados dos livros
  livros: BookWithStatsDTO[] = [];
  carregandoLivros = true;
  erroLivros: string | null = null;

  // Dados do gráfico de conservação
  conservationLabels = ['Bom', 'Regular', 'Ruim'];
  conservationData = [0, 0, 0];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.carregarLivros();
  }

  ngAfterViewInit(): void {
    // O gráfico será inicializado após os dados serem carregados
  }

  /**
   * Carrega todos os livros com estatísticas do backend
   */
  carregarLivros() {
    this.carregandoLivros = true;
    this.erroLivros = null;

    this.bookService.getAllBooksWithStats().subscribe({
      next: (dados) => {
        console.log('✅ Livros carregados:', dados);
        this.livros = dados;
        this.carregandoLivros = false;

        // Calcular estatísticas gerais para o gráfico
        this.calcularEstatisticasGerais();

        // Inicializar o gráfico após os dados serem carregados
        setTimeout(() => {
          this.inicializarGrafico();
        }, 100);
      },
      error: (erro) => {
        console.error('❌ Erro ao carregar livros:', erro);
        this.erroLivros = 'Erro ao carregar livros. Tente novamente.';
        this.carregandoLivros = false;
      }
    });
  }

  /**
   * Calcula as estatísticas gerais de conservação
   */
  calcularEstatisticasGerais() {
    if (this.livros.length === 0) {
      this.conservationData = [0, 0, 0];
      return;
    }

    // Somar os percentuais de todos os livros
    let totalBom = 0;
    let totalRegular = 0;
    let totalRuim = 0;

    this.livros.forEach(livro => {
      totalBom += livro.percentualBom;
      totalRegular += livro.percentualRegular;
      totalRuim += livro.percentualRuim;
    });

    // Calcular a média
    const quantidade = this.livros.length;
    this.conservationData = [
      Math.round(totalBom / quantidade),
      Math.round(totalRegular / quantidade),
      Math.round(totalRuim / quantidade)
    ];

    console.log('📊 Estatísticas gerais:', {
      bom: this.conservationData[0],
      regular: this.conservationData[1],
      ruim: this.conservationData[2]
    });
  }

  /**
   * Inicializa o gráfico de pizza
   */
  inicializarGrafico() {
    try {
      // Destruir gráfico anterior se existir
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      const ctx = this.pieCanvas.nativeElement.getContext('2d');
      this.chartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.conservationLabels,
          datasets: [{
            data: this.conservationData,
            backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          }
        }
      });

      console.log('✅ Gráfico inicializado');
    } catch (e) {
      console.error('❌ Erro ao inicializar gráfico:', e);
    }
  }

  /**
   * Atualiza o gráfico com novos dados
   */
  atualizarGrafico() {
    if (!this.chartInstance) return;
    this.chartInstance.data.datasets[0].data = this.conservationData;
    this.chartInstance.update();
  }

  /**
   * Retorna a classe CSS para o percentual
   */
  getPercentualClass(percentual: number): string {
    if (percentual >= 70) return 'text-success';
    if (percentual >= 40) return 'text-warning';
    return 'text-danger';
  }
}