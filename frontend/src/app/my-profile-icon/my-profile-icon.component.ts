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
        this.currentUserForMyProfileIcon = res[0];
        console.log("CurrentUser in MyProfileIcon: ", this.authServ.currentUser);

      }, error : (err: HttpErrorResponse) => {

      }
      });
  }

  ngOnInit() {

    /*
    if (this.currentUserForMyProfileIcon === this.authServ.emptyUser || null){
      setInterval(() => {
      this.loadUserData();
    }, 1000);
    }*/


    /*
    const currUserSubscription = this.authServ.currentUserOb.subscribe(value => {
      const currentUser = value;
    })

    this.routerSubscription = this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd) {
        this.profilePicture = this.authServ.currentUser.profile_picture;
        //console.log("CurrentUser von der my-profile-icon Komponente: ", this.authServ.currentUser);

      }
    });*/

  }

  checkCurrentUser(){
    console.log("CurrentUser in MyProfileIcon: ", this.authServ.currentUser);
  }


  showMyProfile() {
    this.router.navigate(["/my-profile"]);
  }

}
