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
  shopName: string;
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

      this.shopName = data.name;
      let str;
      str = this.shopName.replace(/ +/g, "");
      this.shopName = str;
      sessionStorage.setItem('sellerName', data.name);
      sessionStorage.setItem('sellerId', data.id.toString());
      sessionStorage.setItem('vendorId', data.vendorcode.toString());
      sessionStorage.setItem('isExisting', 'true');
      this.router.navigate(['/buyProducts/categories'], { queryParams: { name: this.shopName } });

    });
  }
}
