import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AvaliationRequestDTO {
  date: string; 
  avalBom: number;
  avalRegular: number;
  avalRuim: number;
  bookId: number;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AvaliationService {
  private apiUrl = 'http://localhost:8080/avaliations'; 

  constructor(private http: HttpClient) {}

  registrarAvaliacao(dados: AvaliationRequestDTO): Observable<any> {
    return this.http.post(this.apiUrl, dados);
  }
}