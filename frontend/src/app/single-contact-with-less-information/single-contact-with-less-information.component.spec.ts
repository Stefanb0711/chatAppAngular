import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleContactWithLessInformationComponent } from './single-contact-with-less-information.component';

describe('SingleContactWithLessInformationComponent', () => {
  let component: SingleContactWithLessInformationComponent;
  let fixture: ComponentFixture<SingleContactWithLessInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleContactWithLessInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleContactWithLessInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
