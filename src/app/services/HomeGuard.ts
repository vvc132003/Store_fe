import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class HomeGuard implements CanActivate {

    constructor(private cookieService: CookieService, private router: Router) { }

    private parseJwt(token: string): any {
        const payload = token.split('.')[1];
        const decoded = atob(payload);
        return JSON.parse(decoded);
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {

        const token = this.cookieService.get('access_token');
        if (!token) {
            this.router.navigate(['/dang-nhap']); // chưa login
            return false;
        }

        try {
            const payload = this.parseJwt(token);
            if (payload.role === 'buyer') {
                return true; // là admin → cho phép truy cập
            } else {
                this.router.navigate(['/']); // không phải admin → chuyển home
                return false;
            }
        } catch (error) {
            this.router.navigate(['/dang-nhap']); // token lỗi → chuyển login
            return false;
        }
    }
}
