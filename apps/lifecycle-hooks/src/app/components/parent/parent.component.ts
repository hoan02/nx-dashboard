import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChildComponent } from '../child/child.component';

@Component({
  selector: 'app-parent',
  imports: [CommonModule, ChildComponent],
  templateUrl: './parent.component.html',
})
export class ParentComponent {
  isChildVisible = false;
  parentValue = 'Initial Value';
  message = '';

  receiveMessage(childMessage: string) {
    this.message = childMessage;
  }

  toggleChild() {
    this.isChildVisible = !this.isChildVisible;
  }

  changeValue() {
    this.parentValue = 'Changed Value ' + Math.random();
  }
}
