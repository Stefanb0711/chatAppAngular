import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleChatMessageComponent } from './single-chat-message.component';

describe('SingleChatMessageComponent', () => {
  let component: SingleChatMessageComponent;
  let fixture: ComponentFixture<SingleChatMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleChatMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleChatMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
