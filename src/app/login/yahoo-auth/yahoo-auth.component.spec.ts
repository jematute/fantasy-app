import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YahooAuthComponent } from './yahoo-auth.component';

describe('YahooAuthComponent', () => {
  let component: YahooAuthComponent;
  let fixture: ComponentFixture<YahooAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YahooAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YahooAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
