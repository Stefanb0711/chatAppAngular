import {Injectable, SkipSelf} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from "../services/auth-service.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authServ: AuthService) {

  }

  authToken:string = "";



  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Hier kannst du das Authentifizierungs-Token hinzufügen
    //this.authToken = this.authServ.authToken;  // Hol dir das Token aus einem AuthService o.ä.

    console.log("Geht durch Interceptor durch");

    // Klone die Anfrage und füge das Token dem Header hinzu
    /*
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${this.authToken}`)
    });

    console.log("Req.headers im Interceptor: ", req["headers"]);
    */

    // Weiterleitung der Anfrage mit dem modifizierten Request
    return next.handle(req);
  }
}
