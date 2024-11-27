import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Task } from '../task';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskService } from '../task.service';
import { dateNotBeforeToday,dateNotValidForMonth } from '../validators/date-validators';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode = false;
  taskId: string | null = null;
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const today = new Date(); 
    const todayDay = today.getDate();
    const todayMonth = today.getMonth() + 1; 
    const todayYear = today.getFullYear();
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      day: [todayDay, [Validators.required, Validators.min(1), Validators.max(31)]],
      month: [todayMonth, [Validators.required]],
      year: [todayYear, [Validators.required, Validators.min(1000), Validators.max(9999)]],
      priority: ['Medium', Validators.required],
      status: ['Pending', Validators.required],
    }, { 
      validators: [dateNotBeforeToday(), dateNotValidForMonth()]  
    });
    
  }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.taskId = params.get('id');
      if (this.taskId) {
        this.isEditMode = true;
        this.loadTaskForEdit(this.taskId);
      }
    });
  }

  loadTaskForEdit(taskId: string): void {
    const task = this.taskService.getTasks().find(t => t.id === taskId);
    if (task && task.dueDate) {
      
      const [day, month, year] = task.dueDate.split('-');
      
      this.taskForm.patchValue({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        day: parseInt(day, 10),
        month: parseInt(month, 10),
        year: parseInt(year, 10)
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      alert("Please fill in all required fields.");
      return;
    }
  
    const day = this.taskForm.get('day')?.value;
    const month = this.taskForm.get('month')?.value;
    const year = this.taskForm.get('year')?.value;
  
    
    const dueDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
  
    
    const task: Task = {
      title: this.taskForm.get('title')?.value,
      description: this.taskForm.get('description')?.value,
      priority: this.taskForm.get('priority')?.value,
      status: this.taskForm.get('status')?.value,
      dueDate: dueDate,
      id: this.isEditMode ? (this.taskId as string) : undefined, 
    };
  
    
    if (this.isEditMode) {
      this.taskService.updateTask(task);
    } else {
      this.taskService.addTask(task);
    }
  
    
    this.taskForm.reset();
    this.router.navigate(['/']);
  }
  
}
