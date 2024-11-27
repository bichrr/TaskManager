import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { CreateTaskComponent } from './create-task/create-task.component';
import { CalendarComponent } from './calendar/calendar.component';

export const routes: Routes = [
  { path: '', component: TaskListComponent },
  { path: 'create-task', component: CreateTaskComponent },   
  { path: 'edit-task/:id', component: CreateTaskComponent },  
  { path: 'calendar', component: CalendarComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
