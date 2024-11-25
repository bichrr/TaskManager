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
  currentDate: Date = new Date(); // Current date to track
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
    const currentDate = new Date();
    const numberOfWeeksToGenerate = 12; // Adjust how many weeks you want to display
    
    // Fix the current date to the start of the current week
    const startOfCurrentWeek = this.getStartOfWeek(currentDate);
    
    for (let i = 0; i < numberOfWeeksToGenerate; i++) {
      const startOfWeek = new Date(startOfCurrentWeek);
      startOfWeek.setDate(startOfCurrentWeek.getDate() + i * 7); // Start of the week (Monday)
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the week (Sunday)
  
      // Format the week as "Jan 1 - Jan 7"
      const weekRange = `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
      weeks.push(weekRange);
    }
  
    this.weekList = weeks; // Populate the week list
  }
  
  goToSelectedWeek(event: any): void {
    const selectedWeek = event.target.value;
    const weekRange = selectedWeek.split(' - ');
    const startDate = new Date(weekRange[0]);

    this.currentWeekDates = this.getWeekDates(startDate); // Update current week dates
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
    this.currentWeekDates = this.getCurrentWeekDates(); // Update currentWeekDates to this week's dates
  }
  loadTasksForCalendar(): void {
    this.tasks = this.taskService.loadTasks();
  }
  getCurrentWeekDates(): Date[] {
    const startOfWeek = new Date();
    const currentDay = startOfWeek.getDay();
    const diffToStartOfWeek = currentDay === 0 ? -6 : 1 - currentDay;

    startOfWeek.setDate(startOfWeek.getDate() + diffToStartOfWeek);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  }
  getTasksByDate(date: Date): Task[] {
    const formattedDate = date.toISOString().split('T')[0];
    return this.tasks.filter(task => {
      const taskDate = new Date(task.dueDate!);
      const formattedTaskDate = taskDate.toISOString().split('T')[0];
      return formattedTaskDate === formattedDate;
    });
  }
    
  

  setCurrentWeekDates(): void {
    const startOfWeek = this.getStartOfWeek(this.currentDate);
    this.currentWeekDates = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index); // Set dates for the whole week
      return date;
    });
  }
  private checkDarkMode(): void {
    if (typeof window !== 'undefined' && localStorage) {
      const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
      // Apply dark mode settings
      if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  }
  
  getStartOfWeek(date: Date): Date {
    const day = date.getDay() || 7; // Get the current day of the week (Sunday=0)
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - day + 1); // Set to Monday of that week
    startOfWeek.setHours(0, 0, 0, 0); // Reset time to start of the day
    return startOfWeek;
  }
  

  previousWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() - 7); // Go back 7 days
    this.setCurrentWeekDates(); // Update displayed week
  }

  nextWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() + 7); // Go forward 7 days
    this.setCurrentWeekDates(); // Update displayed week
  }
}
