import {Component, Input} from '@angular/core';
import {NgClass, NgIf, NgOptimizedImage, NgStyle} from "@angular/common";
import {InterfaceService} from "../services/interface-service.service";
import {UserService} from "../services/user-service.service";
import {ChatMessageModel} from "../models/ChatMessage.model";
import {ApiResponseModel} from "../models/ApiResponse.model";

@Component({
  selector: 'app-single-contact-with-less-information',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgStyle,
    NgClass,
    NgIf
  ],
  templateUrl: './single-contact-with-less-information.component.html',
  styleUrl: './single-contact-with-less-information.component.css'
})
export class SingleContactWithLessInformationComponent {

    @Input() picture: string = '';  // Das ist die Input Property, die von außen gebunden werden kann
    @Input() username: string = "";
    @Input() contactId: number | null = null;

    constructor(private intServ: InterfaceService, private userServ: UserService) {
    }


    isHovered: boolean = false;

    onAddContact(){
      this.intServ.isAddChatPanelOpened = false;
      this.userServ.addUserForChat(this.contactId).subscribe({
        next : (res: ApiResponseModel) => {
          console.log(res["message"]);
        } , error : (err: ApiResponseModel) => {
          console.log(err["message"]);
        }
        });


    }

}
