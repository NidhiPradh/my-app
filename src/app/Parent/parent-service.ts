import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParentService {
  testData: string = 'Hello from ParentService!';
  //private baseUrl = 'https://localhost:7286/api/Master/fetch-save-drug?brandname=Advil';
  constructor(private http: HttpClient) { }
  getProducts(): Observable<any> {
    return this.http.get(`https://localhost:7286/api/Product/get-all-products`);
  }
}
