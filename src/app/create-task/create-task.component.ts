import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Task } from '../task';
import { Router, ActivatedRoute, ParamMap } from '@angular/router'; // Correct imports
import { TaskService } from '../task.service'
import { dateNotBeforeToday } from '../validators/date-validators'; // Import the custom validator

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode = false; // Track whether it's an edit or create
  taskId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute // Correctly inject ActivatedRoute
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Check if it's an edit task
    this.route.paramMap.subscribe((params: ParamMap) => {  // Explicitly type 'params'
      this.taskId = params.get('id'); // Get task ID from URL if it exists
      if (this.taskId) {
        this.isEditMode = true;
        this.loadTaskForEdit(this.taskId); // Load the task data for editing
      }
    });
  }

  loadTaskForEdit(taskId: string): void {
    const task = this.taskService.getTasks().find(t => t.id === taskId);
    if (task) {
      const formattedDate = this.formatToDateInputValue(task.dueDate); // Format the date
      this.taskForm.patchValue({ ...task, dueDate: formattedDate }); // Populate the form with the task data
    }
  }
  formatToDateInputValue(value: Date | string | undefined): string {
    if (!value) return '';
    const date = new Date(value);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Ensure two digits
    const day = ('0' + date.getDate()).slice(-2); // Ensure two digits
    return `${year}-${month}-${day}`; // Format as yyyy-MM-dd
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
      if (this.taskForm.get('dueDate')?.hasError('dateNotBeforeToday')) {
        alertMessage += '- Due Date cannot be in the past.\n';  // Add custom error message
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

    const task: Task = { ...this.taskForm.value, id: this.isEditMode ? this.taskId : undefined };

    if (this.isEditMode) {
      // If it's an edit, update the task
      this.taskService.updateTask(task);
    } else {
      // If it's a new task, add it
      this.taskService.addTask(task);
    }

    this.taskForm.reset();
    this.router.navigate(['/']); // Redirect to task list after saving
  }
}
