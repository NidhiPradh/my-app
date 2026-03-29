import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
//import { environment } from '';

@Injectable({
  providedIn: 'root',
})
export class ParentService {
  testData: string = 'Hello from ParentService!';
  private baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }
  
  getProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Product/get-all-products`);    
  }
  addProduct(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Product/create-product`, data);
  }
}
