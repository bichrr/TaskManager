import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { Task } from '../task';
import { Router, RouterModule } from '@angular/router';
import { TaskService } from '../task.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DateFormatPipe } from '../date-format.pipe';
import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import { startOfMonth, endOfMonth } from 'date-fns';
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  @Output() progressChanged = new EventEmitter<number>(); // EventEmitter for progress update
  
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  filterStatus: string = 'All'; // Can be 'All', 'Completed', 'Pending'
  priorityFilter: string = 'All'; // Can be 'All', 'High', 'Medium', 'Low'
  sortCriteria: string = 'priority'; // Default sorting by priority
  isStatusFilterVisible: boolean = false; // Status filter visibility
  isPriorityFilterVisible: boolean = false; // Priority filter visibility
  currentStatusFilter: string = 'All'; // Track active status filter
  currentPriorityFilter: string = 'All'; // Track active priority filter

  constructor(private router: Router, private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
    this.taskService.getTasksObservable().subscribe((updatedTasks) => {
      this.tasks = updatedTasks;  // Update the task list when the observable emits a new value
    }); 
  }

  loadTasks(): void {
    this.tasks = this.taskService.getTasks();
    this.applyFiltersAndSorting(); // Ensure filtering and sorting is applied after loading tasks
  }

  toggleStatus(task: Task): void {
    task.status = task.status === 'Completed' ? 'Pending' : 'Completed';
    this.saveTasks();
    this.applyFiltersAndSorting(); // Apply filters after toggling status
  }

  saveTasks(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  toggleStatusFilter(): void {
    this.isStatusFilterVisible = !this.isStatusFilterVisible;
    this.isPriorityFilterVisible = false; // Close priority filter if it's open
  }

  togglePriorityFilter(): void {
    this.isPriorityFilterVisible = !this.isPriorityFilterVisible;
    this.isStatusFilterVisible = false; // Close status filter if it's open
  }

  applyFiltersAndSorting(): void {
    // Filter tasks based on status
    let filteredByStatus = this.tasks;

    if (this.filterStatus === 'Completed') {
      filteredByStatus = this.tasks.filter(task => task.status === 'Completed');
    } else if (this.filterStatus === 'Pending') {
      filteredByStatus = this.tasks.filter(task => task.status === 'Pending');
    }

    // Further filter by priority
    if (this.priorityFilter !== 'All') {
      filteredByStatus = filteredByStatus.filter(task => task.priority === this.priorityFilter);
    }

    this.filteredTasks = filteredByStatus;

    // Sort tasks based on priority
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
    // Toggle the status filter
    if (this.currentStatusFilter === filter) {
      this.currentStatusFilter = 'All'; // If the filter is already active, reset it
      this.filterStatus = 'All'; // Reset to show all tasks
    } else {
      this.filterStatus = filter; // Set the current status filter
      this.currentStatusFilter = filter; // Update the active status filter
    }
    this.applyFiltersAndSorting(); // Reapply filters and sorting
  }

  onPriorityFilterChange(priority: string): void {
    // Toggle the priority filter
    if (this.currentPriorityFilter === priority) {
      this.currentPriorityFilter = 'All'; // If the filter is already active, reset it
      this.priorityFilter = 'All'; // Reset to show all tasks
    } else {
      this.priorityFilter = priority; // Set the current priority filter
      this.currentPriorityFilter = priority; // Update the active priority filter
    }
    this.applyFiltersAndSorting(); // Reapply filters and sorting
  }

  onSortChange(criteria: string): void {
    this.sortCriteria = criteria; // Currently only priority sorting is available
    this.applyFiltersAndSorting();
  }


  deleteTask(task: Task): void {
    console.log('Deleting task:', task);
    
    // Call the task service to remove the task
    this.taskService.removeTask(task);
    
    // After removing, load tasks again to update the filtered list
    this.loadTasks();
  
    // Reapply the filters and sorting
    this.applyFiltersAndSorting();  
  
    // Check the updated tasks in the console for debugging
    console.log('Filtered tasks after deletion:', this.filteredTasks);
  }
  editTask(taskId: string): void {
    this.router.navigate(['/edit-task', taskId]);
  }
  
  

  
}
