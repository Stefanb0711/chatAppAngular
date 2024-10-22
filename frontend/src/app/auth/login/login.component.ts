import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../../services/auth-service.service";
import {LoginModel} from "../../models/Login.model";
import {FormsModule} from "@angular/forms";
import {UserService} from "../../services/user-service.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  constructor(private router : Router, public authServ: AuthService,
              private userServ: UserService) {

  }

  emptyLogin: LoginModel = {
    usernameOrEmail: "",
    password: ""
  };


  userLoggedIn: boolean = false;

  loginData : LoginModel = this.emptyLogin;

  errorMessage: string = "";

  ngOnInit() {
    console.log("UserLogged in in Loginkomponent: ", this.authServ.userLoggedIn);
  }

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

        this.authServ.currentUser = res["currentUser"][0];

        /*
        this.userServ.getOwnContact().subscribe({
          next : (res: any) => {
            this.authServ.currentUser = res[0];
            console.log("CurrentUser in MyProfileIcon: ", this.authServ.currentUser);

          }, error : (err: HttpErrorResponse) => {

          }
        });*/


        //this.authServ.currentUserOb.next(res["currentUser"]);
        //console.log("CurrentUser nach Login: ", this.authServ.currentUser);

        this.authServ.userLoggedIn = true;
        this.router.navigate(["/"]);

      }, error: (err: HttpErrorResponse) => {
          console.log("Falsche Logindaten");
          this.errorMessage = "Die Logindaten sind nicht korrekt. Werfen Sie nochmal einen Blick darüber";
      }
    });
  }


}
