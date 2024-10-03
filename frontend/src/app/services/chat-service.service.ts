import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth-service.service";
import {UserService} from "./user-service.service";
import {ChatMessageModel, ChatResponse} from "../models/ChatMessage.model";

@Injectable({providedIn: "root"})
export class ChatService {

  constructor(public httpServ: HttpClient, private authServ: AuthService, private userServ: UserService) {
  }


  currentChatMessages: ChatMessageModel[] = [];



  getMessages(){

  }

  sendMessage(message: string, time_of_message: string){
    return this.httpServ.post<any>("http://localhost:3001/add-chat-message", {"currentUserId": this.authServ.currentUserId, "currentChatPartnerId": this.userServ.currentChatPartnerId, message, time_of_message});
  }

  loadChatMessages(){
    return this.httpServ.post<ChatResponse>("http://localhost:3001/load-chat", {"currentUserId": this.authServ.currentUserId, "currentChatPartnerId": this.userServ.currentChatPartnerId});
  }

}
