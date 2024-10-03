import {Component, Input} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {UserService} from "../../services/user-service.service";
import {ChatMessageModel, ChatResponse} from "../../models/ChatMessage.model";
import {ChatService} from "../../services/chat-service.service";

@Component({
  selector: 'app-single-contact',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './single-contact.component.html',
  styleUrl: './single-contact.component.css'
})
export class SingleContactComponent {


  constructor(private userServ: UserService, public chatServ: ChatService) {
    this.chatServ.currentChatMessages = [this.emptyChat];

  }

  @Input() username: string = '';
  @Input() picture: string = '';
  @Input() contactId: number | null = null;

  emptyChat : ChatMessageModel = {
    id: null,
    name: "",
    chat_partner: null,
    current_user_id: null,
    my_text_message: "",
    chat_partner_message: "",
    message_time: Date.toString()
  };





  showChat() {
    this.userServ.currentChatPartnerId = this.contactId;

    this.chatServ.loadChatMessages().subscribe({
      next : (res : ChatResponse) => {
        this.chatServ.currentChatMessages = res["loadedChat"];
        console.log("CurrentChatMessages: ", this.chatServ.currentChatMessages);

      }, error : (err) => {

        console.log("Error with Loading Chat: ", err);
      }
    });

  }


}
