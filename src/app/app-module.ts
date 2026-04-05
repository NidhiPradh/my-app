import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ParentComponent } from './Parent/parent.component';
import { ChildComponent } from './child/child.component';
import { FormsModule } from '@angular/forms';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth/auth-routing.module';

@NgModule({
  declarations: [SigninComponent, SignupComponent],
  imports: [BrowserModule, CommonModule, FormsModule, AuthRoutingModule, AppRoutingModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
