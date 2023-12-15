import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppRoutingModule } from './app-routing.module';
import { GameComponent } from './game/game.component';
import { MenuComponent } from './menu/menu.component';

describe('AppRoutingModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        { path: 'game', component: GameComponent },
        { path: '', component: MenuComponent }
      ])],
      declarations: [GameComponent, MenuComponent],
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppRoutingModule);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should navigate to /game', () => {
    const fixture = TestBed.createComponent(AppRoutingModule);
    const router = TestBed.inject(RouterTestingModule);
    const navigateSpy = spyOn(router, 'navigateByUrl');

    fixture.componentInstance.navigate('/game');

    expect(navigateSpy).toHaveBeenCalledWith('/game');
  });

  it('should navigate to /', () => {
    const fixture = TestBed.createComponent(AppRoutingModule);
    const router = TestBed.inject(RouterTestingModule);
    const navigateSpy = spyOn(router, 'navigateByUrl');

    fixture.componentInstance.navigate('/');

    expect(navigateSpy).toHaveBeenCalledWith('/');
  });
});
