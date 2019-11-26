import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsotopeComponent } from './isotope.component';

describe('IsotopeComponent', () => {
  let component: IsotopeComponent;
  let fixture: ComponentFixture<IsotopeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsotopeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsotopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
