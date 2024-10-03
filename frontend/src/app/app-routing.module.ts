import {Router, RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";
import {HomeComponent} from "./home/home.component";
import {MyProfileComponent} from "./my-profile/my-profile.component";

export const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "register", component: RegisterComponent},
  {path: "login", component: LoginComponent},
  {path: "my-profile", component: MyProfileComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})

export class AppRoutingModule {}
