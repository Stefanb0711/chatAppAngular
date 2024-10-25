import {ChangeDetectorRef, Component, Input, signal} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {UserService} from "../../services/user-service.service";
import {ChatMessageModel, ChatResponse} from "../../models/ChatMessage.model";
import {ChatService} from "../../services/chat-service.service";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../../services/auth-service.service";

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


  constructor(private authServ: AuthService,private userServ: UserService, public chatServ: ChatService, private cd: ChangeDetectorRef) {
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

    console.log(`ShowChat CurrentUserId: ${this.authServ.currentUserId}, CurrentChatPartnerId: ${this.userServ.currentChatPartnerId} `);

    this.chatServ.loadChatMessages().subscribe({
      next : (res : ChatResponse) => {
        this.chatServ.currentChatMessages = res["loadedChat"];
        console.log("CurrentChatMessages: ", this.chatServ.currentChatMessages);

      }, error : (err: any) => {

        console.log("Error with Loading Chat: ", err);
      }
    });

  }

  onDelete(event: MouseEvent, idOfUserToDelete: number | null){

    event.stopPropagation();

    this.userServ.deleteChat(idOfUserToDelete).subscribe({
      next: (res: any) => {

        console.log("ResMyContacts in delete: ", res["myContacts"]);

        //this.userServ.myContacts = res["myContacts"];
        //this.cd.detectChanges(); // Manuell die Change Detection anstoßen

        this.userServ.myContacts = res["myContacts"]["data"];
        /*
        console.log("Kontakt löschen erfolgreich gewesen");
        this.userServ.getMyContactsIds().subscribe({
            next: (res: any) => {

              this.userServ.myContactsIds = res["data"];
              this.userServ.getMyContacts().subscribe({
                next: (resContacts: any) => {
                  this.userServ.myContacts = resContacts["data"];

                }, error : (err) => {
                  console.log("Fehler beim finden der Kontake");
              }
              });

            }, error: (err) => {
              console.log("Fehler beim finden der Kontaktids");
            }
          });*/

    }, error: (err: HttpErrorResponse) => {
      console.log("Fehler beim löschen des Kontakts");
    }

    });


  }


}
