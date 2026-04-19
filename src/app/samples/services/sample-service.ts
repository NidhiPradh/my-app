import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sample } from '../models/sample.model';

@Injectable({
  providedIn: 'root'
})
export class SampleService {
  private apiUrl = 'https://localhost:7286/api/Samples';

  constructor(private http: HttpClient) { }

  getAllSamples(): Observable<Sample[]> {
    return this.http.get<Sample[]>(`${this.apiUrl}/GetAllSample`);
  }

  
}
