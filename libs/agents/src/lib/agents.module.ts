import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentsService } from './services';

@NgModule({
  imports: [CommonModule],
  providers: [
    AgentsService
  ]
})
export class AgentsModule { }
