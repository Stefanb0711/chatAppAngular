import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteMessageFieldComponent } from './write-message-field.component';

describe('WriteMessageFieldComponent', () => {
  let component: WriteMessageFieldComponent;
  let fixture: ComponentFixture<WriteMessageFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WriteMessageFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WriteMessageFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
