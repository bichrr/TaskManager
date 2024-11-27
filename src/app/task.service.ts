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
    
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    
    
    let lastId = localStorage.getItem('lastTaskId');
    let newId = 1; 
    
    if (lastId) {
      newId = parseInt(lastId, 10) + 1; 
    }
    
    
    const newTask: Task = { ...task, id: newId.toString() }; 
  
    
    tasks.push(newTask);
    
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
  
    
    localStorage.setItem('lastTaskId', newId.toString());
  
    
    this.tasksSubject.next(tasks);
  }
  

  

  markTaskAsCompleted(taskToComplete: Task): void {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskToComplete.id);
    if (taskIndex !== -1) {
      tasks[taskIndex].status = 'Completed'; 
      this.saveTasks(tasks); 
      console.log('Task marked as completed:', taskToComplete);
    }
  }

  markTaskAsPending(taskToPending: Task): void {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskToPending.id);
    if (taskIndex !== -1) {
      tasks[taskIndex].status = 'Pending'; 
      this.saveTasks(tasks); 
      console.log('Task marked as pending:', taskToPending);
    }
  }

  loadTasks(): Task[] {
    if (this.isBrowser()) { 
      const tasks = localStorage.getItem(this.tasksKey);
      const parsedTasks = tasks ? JSON.parse(tasks) : [];
      console.log('Loaded tasks:', parsedTasks);
      return parsedTasks; 
    }
    return []; 
  }
  updateTask(updatedTask: Task): void {
    const tasks = this.getTasks();
    const index = tasks.findIndex(task => task.id === updatedTask.id);
  
    if (index !== -1) {
      tasks[index] = updatedTask; 
      this.saveTasks(tasks); 
    }
  }
  
  removeTask(task: Task): void {
    
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    
    
    const index = tasks.findIndex((t: Task) => t.id === task.id); 
    
    
    console.log('Removing task with ID:', task.id);
    console.log('Current tasks in localStorage:', tasks);
    
    
    if (index > -1) {
      console.log('Task found, removing:', tasks[index]);
      tasks.splice(index, 1); 
    } else {
      console.log('Task not found');
    }
    
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    
    this.tasksSubject.next(tasks);
  }  

  private saveTasks(tasks: Task[]): void {
    if (this.isBrowser()) {  
      localStorage.setItem(this.tasksKey, JSON.stringify(tasks));  
      this.tasksSubject.next(tasks);  
      console.log('Tasks saved:', tasks);  
    }
  }
  

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'; 
  }
}
