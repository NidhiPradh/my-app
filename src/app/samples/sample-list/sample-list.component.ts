import { Component, OnInit } from '@angular/core';
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
export class SampleListComponent implements OnInit {
  samples: Sample[] = [];
  constructor(
    private sampleService: SampleService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }
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
