import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user-service.service";
import {AuthService} from "../services/auth-service.service";
import {NavigationEnd, Router} from "@angular/router";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {Subscription} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {UserModel} from "../models/User.model";
//import * as events from "node:events";

@Component({
  selector: 'app-my-profile-icon',
  standalone: true,
  imports: [
    NgIf,
    NgOptimizedImage
  ],
  templateUrl: './my-profile-icon.component.html',
  styleUrl: './my-profile-icon.component.css'
})
export class MyProfileIconComponent implements OnInit {

  currentUserForMyProfileIcon : UserModel;


  constructor(private userServ: UserService,
              public authServ : AuthService,
              private router : Router,
              private httpServ: HttpClient) {
      this.currentUserForMyProfileIcon = this.authServ.emptyUser;
  }

  private routerSubscription: Subscription = new Subscription();



  loadUserData(){



    this.userServ.getOwnContact().subscribe({
      next : (res: any) => {
        this.authServ.currentUser = res[0];
        console.log("CurrentUser in MyProfileIcon: ", this.authServ.currentUser);

      }, error : (err: HttpErrorResponse) => {

      }
      });
  }

  ngOnInit() {

    if (this.authServ.currentUser){
      this.loadUserData();
    }

  }

  checkCurrentUser(){
    console.log("CurrentUser in MyProfileIcon: ", this.authServ.currentUser);
  }


  showMyProfile() {
    this.router.navigate(["/my-profile"]);
  }

}
