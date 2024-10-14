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
export class HomeComponent implements OnInit{

  currentToken: string | null = null;

  constructor(private userServ: UserService, private authServ: AuthService, private intServ: InterfaceService) {

  }

  ngOnInit() {

    console.log("Aktueller Authtoken: ", this.authServ.authToken);

    this.currentToken = localStorage.getItem("token");

    if (this.currentToken !== "") {
      this.authServ.userLoggedIn = true;

    }

    if (this.authServ.userLoggedIn !== false){

      try {

        this.authServ.authToken = localStorage.getItem("token");
        //console.log("Aktueller Authtoken: ", this.authServ.authToken);
      } catch (err) {
        console.log("Kein Token vorhanden");
      }

    }

    //console.log("CurrentToken: ", this.currentToken);

    this.userServ.getOwnContact().subscribe({
      next : (res: any) => {
        console.log("MyContact: ", res);
        this.authServ.currentUser = res;
      }, error : (err: HttpErrorResponse) => {

      }
    });

  }


  closeModal(event?: MouseEvent){
    this.intServ.isAddChatPanelOpened = false;
  }

}
