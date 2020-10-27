import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isExisting: string;
  constructor(
    public router: Router,
  ) {
    sessionStorage.setItem('isExisting', "false");
    this.isExisting = sessionStorage.getItem('isExisting');
    console.log('isExisting', this.isExisting);
  }

  ngOnInit(): void {
  }
  goToCategories() {
    this.router.navigate(['/buyProducts/categories']);
  }

  goToCart() {
    this.router.navigate(['/buyProducts/goToCart']);
  }

  goToAddress() {
    this.router.navigate(['/buyProducts/addressDetailsData']);
  }

  goToMyOrders() {
    this.isExisting = sessionStorage.getItem('isExisting');
    if (this.isExisting === "false") {
      return;
    }
    else {
      this.router.navigate(['/buyProducts/myOrder']);
    }

  }

}
