import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ContactCenterModule } from '@libs/contact-center';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ContactCenterModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
