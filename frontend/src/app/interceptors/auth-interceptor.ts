import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { StorageService } from '../services/storage';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private storage: StorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.storage.getToken();
    if (token) {
      req = req.clone({
        setHeaders: { 'x-access-token': token }
      });
    }
    return next.handle(req);
  }
}