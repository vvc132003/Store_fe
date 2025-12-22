import { Injectable, TemplateRef } from '@angular/core';
import { API_URLS } from '../config/api-urls';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private apiUrl = API_URLS.api + '/Projects';
    constructor(private http: HttpClient, private cookieService: CookieService) {
    }

    private parseJwt(token: string): any {
        const payload = token.split('.')[1];
        const decoded = atob(payload);
        const utf8 = decodeURIComponent(
            decoded
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(utf8);
    }


    // Phương thức GET
    getData(): Observable<any> {
        return this.http.get<any[]>(this.apiUrl);
    }
    getMonthlyOrderCount(): Observable<any> {
        // const token = this.cookieService.get('access_token');
        // const payload = this.parseJwt(token);
        return this.http.get<any[]>(`${this.apiUrl}/getMonthlyOrderCount`);
    }
    monthlyRevenue(): Observable<any> {
        return this.http.get<any[]>(`${this.apiUrl}/monthlyRevenue`);
    }

    // getMonthlyOrderStats(): Observable<any> {
    //     return this.http.get<any[]>(`${this.apiUrl}/getMonthlyOrderStats`);
    // }

    getMonthlyOrderStats(userId?: string) {
        const url = userId
            ? `${this.apiUrl}/getMonthlyOrderStats/${userId}`
            : `${this.apiUrl}/getMonthlyOrderStats`;
        return this.http.get(url);
    }




    /// buyer

    getMonthlyOrderCount_buyer(payload: any): Observable<any> {
        // const token = this.cookieService.get('access_token');
        // const payload = this.parseJwt(token);
        return this.http.get<any[]>(`${this.apiUrl}/getMonthlyOrderCount_buyer/${payload.nameid}`);
    }
    monthlyRevenue_buyer(payload: any): Observable<any> {
        // const token = this.cookieService.get('access_token');
        // const payload = this.parseJwt(token);
        return this.http.get<any[]>(`${this.apiUrl}/monthlyRevenue_buyer/${payload.nameid}`);
    }


    generateDrinkRevenueReport(): Observable<any> {
        return this.http.get<any[]>(`${this.apiUrl}/generateDrinkRevenueReport`);
    }




    // getProject_list(): Observable<any> {
    //     return this.http.get<any[]>(`${this.apiUrl}/project-list`);
    // }

    getProject_list(userId?: string): Observable<any> {
        const url = userId ? `${this.apiUrl}/project-list/${userId}` : `${this.apiUrl}/project-list`;

        return this.http.get<any[]>(url);
    }

    getProject_latest(): Observable<any> {
        return this.http.get<any[]>(`${this.apiUrl}/project-latest`);
    }

    getProjectBySlug(slug: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/project-by-slug/${slug}`);
    }

    getProjectsPaymenByUserId(userId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/project-paymen-by-userid/${userId}`);
    }

    getProjectsFavoriteByUserId(userId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/project-favorite-by-userid/${userId}`);
    }

    // getProjectByCategorySlug(slug: string, userId?: string): Observable<any> {
    //     return this.http.get<any>(`${this.apiUrl}/project-by-category-slug/${slug}`);
    // }

    getProjectByCategorySlug(slug: string, userId?: string): Observable<any> {
        const url = userId
            ? `${this.apiUrl}/project-by-category-slug/${slug}?userId=${userId}`
            : `${this.apiUrl}/project-by-category-slug/${slug}`;

        return this.http.get<any>(url);
    }


    // Phương thức POST
    postData(data: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, data);
    }

    changeStar_Project(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/changeStar-Project`, data);
    }


    uploadZip(file_zip: File, file_img: File, fileName_zip: string, fileName_thumnai: string, imageFiles: File[]): Observable<any> {
        const formData = new FormData();
        formData.append('zipFile', file_zip);
        formData.append('thumbnailUrl', file_img);
        formData.append('fileName_zip', fileName_zip);
        formData.append('fileName_thumnai', fileName_thumnai);
        if (imageFiles && imageFiles.length > 0) {
            imageFiles.forEach(file => {
                formData.append('images', file);
            });
        }

        return this.http.post<any>(`${this.apiUrl}/UploadZip`, formData);
    }

    // Phương thức PUT
    updateData(data: any): Observable<any> {
        return this.http.put<any>(this.apiUrl, data);
    }

    // Phương thức DELETE
    deleteData(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }

}
