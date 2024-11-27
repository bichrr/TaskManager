import { Component, OnInit,Output,EventEmitter,ViewEncapsulation } from '@angular/core';
import { Task } from '../task';
import { Router, RouterModule } from '@angular/router';
import { TaskService } from '../task.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import { startOfMonth, endOfMonth } from 'date-fns';
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TaskListComponent implements OnInit {
  @Output() progressChanged = new EventEmitter<number>(); 
  
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  filterStatus: string = 'All'; 
  priorityFilter: string = 'All'; 
  sortCriteria: string = 'priority'; 
  isStatusFilterVisible: boolean = false; 
  isPriorityFilterVisible: boolean = false; 
  currentStatusFilter: string = 'All'; 
  currentPriorityFilter: string = 'All'; 

  constructor(private router: Router, private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
    this.taskService.getTasksObservable().subscribe((updatedTasks) => {
      this.tasks = updatedTasks;  
    }); 
  }

  loadTasks(): void {
    this.tasks = this.taskService.getTasks();
    this.applyFiltersAndSorting(); 
  }

  toggleStatus(task: Task): void {
    task.status = task.status === 'Completed' ? 'Pending' : 'Completed';
    this.saveTasks();
    this.applyFiltersAndSorting(); 
  }

  saveTasks(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  toggleStatusFilter(): void {
    this.isStatusFilterVisible = !this.isStatusFilterVisible;
    this.isPriorityFilterVisible = false; 
  }

  togglePriorityFilter(): void {
    this.isPriorityFilterVisible = !this.isPriorityFilterVisible;
    this.isStatusFilterVisible = false; 
  }

  applyFiltersAndSorting(): void {
    
    let filteredByStatus = this.tasks;

    if (this.filterStatus === 'Completed') {
      filteredByStatus = this.tasks.filter(task => task.status === 'Completed');
    } else if (this.filterStatus === 'Pending') {
      filteredByStatus = this.tasks.filter(task => task.status === 'Pending');
    }

    
    if (this.priorityFilter !== 'All') {
      filteredByStatus = filteredByStatus.filter(task => task.priority === this.priorityFilter);
    }

    this.filteredTasks = filteredByStatus;

    
    this.filteredTasks.sort((a, b) => {
      const priorityOrder = ['Low', 'Medium', 'High'];
      return priorityOrder.indexOf(a.priority || 'Low') - priorityOrder.indexOf(b.priority || 'Low');
    });
  }

  toggleFilterOptions() {
    this.isStatusFilterVisible = !this.isStatusFilterVisible;
    this.isPriorityFilterVisible = !this.isPriorityFilterVisible;
    const filterOptionsContainer = document.querySelector('.filter-options-container');
    if (filterOptionsContainer) {
      filterOptionsContainer.classList.toggle('active', this.isStatusFilterVisible || this.isPriorityFilterVisible);
    }
  }

  onFilterChange(filter: string): void {
    
    if (this.currentStatusFilter === filter) {
      this.currentStatusFilter = 'All'; 
      this.filterStatus = 'All'; 
    } else {
      this.filterStatus = filter; 
      this.currentStatusFilter = filter; 
    }
    this.applyFiltersAndSorting(); 
  }

  onPriorityFilterChange(priority: string): void {
    
    if (this.currentPriorityFilter === priority) {
      this.currentPriorityFilter = 'All'; 
      this.priorityFilter = 'All'; 
    } else {
      this.priorityFilter = priority; 
      this.currentPriorityFilter = priority; 
    }
    this.applyFiltersAndSorting(); 
  }

  onSortChange(criteria: string): void {
    this.sortCriteria = criteria; 
    this.applyFiltersAndSorting();
  }


  deleteTask(task: Task): void {
    console.log('Deleting task:', task);
    
    
    this.taskService.removeTask(task);
    
    
    this.loadTasks();
  
    
    this.applyFiltersAndSorting();  
  
    
    console.log('Filtered tasks after deletion:', this.filteredTasks);
  }
  editTask(taskId: string): void {
    this.router.navigate(['/edit-task', taskId]);
  }
  
  

  
}
