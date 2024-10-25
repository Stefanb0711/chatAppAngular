import {Component, Input} from '@angular/core';
import {ChatService} from "../../services/chat-service.service";
import {FormsModule} from "@angular/forms";
import {NgClass, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-write-message-field',
  standalone: true,
  imports: [
    FormsModule,
    NgOptimizedImage,
    NgClass
  ],
  templateUrl: './write-message-field.component.html',
  styleUrl: './write-message-field.component.css'
})
export class WriteMessageFieldComponent {

  inputField : string = "";
  messageTime: string | null = null;

  @Input() submitButtonText: string = "";

  sendingMessageGreyedOut: boolean = true;





  getCurrentTimestamp() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Monate sind 0-basiert
  const day = String(now.getDate()).padStart(2, '0');

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


  constructor(private chatServ: ChatService) {
  }

  onSend() {
    this.messageTime = this.getCurrentTimestamp();
    console.log("Aktuelle Uhrzeit: ", this.messageTime);

    this.chatServ.sendMessage(this.inputField, this.messageTime);

    }



}
