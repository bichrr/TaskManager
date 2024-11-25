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
  weekList: string[] = []; // List of week ranges for dropdown

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.checkDarkMode();
    this.generateWeeks();
    this.setCurrentWeekDates();
    this.loadTasksForCalendar();
  }

  /**
   * Generate a list of week ranges for the dropdown.
   */
  generateWeeks(): void {
    const weeks: string[] = [];
    const numberOfWeeksToGenerate = 12; // Adjust how many weeks you want to display

    // Fix the current date to the start of the current week
    const startOfCurrentWeek = this.getStartOfWeek(new Date());

    for (let i = 0; i < numberOfWeeksToGenerate; i++) {
      const startOfWeek = new Date(startOfCurrentWeek);
      startOfWeek.setDate(startOfCurrentWeek.getDate() + i * 7);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      // Format the week as "dd-mm-yyyy - dd-mm-yyyy"
      const weekRange = `${this.formatDate(startOfWeek)} - ${this.formatDate(endOfWeek)}`;
      weeks.push(weekRange);
    }

    this.weekList = weeks;
  }

  /**
   * Navigate to the selected week from the dropdown.
   */
  goToSelectedWeek(event: any): void {
    const selectedWeek = event.target.value;
    const weekRange = selectedWeek.split(' - ');
    const startDate = this.parseDueDate(weekRange[0]); // Parse the start date from the range

    if (startDate) {
      this.currentWeekDates = this.getWeekDates(startDate);
    }
  }

  /**
   * Get the dates of the current week.
   */
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

  /**
   * Navigate back to the current week.
   */
  goToCurrentWeek(): void {
    this.currentWeekDates = this.getCurrentWeekDates();
  }

  /**
   * Load tasks for the calendar.
   */
  loadTasksForCalendar(): void {
    this.tasks = this.taskService.loadTasks();
  }

  /**
   * Get tasks assigned to a specific date.
   */
  getTasksByDate(date: Date): Task[] {
    const formattedDate = this.formatDate(date); // Format date as dd-mm-yyyy

    return this.tasks.filter(task => {
      const taskDate = this.parseDueDate(task.dueDate!);
      return taskDate ? this.formatDate(taskDate) === formattedDate : false;
    });
  }

  /**
   * Set the dates for the current week.
   */
  setCurrentWeekDates(): void {
    const startOfWeek = this.getStartOfWeek(this.currentDate);
    this.currentWeekDates = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return date;
    });
  }

  /**
   * Check and apply dark mode settings.
   */
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

  /**
   * Get the start of the week for a given date (Monday).
   */
  getStartOfWeek(date: Date): Date {
    const day = date.getDay() || 7; // Sunday is 0, set it to 7
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - day + 1); // Go back to Monday
    startOfWeek.setHours(0, 0, 0, 0); // Reset time
    return startOfWeek;
  }

  /**
   * Navigate to the previous week.
   */
  previousWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() - 7); // Go back 7 days
    this.setCurrentWeekDates();
  }

  /**
   * Navigate to the next week.
   */
  nextWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() + 7); // Go forward 7 days
    this.setCurrentWeekDates();
  }

  /**
   * Format a Date object as dd-mm-yyyy.
   */
  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  /**
   * Parse a due date string (dd-mm-yyyy) into a Date object.
   */
  private parseDueDate(dueDate: string): Date | null {
    const [day, month, year] = dueDate.split('-').map(Number);
    if (!day || !month || !year) {
      return null; // Invalid date
    }
    return new Date(year, month - 1, day); // JavaScript months are 0-based
  }

  /**
   * Get the dates for the current week.
   */
  getCurrentWeekDates(): Date[] {
    const startOfWeek = this.getStartOfWeek(new Date());
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  }
}
