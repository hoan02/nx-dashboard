import {
  Component,
  OnInit,
  OnChanges,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-child',
  imports: [],
  templateUrl: './child.component.html',
})
export class ChildComponent
  implements
    OnChanges,
    OnInit,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy
{
  @Input() value!: string;
  @Output() messageEvent = new EventEmitter<string>();

  constructor() {
    console.log(
      '%cConstructor: ChildComponent instance created',
      'color: #FFD700'
    ); // Vàng đậm
  }

  sendData() {
    this.messageEvent.emit('Hello Parent!'); // Phát sự kiện kèm dữ liệu
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(
      '%cngOnChanges: Input value changed',
      'color: #FFA500',
      changes
    ); // Cam sáng
  }

  ngOnInit() {
    console.log('%cngOnInit: Component initialized', 'color: #00FF7F'); // Xanh lá sáng
  }

  ngDoCheck() {
    console.log('%cngDoCheck: Change detection running', 'color: #00CED1'); // Xanh biển sáng
  }

  ngAfterContentInit() {
    console.log('%cngAfterContentInit: Content projected', 'color: #FF69B4'); // Hồng sáng
  }

  ngAfterContentChecked() {
    console.log('%cngAfterContentChecked: Content checked', 'color: #FF69B4'); // Hồng sáng
  }

  ngAfterViewInit() {
    console.log('%cngAfterViewInit: View initialized', 'color: #1E90FF'); // Xanh dương sáng
  }

  ngAfterViewChecked() {
    console.log('%cngAfterViewChecked: View checked', 'color: #1E90FF'); // Xanh dương sáng
  }

  ngOnDestroy() {
    console.log(
      '%cngOnDestroy: Component is being destroyed',
      'color: #FF4500'
    ); // Đỏ cam
  }
}
