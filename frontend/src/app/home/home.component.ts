import {Component, OnInit} from '@angular/core';
import {ContactListComponent} from "../contact-list/contact-list.component";
import {ChatComponent} from "../chat/chat.component";
import {UserService} from "../services/user-service.service";
import {HttpErrorResponse} from "@angular/common/http";
import {UserModel} from "../models/User.model";
import {AuthService} from "../services/auth-service.service";
import {InterfaceService} from "../services/interface-service.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ContactListComponent,
    ChatComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  currentToken: string | null = null;

  constructor(private userServ: UserService, private authServ: AuthService, private intServ: InterfaceService) {

  }


  ngOnInit() {

    console.log("Aktueller Authtoken: ", this.authServ.authToken);


    this.currentToken = localStorage.getItem("token");


    if (this.currentToken !== "" && this.currentToken !== null) {
      this.authServ.userLoggedIn = true;
      this.authServ.authToken = localStorage.getItem("token");
      /*
      this.userServ.getOwnContact().subscribe({
      next : (res: any) => {
        console.log("MyContact: ", res[0]);
        this.authServ.currentUser = res[0];
      }, error : (err: HttpErrorResponse) => {

      }
    });*/

      this.userServ.getUserInfoWhenYouHaveToken().subscribe({
        next: (res: any) => {

          this.authServ.currentUser = res["currentUser"][0];

          console.log("CurrentUser nach getUserInfoWhenYouHaveToken: ", this.authServ.currentUser);
          this.userServ.myContactsIds = this.authServ.currentUser.contacts_of_user;

          this.userServ.getMyContacts().subscribe({
          next : (resContacts: any) => {
            console.log("My ContactListComponent: ", resContacts["data"] )/*["data"])*/;
            this.userServ.myContacts = resContacts["data"];

          }, error : (err: HttpErrorResponse) => {
              console.error("Fehler beim Zugreifen auf Contacts Ids oder Contact");
          }
        });

        }, error: (err: HttpErrorResponse) => {

          if (err.status === 403){
            this.authServ.userLoggedIn = false;
          }
            console.error("Fehler beim bekommen der Userinfo mithilfe des Authtokens");
          }
      });

      console.log("Aktueller Benutzer: ", this.authServ.currentUser);

    } else {
      this.authServ.userLoggedIn = false;

    }

    /*
    if (this.authServ.userLoggedIn !== false){

      try {

        this.authServ.authToken = localStorage.getItem("token");
        //console.log("Aktueller Authtoken: ", this.authServ.authToken);
      } catch (err) {
        console.log("Kein Token vorhanden");
      }

    }*/

    //console.log("CurrentToken: ", this.currentToken);
    /*
    this.userServ.getOwnContact().subscribe({
      next : (res: any) => {
        console.log("MyContact: ", res[0]);
        this.authServ.currentUser = res[0];
      }, error : (err: HttpErrorResponse) => {

      }
    });*/

  }


  closeModal(event?: MouseEvent){
    this.intServ.isAddChatPanelOpened = false;
  }

}
