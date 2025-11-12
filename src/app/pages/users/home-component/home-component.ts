import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
declare var bootstrap:any


@Component({
  selector: 'app-home-component',
  imports: [CommonModule],
  templateUrl: './home-component.html',
  styleUrls: ['./home-component.css'],
})
export class HomeComponent {
   showEditModal(){
    const userDeleteModal = new bootstrap.Modal(document.getElementById('userEditModal'));
    userDeleteModal.show();
  }

  // estados de conservação para cada livro listado (index corresponde à linha da tabela)
  bookStates: Array<'bom'|'regular'|'ruim'|'perda'|'indefinido'> = ['indefinido','indefinido','indefinido'];

  setState(index: number, state: 'bom'|'regular'|'ruim'|'perda') {
    if (index < 0 || index >= this.bookStates.length) return;
    this.bookStates[index] = state;
  }

  // devolve a classe do botão principal baseado no estado
  stateClass(state: string) {
    switch(state) {
      case 'bom': return 'btn btn-success';
      case 'regular': return 'btn btn-warning';
      case 'ruim': return 'btn btn-danger';
      case 'perda': return 'btn btn-dark';
      default: return 'btn btn-secondary';
    }
  }

  stateLabel(state: string) {
    switch(state) {
      case 'bom': return 'Bom';
      case 'regular': return 'Regular';
      case 'ruim': return 'Ruim';
      case 'perda': return 'Perda';
      default: return 'Não avaliado';
    }
  }
}
