import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user-service.service";
import {AuthService} from "../services/auth-service.service";
import {NavigationEnd, Router} from "@angular/router";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {Subscription} from "rxjs";
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



  constructor(private userServ: UserService,
              public authServ : AuthService,
              private router : Router)  {

  }

  private routerSubscription: Subscription = new Subscription();

  profilePicture: string = "";



  ngOnInit() {

    this.routerSubscription = this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd) {
        this.profilePicture = this.authServ.currentUser.profile_picture;
        console.log("CurrentUser von der my-profile-icon Komponente: ", this.authServ.currentUser);

      }
    });

  }


  showMyProfile() {
    console.log("Current User: ", this.authServ.currentUser);
    console.log("My Profile Picture: ", this.profilePicture);
    this.router.navigate(["/my-profile"]);
  }

}
