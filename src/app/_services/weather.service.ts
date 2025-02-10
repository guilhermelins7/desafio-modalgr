import { Injectable } from '@angular/core';
import { weatherResult } from '../_models/weatherResult';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../environments/environments';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class WeatherService {
    apiUrl: string = environments.weatherUrl;
    constructor(private http: HttpClient) { }
  
    getWeatherByCity(cidade: string) {
      return this.http.get<weatherResult>
      (this.apiUrl + cidade + "&appid=7eae6e0b39f25027d1dcd4755e09bd83")
      .pipe(
        map((response) => {
          return response
        })
      )
    }
}
