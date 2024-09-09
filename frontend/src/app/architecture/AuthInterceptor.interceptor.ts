import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from "../services/auth-service.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authServ: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Hier kannst du das Authentifizierungs-Token hinzufügen
    const authToken = this.authServ.authToken;  // Hol dir das Token aus einem AuthService o.ä.



    // Klone die Anfrage und füge das Token dem Header hinzu
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });

    // Weiterleitung der Anfrage mit dem modifizierten Request
    return next.handle(authReq);
  }
}
