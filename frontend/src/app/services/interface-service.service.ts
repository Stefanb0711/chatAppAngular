import {Subject} from "rxjs";
import {Injectable} from "@angular/core";


@Injectable({providedIn: "root"})
export class InterfaceService {

  //isAddChatPanelOpened: Subject<boolean> = new Subject<boolean>();

  isAddChatPanelOpened: boolean = false;

}
