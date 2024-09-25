import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchFieldComponent } from "./search-field/search-field.component";
import {ContactListComponent} from "./contact-list/contact-list.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SearchFieldComponent, ContactListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'chatAnwendung';


  settingsForTextSize: string = "14px";
  settingsForTextColor: string = "black";


}
