import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from './AuthService';

@Injectable({
    providedIn: 'root'
})
export class HomeGuard implements CanActivate {

    constructor(private cookieService: CookieService, private authService: AuthService, private router: Router) { }


    canActivate(): Observable<boolean> {
        return this.authService.me().pipe(
            map(user => {
                if (user.role === 'buyer' || user.role === 'admin') {
                    return true;
                }
                this.router.navigate(['/']);
                return false;
            }),
            catchError(() => {
                this.router.navigate(['/dang-nhap']);
                return of(false);
            })
        );
    }
    
}
