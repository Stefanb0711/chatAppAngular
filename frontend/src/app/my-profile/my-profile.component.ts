import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user-service.service";
import {AuthService} from "../services/auth-service.service";
import {HttpErrorResponse} from "@angular/common/http";
import {UserModel} from "../models/User.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit{

  constructor(private userServ: UserService,
              public authServ : AuthService,
              private router : Router)  {}


  ngOnInit() {

    /*this.userServ.getOwnContact().subscribe({
      next : (res: UserModel[]) => {

        this.authServ.currentUser = res;

      }, error: (err: HttpErrorResponse) => {

      }
    })*/

  }




}
