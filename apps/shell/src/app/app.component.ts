import { Component } from '@angular/core';
import { LayoutComponent } from "./components/layout/layout.component";

@Component({
  imports: [LayoutComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'shell';
}
