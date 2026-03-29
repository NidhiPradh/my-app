import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  standalone: false,
  styleUrls: ['./child.component.css'],
})
export class ChildComponent {
    // @Input() inputName: string | undefined 
    // message : string = "";
    // @Output() sendData = new EventEmitter<string>();
     @Input() isSignup: boolean = false;
  @Output() formSubmit = new EventEmitter<any>();

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Form Data:', form.value);
      this.formSubmit.emit(form.value);

   
      }
    }
  }  