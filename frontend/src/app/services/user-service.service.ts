import {Injectable, SkipSelf} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TokenResponseModel} from "../models/TokenResponse.model";
import {UserModel} from "../models/User.model";
import {AuthService} from "./auth-service.service";
import {ApiResponseModel} from "../models/ApiResponse.model";

@Injectable({providedIn: "root"})
export class UserService {

  constructor(public httpServ: HttpClient, private authServ: AuthService) {
  }

  myContactsIds: number[] = [];

  myContacts: UserModel[] = [];



  currentChatPartnerId: number | null = null;

  getAllUsers(){
    return this.httpServ.get<any[]>("http://localhost:3001/get-all-users");
  }

  getSpecificUsers(inputValue: string){

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authServ.authToken}`,
      'Content-Type': 'application/json'// Auth-Token im Header
    });

    return this.httpServ.post<any>("http://localhost:3001/get-users-matching-search", {inputValue, 'myContactsIds': this.myContactsIds}, {
      "headers": headers
    });
  }

  addUserForChat(contactId: number | null){
    return this.httpServ.post<any>("http://localhost:3001/add-user-for-chat", {contactId, "currentUserId": this.authServ.currentUserId});
  }


  getMyContactsIds(){

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authServ.authToken}`,
      'Content-Type': 'application/json'// Auth-Token im Header
    });

    return this.httpServ.post<any>("http://localhost:3001/get-my-contacts-ids", {"currentUserId": this.authServ.currentUserId}, {
      headers
    });
  }


  getMyContacts() {

    /*const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authServ.authToken}`,
      'Content-Type': 'application/json'// Auth-Token im Header
    });*/

    return this.httpServ.post<any>("http://localhost:3001/get-my-contacts", {"myContactsIds": this.myContactsIds} );
  }

  getCurrentOwnUserId(){
    return this.httpServ.get<any>("http://localhost:3001/get-current-own-user-id");
  }


  loadChats() {
    return this.httpServ.post<any>("http://localhost:3001/load-chat-messages", {"currentUserId": this.authServ.currentUserId, "currentChatPartnerId": this.currentChatPartnerId});
  }

  getOwnContact(){
    return this.httpServ.post<any>("http://localhost:3001/get-my-user", {"currentUserId": this.authServ.currentUserId} );
  }


  editUser(editData: any){
    return this.httpServ.patch<any>("http://localhost:3001/edit-user", {editData, "currentUserId": this.authServ.currentUserId});
  }


  deleteChat(chatPartnerIdToDelete: number | null){
    return this.httpServ.delete<any>(`http://localhost:3001/delete-chat/${chatPartnerIdToDelete}/${this.authServ.currentUserId}`);
  }



}
