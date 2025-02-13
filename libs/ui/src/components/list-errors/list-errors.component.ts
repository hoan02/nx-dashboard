import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-list-errors',
  templateUrl: './list-errors.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class ListErrorsComponent {
  @Input() errors: string[] = [];
}
