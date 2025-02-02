import { Injectable } from '@angular/core';
import { environments } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { viaCepResult } from '../_models/viaCepResult';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViacepService {

  apiUrl: string = environments.viaCepUrl;
  constructor(private http: HttpClient) { }

  getEnderecoByCep(cep: string) {
    return this.http.get<viaCepResult>
    (this.apiUrl + cep + "/json/")
    .pipe(
      map((response) => {
        return response
      })
    )
  }
}
