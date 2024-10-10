import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {WriteMessageFieldComponent} from "./write-message-field/write-message-field.component";
import {ChatMessageModel} from "../models/ChatMessage.model";
import {SingleChatMessageComponent} from "./single-chat-message/single-chat-message.component";
import {ChatService} from "../services/chat-service.service";
import {UserService} from "../services/user-service.service";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    NgOptimizedImage,
    WriteMessageFieldComponent,
    NgForOf,
    SingleChatMessageComponent,
    NgIf,
    NgClass
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit{


   constructor(public chatServ: ChatService, public userServ: UserService) {

   }


  ngOnInit() {

      this.chatServ.getMessages().subscribe((messageData: any) => {

        console.log("Socket GetMessages message: ", messageData);
        this.chatServ.currentChatMessages.push(messageData);
        //this.messages.push(message);
      })

      console.log("CurrentChatMessages: ", this.chatServ.currentChatMessages);

    }

    placeholderContent: string = "ChatPartnerMessage";

  /*
  emptyChat : ChatMessageModel = {
    id: null,
    name: "",
    chatPartner: null,
    currentUserId: null,
    myTextMessage: "",
    chatPartnerMessage: "",
    messageTime: Date.toString()
  }


  currentChatMessages: ChatMessageModel[] = [this.emptyChat];


  ngOnInit() {
    this.chatServ.loadChatMessages().subscribe({
      next : (res : ChatMessageModel[]) => {
        this.currentChatMessages = res;
        console.log("CurrentChatMessages: ", this.currentChatMessages);

      }, error : (err) => {
        console.error(err);
      }
    });
  }*/

}
