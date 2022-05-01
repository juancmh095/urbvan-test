import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  api:string = environment.api;

  constructor(private _http: HttpClient) { }

  public async getHttpRequest(url: string, headers: any): Promise<any> {
    return new Promise((resolve: any) => {
      this._http.get(`${this.api + url}`, { headers }).subscribe((response: any) => {
        resolve(response);
      });
    });
  }

  public async putHttpRequest(url: string, data: any, headers: any): Promise<any> {
    return new Promise((resolve: any) => {
      this._http.put(`${this.api + url}`, data, { headers }).subscribe((response: any) => {
        resolve(response);
      });
    });
  }

  public async postHttpRequest(url: string, data: any, headers: any): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      this._http.post(`${this.api + url}`, data, { headers }).subscribe((response: any) => {
        resolve(response);
      });
    });
  }

  public async deleteHttpRequest(url: string, id: any, headers: any): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      this._http.delete(`${this.api + url + id}`, { headers }).subscribe((response: any) => {
        resolve(response);
      });
    });
  }

}
