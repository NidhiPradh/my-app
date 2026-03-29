import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  standalone: false,
  styleUrls: ['./child.component.css'],
})
export class ChildComponent implements OnInit {
    @Input() inputName: string | undefined 

    constructor() { }
    ngOnInit(): void {
        console.log('Child component initialized with inputName:', this.inputName);
       // throw new Error('Method not implemented.');
    }
}