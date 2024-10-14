import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth-service.service";
import {Registration} from "../../models/Register.model";
import {repeatWhen} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgClass, NgIf, NgStyle} from "@angular/common";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgStyle,
    NgClass,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private router : Router, private authServ: AuthService) {
  }

  emptyRegistration: Registration = {
    id : 0,
    username : "",
    email : "",
    password : "",
    passwordConfirm : ""
  };

  registrationData : Registration = this.emptyRegistration;

  errorMessage: string = "";
  successMessage: string = "";

  passwordStrength: string | null = null;

  checkPasswordLength(password: string){
    if (/*this.registrationData.password.length > 0 && */password.length < 8){
      this.passwordStrength = "weak";
      console.log("Passwort ist schwach");
    } else if (password.length > 8 && password.length < 12) {
      this.passwordStrength = "middle";
      console.log("Passwort ist medium");
    } else if (password.length > 12){
      this.passwordStrength = "strong";
      console.log("Passwort ist stark");
    }

  }


  getPasswordStrengthClass(){
    return {
      'weak-password': this.passwordStrength === "weak",
      'medium-password': this.passwordStrength === "middle",
      'strong-password': this.passwordStrength === "strong"
    };
  }

  submitRegistration(){

    this.authServ.registerUser(this.registrationData).subscribe({
      next: (res : any) => {

        this.router.navigate(["/"]);
      }, error: (err: any) => {

        console.log("Registrierung fehlgeschlagen");
        this.errorMessage = err.error.message;
      }
    });
  }



}
