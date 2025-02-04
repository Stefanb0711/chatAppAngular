import {Injectable, SkipSelf} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TokenResponseModel} from "../models/TokenResponse.model";
import {UserModel} from "../models/User.model";
import {AuthService} from "./auth-service.service";
import {ApiResponseModel} from "../models/ApiResponse.model";
import {jwtDecode} from "jwt-decode";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";
import {DecodedToken} from "../models/DecodedToken.model";
@Injectable({providedIn: "root"})
export class UserService {

  constructor(public httpServ: HttpClient, private authServ: AuthService) {
  }

  myContactsIds: number[] = [];

  myContacts: UserModel[] = [];



  currentChatPartnerId: number | null = null;

  getAllUsers(){
    this.authServ.authToken = localStorage.getItem("token");


    return this.httpServ.get<any[]>("http://localhost:3001/get-all-users");
  }

  getSpecificUsers(inputValue: string){
    this.authServ.authToken = localStorage.getItem("token");

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authServ.authToken}`,
      'Content-Type': 'application/json'// Auth-Token im Header
    });

    return this.httpServ.post<any>("http://localhost:3001/get-users-matching-search", {inputValue, 'myContactsIds': this.myContactsIds}, {headers});
  }

  addUserForChat(contactId: number | null){
    this.authServ.authToken = localStorage.getItem("token");

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authServ.authToken}`,
      'Content-Type': 'application/json'// Auth-Token im Header
    },
      );

    return this.httpServ.post<any>("http://localhost:3001/add-user-for-chat", {contactId, "currentUserId": this.authServ.currentUserId},
      {
      headers
    });
  }


  getMyContactsIds(){
    this.authServ.authToken = localStorage.getItem("token");

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authServ.authToken}`,
      'Content-Type': 'application/json'// Auth-Token im Header
    });

    return this.httpServ.post<any>("http://localhost:3001/get-my-contacts-ids", {"currentUserId": this.authServ.currentUserId}, {
      headers
    });
  }


  getMyContacts() {
    this.authServ.authToken = localStorage.getItem("token");

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authServ.authToken}`,
      'Content-Type': 'application/json'// Auth-Token im Header
    });
    /*const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authServ.authToken}`,
      'Content-Type': 'application/json'// Auth-Token im Header
    });*/

    return this.httpServ.post<any>("http://localhost:3001/get-my-contacts", {"myContactsIds": this.myContactsIds},
      {
      headers
    });
  }

  getCurrentOwnUserId(){

    this.authServ.authToken = localStorage.getItem("token");

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authServ.authToken}`,
      'Content-Type': 'application/json'// Auth-Token im Header
    });

    return this.httpServ.get<any>("http://localhost:3001/get-current-own-user-id", {
      headers
    });
  }


  loadChats() {
    this.authServ.authToken = localStorage.getItem("token");


    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authServ.authToken}`,
      'Content-Type': 'application/json'// Auth-Token im Header
    });

    return this.httpServ.post<any>("http://localhost:3001/load-chat-messages", {"currentUserId": this.authServ.currentUserId, "currentChatPartnerId": this.currentChatPartnerId},
      {
      headers
    });
  }

  getOwnContact(){
    this.authServ.authToken = localStorage.getItem("token");

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authServ.authToken}`,
      'Content-Type': 'application/json'// Auth-Token im Header
    });

    return this.httpServ.post<any>("http://localhost:3001/get-my-user", {"currentUserId": this.authServ.currentUserId},
      {
      headers
    });
  }


  getUserInfoWhenYouHaveToken() {

    let decodedToken;

    /*
    if (this.authServ.authToken !== null) {
      decodedToken = jwtDecode<DecodedToken>(this.authServ.authToken);

      //const loginData = decodedToken["loginData"];
    }*/

      //console.log("Decoded Token: ", decodedToken["loginData"]);

      const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authServ.authToken}`,
      'Content-Type': 'application/json'// Auth-Token im Header
      });



      /*
      const loginData = {
        "username": decodedToken["loginData"]["usernameOrEmail"],
        "password": decodedToken["loginData"]["password"]
      };*/

      return this.httpServ.post<any>("http://localhost:3001/get-user-when-you-have-username-and-password"/*, decodedToken*/,{headers});

  }


  editUser(editData: any){
    this.authServ.authToken = localStorage.getItem("token");

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authServ.authToken}`,
      'Content-Type': 'application/json'// Auth-Token im Header
    });

    return this.httpServ.patch<any>("http://localhost:3001/edit-user", {editData, "currentUserId": this.authServ.currentUserId},
      {
      headers
    });
  }


  deleteChat(chatPartnerIdToDelete: number | null){

    this.authServ.authToken = localStorage.getItem("token");

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authServ.authToken}`,
      'Content-Type': 'application/json'// Auth-Token im Header
    });

    return this.httpServ.delete<any>(`http://localhost:3001/delete-chat/${chatPartnerIdToDelete}/${this.authServ.currentUserId}`,
      {
      headers
    });
  }



}
