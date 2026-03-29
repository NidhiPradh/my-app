import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  standalone: false,
  styleUrl: './parent.component.css'
})
export class ParentComponent implements OnInit {
    name: string = 'John Doe';
    inputValue: string = '';
    ngOnInit(): void {
        this.name = '';
    }
    onSubmit(): void {
        this.name = this.inputValue;
        //debugger;
        console.log('Submitted name:', this.name);
    }
}
