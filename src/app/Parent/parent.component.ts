import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  standalone: false,
  styleUrl: './parent.component.css'
})
export class ParentComponent {
    isSignup = false;
    formData: any = null;
  handleForm(data: any) {
    console.log('Received data from child:', data);
    this.formData = data;
    if (this.isSignup) {
      console.log('Signup Data:', data);
    } else {
      console.log('Signin Data:', data); 
    }
  
//     name: string = 'John Doe';
//     inputValue: string = '';
//     receivedMessage: string = '';
    
//     constructor() { }
//     ngOnInit(): void {
//         this.name = '';
//     }
//     onSubmit(): void {
//         this.name = this.inputValue;
//         //debugger;
//         console.log('Submitted name:', this.name);
//     }
//     receivedData: string = '';

//   receiveData(data: string): void {
//     this.receivedData = data;
//     console.log('From child:', data);
}
}