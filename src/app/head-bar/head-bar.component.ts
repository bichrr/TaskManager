import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-head-bar',
  standalone: true,
  imports: [],
  templateUrl: './head-bar.component.html',
  styleUrl: './head-bar.component.css'
})
export class HeadBarComponent implements OnInit {
  constructor(private router: Router) {
  }
  isDarkMode = false;

  ngOnInit(): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    // Safe to use localStorage in the browser
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') {
      this.isDarkMode = true;
    }
  }
}

  
  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }
  
  goToCreateTask() {
    this.router.navigate(['/create-task']); 
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
  goToCalendar(): void {
    this.router.navigate(['/calendar']);
  }
}
