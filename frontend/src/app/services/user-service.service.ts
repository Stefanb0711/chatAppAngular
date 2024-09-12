import {Injectable, SkipSelf} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {TokenResponseModel} from "../models/TokenResponse.model";
import {UserModel} from "../models/User.model";
import {AuthService} from "./auth-service.service";

@Injectable({providedIn: "root"})
export class UserService {

  constructor(public httpServ: HttpClient, private authServ: AuthService) {
  }

  getAllUsers(){
    return this.httpServ.get<any[]>("http://localhost:3001/get-all-users");
  }

  getSpecificUsers(inputValue: string){
    return this.httpServ.post<any>("http://localhost:3001/get-users-matching-search", {inputValue});
  }

  addUserForChat(contactId: number | null){
    return this.httpServ.post<any>("http://localhost:3001/add-user-for-chat", {"contactId": contactId, "currentUserId": this.authServ.currentUserId});
  }


  getCurrentOwnUserId(){
    return this.httpServ.get<any>("http://localhost:3001/get-current-own-user-id");
  }

}
