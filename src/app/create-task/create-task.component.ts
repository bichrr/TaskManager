import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Task } from '../task';
import { Router, RouterModule } from '@angular/router';
import { TaskService } from '../task.service'

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent {
  taskForm: FormGroup;

  constructor(private fb: FormBuilder, private taskService: TaskService, private router: Router) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  onDateChange(value: string): void {
    const [day, month, year] = value.split('/');
    const formattedDate = new Date(+year, +month - 1, +day); 
    this.taskForm.patchValue({ dueDate: formattedDate }); 
  }
  
  formatDate(value: Date | string): string {
    if (!value) return '';
    const date = new Date(value);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2); 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; 
  }
  
  onSubmit(): void {
    if (this.taskForm.invalid) {
      let alertMessage = 'Please fix the following errors:\n';
      if (this.taskForm.get('title')?.hasError('required')) {
        alertMessage += '- Title is required.\n';
      }
      if (this.taskForm.get('description')?.hasError('required')) {
        alertMessage += '- Description is required.\n';
      }
      if (this.taskForm.get('dueDate')?.hasError('required')) {
        alertMessage += '- Due Date is required.\n';
      }
      if (this.taskForm.get('priority')?.hasError('required')) {
        alertMessage += '- Priority is required.\n';
      }
      if (this.taskForm.get('status')?.hasError('required')) {
        alertMessage += '- Status is required.\n';  
      }
      if (alertMessage !== 'Please fix the following errors:\n') {
        alert(alertMessage);
        return;
      }
    }
      const task: Task = { ...this.taskForm.value };
      this.taskService.addTask(task);
      this.taskForm.reset();
      this.router.navigate(['/']); 

  }
}
