import { Component } from '@angular/core';
declare var bootstrap:any

@Component({
  selector: 'app-livros-component',
  imports: [],
  templateUrl: './livros-component.html',
  styleUrl: './livros-component.css',
})
export class LivrosComponent {
   showReservModal(){
    const userReservModal = new bootstrap.Modal(document.getElementById('livroReservModal'));
    userReservModal.show();
  }
}
