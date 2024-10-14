import {Component, Input, OnInit} from '@angular/core';
import {NgClass, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-single-chat-message',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgClass
  ],
  templateUrl: './single-chat-message.component.html',
  styleUrl: './single-chat-message.component.css'
})
export class SingleChatMessageComponent implements OnInit {
  @Input() content: string = "";
  @Input() messageTime: string = "";
  @Input() isChatPartnerMessage: boolean = false;

  ngOnInit() {

  }

  checkContent(){
    console.log("Content: ", this.content);
    console.log("Message Time: ", this.messageTime);
  }

}
