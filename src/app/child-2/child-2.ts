import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-child-2',
  standalone: false,
  templateUrl: './child-2.html',
  styleUrl: './child-2.css',
})
export class Child2 {
  @Input() inputMessage: string ="" }
