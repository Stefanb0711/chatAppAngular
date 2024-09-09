import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {TokenResponseModel} from "../models/TokenResponse.model";
import {UserModel} from "../models/User.model";

@Injectable({providedIn: "root"})
export class UserService {

  constructor(public httpServ: HttpClient) {
  }

  getAllUsers(){
    return this.httpServ.get<any[]>("http://localhost:3001/get-all-users");
  }

  getSpecificUsers(inputValue: string){
    return this.httpServ.post<UserModel[]>("http://localhost:3001/get-users-matching-search", {inputValue});
  }

}
