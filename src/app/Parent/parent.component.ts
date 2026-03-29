import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ParentService } from './parent-service';

@Component({
    selector: 'app-parent',
    templateUrl: './parent.component.html',
    standalone: false,
    styleUrl: './parent.component.css'
})
export class ParentComponent implements OnInit {
    products: any[] = [];
    constructor(private _parentService: ParentService,private cdr: ChangeDetectorRef) { }
    ngOnInit(): void {
        // const testData = this._parentService.testData;
        // console.log('Test Data from Service:', testData);
        this.getProducts();
        console.log('API is getting called');
    }
    getProducts() {
        this._parentService.getProducts().subscribe({
            next: (res) => {
                console.log('API Response:', res);
                this.products = res;
                this.cdr.markForCheck();
                console.log('API products Response:', this.products);
            },
            error: (err) => {
                console.error('Error:', err);
            }
        });

        // this._parentService.getData().subscribe(data => {
        //     console.log('Data received from service:', data);
        // }
    }

    isSignup = false;
    formData: any = null;
    sumresult: number = 0;
    inputOne: number | undefined;
    inputTwo: number | undefined;
    message: string = "";
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
    calculateSum(): void {
        if (this.inputOne !== undefined && this.inputTwo !== undefined) {
            this.sumresult = Number(this.inputOne) + Number(this.inputTwo);
            console.log('Sum:', this.sumresult);
        } else {
            console.log('Please enter valid numbers for both inputs.');
        }
    }
}