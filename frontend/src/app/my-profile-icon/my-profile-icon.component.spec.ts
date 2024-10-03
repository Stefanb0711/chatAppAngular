import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileIconComponent } from './my-profile-icon.component';

describe('MyProfileIconComponent', () => {
  let component: MyProfileIconComponent;
  let fixture: ComponentFixture<MyProfileIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProfileIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyProfileIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
