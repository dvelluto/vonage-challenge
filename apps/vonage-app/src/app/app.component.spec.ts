import { TestBed } from '@angular/core/testing';
import { AgentsModule } from '@libs/agents';
import { ContactCenterModule, ContactCenterService } from '@libs/contact-center';
import { InteractionsModule } from '@libs/interactions';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentsModule, InteractionsModule, ContactCenterModule],
      declarations: [AppComponent],
      providers: [ContactCenterService]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'vonage-app'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('vonage-app');
  });
});
