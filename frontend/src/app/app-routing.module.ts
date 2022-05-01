import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

/* pages */
import { InitComponent } from './components/init/init.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { HomeComponent } from './pages/home/home.component';


const routes: Routes = [
	{
		path: '', component: InitComponent, children: [
			/* INICIO */
			{ path: '', component: HomeComponent },
			{ path: 'inicio', component: HomeComponent },
			{ path: 'empleados', component: EmployeesComponent },
		]
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule]
})
export class AppRoutingModule { }