import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../task';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  imports: [CommonModule],
})
export class CalendarComponent implements OnInit {
  tasks: Task[] = [];
  weekDays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  currentWeekDates: Date[] = [];
  currentDate: Date = new Date(); 
  weekList: string[] = []; 

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.checkDarkMode();
    this.generateWeeks();
    this.setCurrentWeekDates();
    this.loadTasksForCalendar();
  }

  generateWeeks(): void {
    const weeks: string[] = [];
    const numberOfWeeksToGenerate = 12; 

    const startOfCurrentWeek = this.getStartOfWeek(new Date());

    for (let i = 0; i < numberOfWeeksToGenerate; i++) {
      const startOfWeek = new Date(startOfCurrentWeek);
      startOfWeek.setDate(startOfCurrentWeek.getDate() + i * 7);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      
      const weekRange = `${this.formatDate(startOfWeek)} - ${this.formatDate(endOfWeek)}`;
      weeks.push(weekRange);
    }

    this.weekList = weeks;
  }

  goToSelectedWeek(event: any): void {
    const selectedWeek = event.target.value;
    const weekRange = selectedWeek.split(' - ');
    const startDate = this.parseDueDate(weekRange[0]); 

    if (startDate) {
      this.currentWeekDates = this.getWeekDates(startDate);
    }
  }

  getWeekDates(startDate: Date): Date[] {
    const weekDates: Date[] = [];
    const startOfWeek = this.getStartOfWeek(startDate);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }

    return weekDates;
  }

  goToCurrentWeek(): void {
    this.currentWeekDates = this.getCurrentWeekDates();
  }
  loadTasksForCalendar(): void {
    this.tasks = this.taskService.loadTasks();
  }

  getTasksByDate(date: Date): Task[] {
    const formattedDate = this.formatDate(date); 

    return this.tasks.filter(task => {
      const taskDate = this.parseDueDate(task.dueDate!);
      return taskDate ? this.formatDate(taskDate) === formattedDate : false;
    });
  }

  setCurrentWeekDates(): void {
    const startOfWeek = this.getStartOfWeek(this.currentDate);
    this.currentWeekDates = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return date;
    });
  }

  private checkDarkMode(): void {
    if (typeof window !== 'undefined' && localStorage) {
      const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
      if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  }

  getStartOfWeek(date: Date): Date {
    const day = date.getDay() || 7; 
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - day + 1); 
    startOfWeek.setHours(0, 0, 0, 0); 
    return startOfWeek;
  }

  previousWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() - 7); 
    this.setCurrentWeekDates();
  }

  nextWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() + 7); 
    this.setCurrentWeekDates();
  }

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  private parseDueDate(dueDate: string): Date | null {
    const [day, month, year] = dueDate.split('-').map(Number);
    if (!day || !month || !year) {
      return null; 
    }
    return new Date(year, month - 1, day);
  }

  getCurrentWeekDates(): Date[] {
    const startOfWeek = this.getStartOfWeek(new Date());
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  }
}
