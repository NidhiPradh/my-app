import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ParentService } from '../Parent/parent-service';
@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  standalone: false,
  styleUrls: ['./child.component.css'],
})
export class ChildComponent implements OnInit {
  constructor(private _parentService : ParentService) { }
  testData: string = "";
  ngOnInit(): void {
    const test = this._parentService.testData;
    console.log('Test Data from Service:', test);
    this.testData = test;
  }
    @Input() inputName: string | undefined 
    message : string = "";
    @Output() sendData = new EventEmitter<string>();
     @Input() isSignup: boolean = false;
     @Input() Sum: number = 0;
  @Output() formSubmit = new EventEmitter<any>();

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Form Data:', form.value);
      this.formSubmit.emit(form.value);

   
      }
    }
  }  