import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentsModule } from '@libs/agents';
import { InteractionsModule } from '@libs/interactions';
import { ContactCenterService } from './services';

@NgModule({
  imports: [
    CommonModule,
    AgentsModule,
    InteractionsModule
  ],
  providers: [
    ContactCenterService
  ]
})
export class ContactCenterModule { }
