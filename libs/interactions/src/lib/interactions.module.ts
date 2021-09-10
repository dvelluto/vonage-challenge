import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InteractionsService } from './services';

@NgModule({
  imports: [CommonModule],
  providers: [
    InteractionsService
  ]
})
export class InteractionsModule { }
