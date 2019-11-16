import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FigurationComponent } from './figuration.component';

describe('FigurationComponent', () => {
  let component: FigurationComponent;
  let fixture: ComponentFixture<FigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
