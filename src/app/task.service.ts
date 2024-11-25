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

  addTask(task: Task): void {
    // Retrieve the current tasks from localStorage
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    
    // Retrieve the last used ID from localStorage (or start with 1 if no tasks)
    let lastId = localStorage.getItem('lastTaskId');
    let newId = 1; // Default to 1 if no lastId is found
    
    if (lastId) {
      newId = parseInt(lastId, 10) + 1; // Increment the last ID by 1
    }
    
    // Assign the new ID to the task
    const newTask: Task = { ...task, id: newId.toString() }; // Ensure ID is a string
  
    // Add the new task to the tasks array
    tasks.push(newTask);
    
    // Save the updated tasks back to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
  
    // Update the last used ID in localStorage
    localStorage.setItem('lastTaskId', newId.toString());
  
    // Optionally, update the Observable if you're using it
    this.tasksSubject.next(tasks);
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

  loadTasks(): Task[] {
    if (this.isBrowser()) { // Check if running in a browser environment
      const tasks = localStorage.getItem(this.tasksKey);
      const parsedTasks = tasks ? JSON.parse(tasks) : [];
      console.log('Loaded tasks:', parsedTasks);
      return parsedTasks; // Return parsed tasks
    }
    return []; // Return an empty array if not in a browser
  }
  updateTask(updatedTask: Task): void {
    const tasks = this.getTasks();
    const index = tasks.findIndex(task => task.id === updatedTask.id);
  
    if (index !== -1) {
      tasks[index] = updatedTask; // Replace old task with updated one
      this.saveTasks(tasks); // Save the updated task list
    }
  }
  
  removeTask(task: Task): void {
    // Get the current tasks from localStorage
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    
    // Check if the task exists in the tasks array
    const index = tasks.findIndex((t: Task) => t.id === task.id); // Ensure task.id is correctly passed
    
    // Log for debugging purposes
    console.log('Removing task with ID:', task.id);
    console.log('Current tasks in localStorage:', tasks);
    
    // If the task exists, remove it
    if (index > -1) {
      console.log('Task found, removing:', tasks[index]);
      tasks.splice(index, 1); // Remove the task from the array
    } else {
      console.log('Task not found');
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
