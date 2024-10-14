import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../../services/auth-service.service";
import {LoginModel} from "../../models/Login.model";
import {FormsModule} from "@angular/forms";
import {UserService} from "../../services/user-service.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private router : Router, private authServ: AuthService,
              private userServ: UserService) {

  }

  emptyLogin: LoginModel = {
    usernameOrEmail: "",
    password: ""
  };


  userLoggedIn: boolean = false;

  loginData : LoginModel = this.emptyLogin;

  errorMessage: string = "";

   submitLogin(){


    this.authServ.loginUser(this.loginData).subscribe({
      next: (res) => {
        console.log("Token der beim erfolgreichen Login entsteht: ", res);
        //this.authServ.userLoggedIn = true;

        //this.authServ.userLoggedIn.next(true);
        this.authServ.authToken = res["token"];
        this.authServ.currentUserId = res["currentUserId"];

        localStorage.setItem("token", res["token"]);


        console.log("Authtoken: ", this.authServ.authToken);
        console.log("Current User Id: ", this.authServ.currentUserId);

        this.authServ.currentUser = res["currentUser"];

        //this.authServ.currentUserOb.next(res["currentUser"]);


        this.authServ.userLoggedIn = true;
        this.router.navigate(["/"]);

      }, error: (err: HttpErrorResponse) => {
          console.log("Falsche Logindaten");
          this.errorMessage = "Die Logindaten sind nicht korrekt. Werfen Sie nochmal einen Blick darüber";
      }
    });
  }


}
