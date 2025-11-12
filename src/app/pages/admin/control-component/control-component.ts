import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";

declare const Chart: any; // Chart.js global (from CDN)

@Component({
  standalone: false,
  selector: 'app-control-component',
  templateUrl: './control-component.html',
  styleUrls: ['./control-component.css'],
})
export class ControlComponent implements AfterViewInit {

  @ViewChild('pieCanvas', { static: true }) pieCanvas!: ElementRef<HTMLCanvasElement>;
  private chartInstance: any;

  // Exemplo de dados — você pode substituir por dados reais vindos da API
  conservationLabels = ['Bom', 'Regular', 'Ruim'];
  conservationData = [60, 25, 15];

  ngAfterViewInit(): void {
    try {
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
    } catch (e) {
      // se Chart não estiver disponível, silenciosamente falha e evita crash
      console.error('Chart.js error:', e);
    }
  }

  // Método de atualização opcional: recebe novo array de valores
  updateConservation(values: number[]) {
    if (!this.chartInstance) return;
    this.chartInstance.data.datasets[0].data = values;
    this.chartInstance.update();
  }

}
