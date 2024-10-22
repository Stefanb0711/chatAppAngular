import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {StartConversationComponent} from "./start-conversation/start-conversation.component";
import {AuthService} from "../services/auth-service.service";
import {UserService} from "../services/user-service.service";
import {UserModel} from "../models/User.model";
import {HttpErrorResponse} from "@angular/common/http";
import {SingleContactComponent} from "./single-contact/single-contact.component";

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [
    NgForOf,
    StartConversationComponent,
    SingleContactComponent,
    NgIf
  ],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit {

  constructor(public authServ: AuthService, public userServ: UserService) {
  }

  myContacts : UserModel[] = [];



  ngOnInit() {

    /*
    setInterval(() => {
      console.log("Meine Kontakte: ", this.userServ.myContacts);
    }, 5000);*/

    console.log("OnInit von ContactListComponent");
    this.userServ.getMyContactsIds().subscribe({
      next : (res: any) => {
        this.userServ.myContactsIds = res["data"];/*["myContactIds"]*/
        console.log("My Contact Ids: ", this.userServ.myContactsIds);

        this.userServ.getMyContacts().subscribe({
          next : (resContacts: any) => {
            console.log("My ContactListComponent: ", resContacts["data"] )/*["data"])*/;
            this.userServ.myContacts = resContacts["data"];

          }, error : (err: HttpErrorResponse) => {
              console.error("Fehler beim ZUgreifen auf Contacts Ids oder Contact");
          }
        })


      }, error: (err: HttpErrorResponse) => {

      }
    });




  }




}
