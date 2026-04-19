import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { sampleRoutingModule } from './sample-routing.module';
import { SampleListComponent } from './sample-list/sample-list.component';
import { CommonModule } from '@angular/common';
import { AddSampleComponent } from './add-sample/add-sample.component';

@NgModule({
  declarations: [AddSampleComponent, SampleListComponent],
  imports: [CommonModule, FormsModule, sampleRoutingModule]
})
export class SampleModule {}

