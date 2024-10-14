import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {Subject, Subscription} from "rxjs";
import {FormsModule} from "@angular/forms";
import {Event} from "@angular/router";
import {AuthService} from "../../services/auth-service.service";
import {UserService} from "../../services/user-service.service";
import {UserModel} from "../../models/User.model";
import {
  SingleContactWithLessInformationComponent
} from "../../single-contact-with-less-information/single-contact-with-less-information.component";
import {InterfaceService} from "../../services/interface-service.service";
import {WriteMessageFieldComponent} from "../../chat/write-message-field/write-message-field.component";

@Component({
  selector: 'app-start-conversation',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    NgStyle,
    NgClass,
    NgForOf,
    SingleContactWithLessInformationComponent,
    WriteMessageFieldComponent
  ],
  templateUrl: './start-conversation.component.html',
  styleUrl: './start-conversation.component.css'
})
export class StartConversationComponent{

  constructor(private userServ: UserService, public intServ: InterfaceService, public authServ: AuthService) {

  }

  mouseIsOverClosingButton: boolean = false;

  //isAddChatPanelOpened: boolean = false;

  addChatWindowPosition = {
    x: 0,
    y: 0
  };


  setMouseOverCloseButton(){
    this.mouseIsOverClosingButton = true;
  }

  setMouseLeaveCloseButton(){
    this.mouseIsOverClosingButton = false;
  }

  inputSearchValue: string = "";

  contactSuggestions: any = null;

  onSearchForContacts(event: any){

    this.userServ.getSpecificUsers(this.inputSearchValue).subscribe({
      next : (res) => {
        this.contactSuggestions = res/*["inputValue"]*/;


      },
      error: (err) => {
        console.log("Fehler beim filtern von Benutzern");
        console.error(err);
      }
    });

    console.log("Eingabe: ", this.inputSearchValue);

  }



  openAddChatPanel(event: any) {

    const button = event.target as HTMLElement;
    const rect = button.getBoundingClientRect();
    this.addChatWindowPosition = {
      x: rect.left,
      y: window.innerHeight - rect.bottom
    };

    this.intServ.isAddChatPanelOpened = true;

  }

  closeAddChatPanel(){
    this.intServ.isAddChatPanelOpened = false;
  }

}
