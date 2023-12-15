import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'wumpus-game'`, () => {
    expect(component.title).toEqual('wumpus-game');
  });

  it('should render the title in the template', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.title').textContent).toContain('wumpus-game');
  });

  // Add more test cases as needed
});
