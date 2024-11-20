import { Injectable } from '@angular/core';
import { Task } from './task';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksKey = 'tasks';
  private tasksSubject = new BehaviorSubject<Task[]>(this.loadTasks());

  constructor() {
    
  }

  getTasks(): Task[] {
    return this.tasksSubject.value;
  }
  

  getTasksObservable() {
    return this.tasksSubject.asObservable(); 
  }

  addTask(newTask: Task): void {
    const tasks = this.getTasks();
    tasks.push(newTask);
    this.saveTasks(tasks);
    console.log('Task created:', newTask);
  }

  

  markTaskAsCompleted(taskToComplete: Task): void {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskToComplete.id);
    if (taskIndex !== -1) {
      tasks[taskIndex].status = 'Completed'; // Update task status
      this.saveTasks(tasks); // Save updated tasks
      console.log('Task marked as completed:', taskToComplete);
    }
  }

  markTaskAsPending(taskToPending: Task): void {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskToPending.id);
    if (taskIndex !== -1) {
      tasks[taskIndex].status = 'Pending'; // Update task status
      this.saveTasks(tasks); // Save updated tasks
      console.log('Task marked as pending:', taskToPending);
    }
  }

  private loadTasks(): Task[] {
    if (this.isBrowser()) { // Check if running in a browser environment
      const tasks = localStorage.getItem(this.tasksKey);
      const parsedTasks = tasks ? JSON.parse(tasks) : [];
      console.log('Loaded tasks:', parsedTasks);
      return parsedTasks; // Return parsed tasks
    }
    return []; // Return an empty array if not in a browser
  }

  removeTask(task: Task): void {
    // Get the current tasks from localStorage
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    
    // Find the index of the task to delete
    const index = tasks.findIndex((t: Task) => t.id === task.id); // 'task' is now correctly typed
    
    // If the task exists, remove it
    if (index > -1) {
      tasks.splice(index, 1);
    }
    
    // Save the updated tasks array back to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    // Update the Observable with the new tasks list
    this.tasksSubject.next(tasks);
  }
  
  
  
  
  

  private saveTasks(tasks: Task[]): void {
    if (this.isBrowser()) {  // Ensure this check for browser environment is correct
      localStorage.setItem(this.tasksKey, JSON.stringify(tasks));  // Save the updated tasks
      this.tasksSubject.next(tasks);  // Emit the updated task list
      console.log('Tasks saved:', tasks);  // Log saved tasks for debugging
    }
  }
  

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'; // Check for browser environment
  }
}
