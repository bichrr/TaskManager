import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeadBarComponent } from "./head-bar/head-bar.component";
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TaskListComponent } from "./task-list/task-list.component";
import { CommonModule } from '@angular/common';
import { CreateTaskComponent } from './create-task/create-task.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeadBarComponent, CreateTaskComponent, TaskListComponent,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TaskManager';
  isCreateTaskPage = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isCreateTaskPage = event.url === '/create-task';
      });
  }

}
