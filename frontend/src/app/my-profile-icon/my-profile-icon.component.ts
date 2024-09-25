import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user-service.service";
import {AuthService} from "../services/auth-service.service";
import {Router} from "@angular/router";
import {NgIf, NgOptimizedImage} from "@angular/common";

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

  profilePicture: string = "";



  ngOnInit() {
    
    console.log("CurrentUser von der my-profile-icon Komponente: ", this.authServ.currentUser);
    this.profilePicture = this.authServ.currentUser.profile_picture;
  }


  showMyProfile() {
    console.log("Current User: ", this.authServ.currentUser);
    console.log("My Profile Picture: ", this.profilePicture);
    this.router.navigate(["/my-profile"]);
  }

}
