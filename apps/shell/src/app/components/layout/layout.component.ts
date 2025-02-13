import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {}
