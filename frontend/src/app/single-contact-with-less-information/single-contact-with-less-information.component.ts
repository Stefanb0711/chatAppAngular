import {Component, Input} from '@angular/core';
import {NgClass, NgIf, NgOptimizedImage, NgStyle} from "@angular/common";
import {InterfaceService} from "../services/interface-service.service";
import {UserService} from "../services/user-service.service";
import {ChatMessageModel} from "../models/ChatMessage.model";
import {ApiResponseModel} from "../models/ApiResponse.model";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-single-contact-with-less-information',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgStyle,
    NgClass,
    NgIf
  ],
  templateUrl: './single-contact-with-less-information.component.html',
  styleUrl: './single-contact-with-less-information.component.css'
})
export class SingleContactWithLessInformationComponent {

    @Input() picture: string = '';  // Das ist die Input Property, die von außen gebunden werden kann
    @Input() username: string = "";
    @Input() contactId: number | null = null;

    constructor(private intServ: InterfaceService, private userServ: UserService) {
    }


    isHovered: boolean = false;

    onAddContact(){
      console.log("Wir versuchen jetzt ein Kontakt zu adden");

      this.intServ.isAddChatPanelOpened = false;
      this.userServ.addUserForChat(this.contactId).subscribe({
        next : (res: any) => {
          //console.log("Benutzer adden war erfolgreich");

          this.userServ.getMyContactsIds().subscribe({
            next: (res: any) => {
              this.userServ.myContactsIds = res["data"];
              //console.log("Meine Kontaktids nach dem hinzufügen eines neuen Benutzers: ", this.userServ.myContactsIds);
              this.userServ.getMyContacts().subscribe({
                next: (resContacts: any) => {
                  this.userServ.myContacts = resContacts["data"];
                  //console.log("Meine Kontakte nach dem hinzufügen eines neuen: ", this.userServ.myContacts);

                }, error : (err) => {
                  console.log("Fehler beim finden der Kontake");
              }
              });

            }, error: (err) => {
              console.log("Fehler beim finden der Kontaktids");
            }
          })

          //console.log(res["message"]);
        } , error : (err: HttpErrorResponse) => {
          console.log("Fehler beim Kontakt hinzufügen");
        }
        });


    }

}
