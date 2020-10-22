import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  public LOGIN_URL = 'http://203.112.144.38/AdminApi/api//user/authenticate';
  public LOGGED_IN_URL = 'http://203.112.144.38/uat_AdminApi/api/User/authenticate';

  public seller_token: string;
  public seller_mapped_categories: any = [];
  public seller_object: any = [];
  public seller_id: number;
  public seller_name: any;
  constructor(public http: HttpClient) { }

  loginUser(user: User) {
    return this.http.post<any>(this.LOGGED_IN_URL, user);
  }

}
