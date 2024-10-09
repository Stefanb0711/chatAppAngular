import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth-service.service";
import {UserService} from "./user-service.service";
import {ChatMessageModel, ChatResponse} from "../models/ChatMessage.model";
import {io, Socket} from "socket.io-client";
import {Observable} from "rxjs";


@Injectable({providedIn: "root"})
export class ChatService {
  socket: any;


  constructor(public httpServ: HttpClient, private authServ: AuthService, private userServ: UserService) {
    this.socket = io("http://localhost:3001");
  }

  //isUserChatPartner: boolean = false;



  currentChatMessages: ChatMessageModel[] = [];

  /*
  if(this.authServ.currentUserId === this.currentChatMessages["current_user_id"] ){

  }*/

  sendMessage(message: string, time_of_message: string){
    this.socket.emit("chatMessage", {"currentUserId": this.authServ.currentUserId, "currentChatPartnerId": this.userServ.currentChatPartnerId, message, time_of_message});

  }

  getMessages(){
    return new Observable((observer) => {
      if (this.socket.hasListeners('chatMessage')) {
        this.socket.off('chatMessage'); // Entfernt alte Listener
      }
      this.socket.on('chatMessage', (msg : any) => {
      //console.log("Message in getMessageSocket: ", msg);
      //this.currentChatMessages.push(msg);

      console.log("CurrentChatMessages, nachdem neue Message zum Array hinzugefügt wurde: ", this.currentChatMessages);

      observer.next(msg);
      });
    });
  }

/*
  sendMessage(message: string, time_of_message: string){
    return this.httpServ.post<any>("http://localhost:3001/add-chat-message", {"currentUserId": this.authServ.currentUserId, "currentChatPartnerId": this.userServ.currentChatPartnerId, message, time_of_message});
  }
    }*/

  loadChatMessages() {
    return this.httpServ.post<ChatResponse>("http://localhost:3001/load-chat", {
      "currentUserId": this.authServ.currentUserId,
      "currentChatPartnerId": this.userServ.currentChatPartnerId
    });
  }

}
