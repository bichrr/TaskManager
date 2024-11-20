import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-head-bar',
  standalone: true,
  imports: [],
  templateUrl: './head-bar.component.html',
  styleUrl: './head-bar.component.css'
})
export class HeadBarComponent {
  constructor(private router: Router) {
  }
  goToCreateTask() {
    this.router.navigate(['/create-task']); 
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

}
