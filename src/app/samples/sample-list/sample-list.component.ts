import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, DoCheck, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Sample } from '../models/sample.model';
import { SampleService } from '../services/sample-service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sample-list.component',
  standalone: false,
  templateUrl: './sample-list.component.html',
  styleUrl: './sample-list.component.css',
})
export class SampleListComponent implements OnInit,OnChanges,DoCheck,AfterContentInit,
AfterContentChecked,AfterViewInit,AfterViewChecked,OnDestroy {
  samples: Sample[] = [];
  constructor(
    private sampleService: SampleService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }
  ngOnDestroy(): void {
    console.log('ng destroy called');
  }
  ngAfterViewChecked(): void {
    console.log('ng after view checked called');
  }
  ngAfterViewInit(): void {
    console.log('ng after view init called');
  }
  ngAfterContentChecked(): void {
    console.log('ng after content checked called');
  }
  ngAfterContentInit(): void {
    console.log('ng after content init called');
  }
  ngDoCheck(): void {
    console.log('ng do check called');
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('ng on changes called');
  }
  ngOnInit(): void {
    this.loadSamples();
  }

  loadSamples(): void {

    this.sampleService.getAllSamples().subscribe({
      next: (data) => {
        this.samples = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error fetching samples:', err);
      }
    });
  }

}
