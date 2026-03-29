import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ParentComponent } from './Parent/parent.component';
import { ChildComponent } from './child/child.component';
import { FormsModule } from '@angular/forms';
import { Child2 } from './child-2/child-2';
import { ParentService } from './Parent/parent-service';

@NgModule({
  declarations: [App, ParentComponent, ChildComponent, Child2],
  imports: [BrowserModule, AppRoutingModule, FormsModule,HttpClientModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
