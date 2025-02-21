import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-theme-toggle-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle-button.component.html',
})
export class ThemeToggleButtonComponent {
  constructor(public themeService: ThemeService) {}
}
