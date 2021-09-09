import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentsService } from '@libs/agents';

@NgModule({
  imports: [CommonModule],
  providers: [AgentsService]
})
export class ContactCenterModule { }
