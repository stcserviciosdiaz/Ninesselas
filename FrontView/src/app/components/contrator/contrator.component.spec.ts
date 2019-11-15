import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratorComponent } from './contrator.component';

describe('ContratorComponent', () => {
  let component: ContratorComponent;
  let fixture: ComponentFixture<ContratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
