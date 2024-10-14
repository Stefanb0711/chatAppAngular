import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth-service.service";
import {
  SingleContactWithLessInformationComponent
} from "../single-contact-with-less-information/single-contact-with-less-information.component";
import {UserService} from "../services/user-service.service";
import {MyProfileIconComponent} from "../my-profile-icon/my-profile-icon.component";

@Component({
  selector: 'app-search-field',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    NgOptimizedImage,
    SingleContactWithLessInformationComponent,
    MyProfileIconComponent,
  ],
  templateUrl: './search-field.component.html',
  styleUrl: './search-field.component.css'
})

export class SearchFieldComponent implements OnInit {

  logAndRegButtonsVisible: boolean = true;

  constructor(public authServ: AuthService,
              private userServ: UserService,
              private router: Router) {};

  ngOnInit() {
    /*
    this.authServ.userLoggedIn.subscribe(value => {
        this.logAndRegButtonsVisible = value;
    });*/

    console.log("Navigationbar wurde erstellt");

    this.userServ.getCurrentOwnUserId().subscribe({
      next : (res) =>{

      }, error: (err) => {
        console.log("GetCurrentOwnUserID zugriff fehlgeschlagen");
    }
    });

  }



  getLoginPage(){
    this.router.navigate(["login"]);
  }

  getRegisterPage(){
    this.router.navigate(["register"]);
  }


  logUserOut() {
    this.authServ.userLoggedIn = false;
    //this.authServ.userLoggedIn.next(!this.logAndRegButtonsVisible);
  }

}
