import { Injectable } from '@angular/core';

import { ApiService } from 'src/services/api.service';
import { Employee } from 'src/interfaces/employees';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  employee:Employee;

  constructor(private _api:ApiService) { }

  public async addDocument(data: Employee): Promise<any> {
    try {
      let url = `employees/add`;
      let response = await this._api.postHttpRequest(url, data, {});
      return response;
    } catch (error) {
      console.log('error: ', error);
      return 'Error al hacer la peticion';
    }
  }

  public async updateDocument(data: Employee): Promise<any> {
    try {
      let url = `employees`;
      let response = await this._api.putHttpRequest(url, data, {});
      return response;
    } catch (error) {
      console.log('error: ', error);
      return 'Error al hacer la peticion';
    }
  }

  public async getDocuments(): Promise<any> {
    try {
      let url = `employees/list`;
      let response = await this._api.getHttpRequest(url, {});
      return response;
    } catch (error) {
      console.log('error: ', error);
      return 'Error al hacer la peticion';
    }
  }

  public async deleteDocuments(id:string): Promise<any> {
    try {
      let url = `employees/`;
      let response = await this._api.deleteHttpRequest(url, id,{});
      return response;
    } catch (error) {
      console.log('error: ', error);
      return 'Error al hacer la peticion';
    }
  }
}
