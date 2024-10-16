import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TokenResponseModel} from "../models/TokenResponse.model";
import {Registration} from "../models/Register.model";
import {LoginModel} from "../models/Login.model";
import {Subject} from "rxjs";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";
import {UserModel} from "../models/User.model";

@Injectable({providedIn: "root"})
export class AuthService {

  constructor(private httpServ : HttpClient) {

  }

  emptyUser: UserModel = {
    id : null,
    username : "",
    email : "",
    password : "",
    contacts_of_user : [],
    profile_picture : ""
  };


  authToken: string | null = null;

  currentUserId: number | null = null;


  currentUser: UserModel | any = this.emptyUser;

  userLoggedIn: boolean = false;

  //currentUserOb: Subject<UserModel> = new Subject<UserModel>();


  registerUser(registerData: Registration){
    return this.httpServ.post<TokenResponseModel>("http://localhost:3001/register", registerData);
  }

  loginUser(loginData: LoginModel){
    return this.httpServ.post<any>("http://localhost:3001/login", loginData);
  }

}
