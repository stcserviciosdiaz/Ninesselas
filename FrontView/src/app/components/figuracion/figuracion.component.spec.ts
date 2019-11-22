import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiguracionComponent } from './figuracion.component';

describe('FiguracionComponent', () => {
  let component: FiguracionComponent;
  let fixture: ComponentFixture<FiguracionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiguracionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
