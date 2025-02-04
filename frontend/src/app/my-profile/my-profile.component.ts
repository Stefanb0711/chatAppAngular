import {Component, OnInit, signal} from '@angular/core';
import {UserService} from "../services/user-service.service";
import {AuthService} from "../services/auth-service.service";
import {HttpErrorResponse} from "@angular/common/http";
import {UserModel} from "../models/User.model";
import {Router} from "@angular/router";
import {NgIf, NgOptimizedImage, NgStyle} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIf,
    FormsModule,
    NgStyle
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit{

  constructor(private userServ: UserService,
              public authServ : AuthService,
              private router : Router)  {}


  editModeUsername: boolean = false;
  editModeProfilePicture: boolean = false;
  editModeEmail: boolean = false;
  editModePassword: boolean = false;




  ngOnInit() {

    this.userServ.getOwnContact().subscribe({
      next : (res) => {

        this.authServ.currentUser = res[0];

        console.log("CurrentUser in MyProfile: ", res[0]["username"]);

      }, error: (err: HttpErrorResponse) => {

        alert("Sie müssen sich dafür erst einloggen");
        this.router.navigate(["login"]);
      }
    })

  }

  passwordVisible: boolean = false;


  showPassword(){
    this.passwordVisible = true;
  }

  setPasswordNotVisible(){
    this.passwordVisible = false;
  }





  setEditModeUsername(){
    this.editModeUsername = true;
  }
  setEditModeProfilePicture() {
    this.editModeProfilePicture = true;
  }
  setEditModeEmail() {
    this.editModeEmail = true;
  }

  setEditModePassword() {
    this.editModePassword = true;
  }

  cancelEditModeProfilePicture(){
    this.editModeProfilePicture = false
  }

  cancelEditModeUsername() {
    this.editModeUsername = false;
  }

  cancelEditModePassword(){
    this.editModePassword = false;
  }

  cancelEditModeEmail(){
    this.editModeEmail = false;
  }

  sendChanges(data : any){
    this.userServ.editUser(data).subscribe({
      next: (res: any) => {

        this.cancelEditModeProfilePicture();
        this.cancelEditModeUsername();
        this.cancelEditModePassword();
        this.cancelEditModeEmail();

        }, error : () => {

      }
    })
  }


}
