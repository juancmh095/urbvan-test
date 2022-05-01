import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/interfaces/employees';
import { EmployeesService } from 'src/services/employees.service';

declare var bootstrap:any;

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  model:Employee;
  data:Employee[];

  constructor(public _employeeService:EmployeesService) { }

  ngOnInit(): void {
    this.init();
    this.getDocuments();
  }

  init(){
    this.model = {
      id:null,
      name:"",
      lastname:"",
      dni: "",
      date_entry: new Date()
    };
  }

  save(){
    if(this.model.id == null){
      console.log('Guardando datos ---------------------------->', this.model);

      this._employeeService.addDocument(this.model).then((response:any)=>{
        console.log(response);

        if(!response.error){
          window.alert(response.msg);
          this.getDocuments();
          this.init();
        }else{
          window.alert(response.msg);

        }
      })
    }else{
      console.log('Actualizando datos ---------------------------->', this.model);
      this._employeeService.updateDocument(this.model).then((response:any) => {
        console.log(response);
        if(!response.error){
          window.alert(response.msg);
          this.getDocuments();
          this.init();
        }else{
          window.alert(response.msg);
        }
      });
    }
  }

  getDocuments(){
    this._employeeService.getDocuments().then((response:Employee[])=>{
      console.log('Obteniendo datos ----------------------------->', response);
      this.data = response;
    });
  }

  getInfo(employee:Employee){
    this.model = employee;
  }

  deleteDocument(id:string){
    var confirm = window.confirm('¿Realmente desea eliminar el elemento?');
    if(confirm){
      this._employeeService.deleteDocuments(id).then((response:any)=>{
        console.log('eliminando datos ----------------------------->', response);
        if(!response.error){
          window.alert(response.msg);
          this.getDocuments();
          this.init();
        }else{
          window.alert(response.msg);
  
        }
      });
    }
  }

}
