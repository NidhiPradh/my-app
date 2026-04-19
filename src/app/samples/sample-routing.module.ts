import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSampleComponent } from './add-sample/add-sample.component';
import { SampleListComponent } from './sample-list/sample-list.component';

const routes: Routes = [
  {  path: '',component: SampleListComponent },
  {  path: 'modify-sample', component: AddSampleComponent}
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class sampleRoutingModule { }
