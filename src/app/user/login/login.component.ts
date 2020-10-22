import { Component, OnInit } from '@angular/core';
import { EmitterService } from 'src/app/shared/emitter.service';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User = new User();
  constructor(
    public router: Router,
    public loginService: UserService,
    public emitterService: EmitterService,
  ) { }

  ngOnInit(): void {
    this.user.username = '9821163016';
    this.user.password = '100100';
  }
  login() {
    this.loginService.loginUser(this.user).subscribe(data => {
      console.log('logged in data', data);
      this.loginService.seller_object = data;
      this.loginService.seller_token = data.token;
      this.loginService.seller_mapped_categories = data.categories;
      this.loginService.seller_id = data.id;
      this.loginService.seller_name = data.name;
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('sellerName', data.name);
      sessionStorage.setItem('sellerId', data.id.toString());
      sessionStorage.setItem('categories', JSON.stringify(data.categories));
      sessionStorage.setItem('vendorId', data.vendorcode.toString());

      this.router.navigate(['/buyProducts/categories']);
    });
  }
}
