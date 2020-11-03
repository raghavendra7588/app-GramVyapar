import { Component, OnInit } from '@angular/core';
import { EmailValidator } from '@angular/forms';
import { Router } from '@angular/router';
import { EmitterService } from 'src/app/shared/emitter.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isExisting: string;
  sellerName: string;
  vendorCode: string;
  productCount: number = 0;
  cart_items: any = [];
  constructor(
    public router: Router,
    public emitterService: EmitterService
  ) {
    // sessionStorage.setItem('isExisting', "false");
    // this.isExisting = sessionStorage.getItem('isExisting');
    // console.log('isExisting', this.isExisting);
    // this.sellerName = sessionStorage.getItem('sellerName');
    // this.vendorCode = sessionStorage.getItem('vendorId');

    this.emitterService.isValidateResponse.subscribe(response => {
      if (response) {
        this.sellerName = sessionStorage.getItem('sellerName');
        this.vendorCode = sessionStorage.getItem('vendorId');
      }
    });
    this.emitterService.isProductIsAddedOrRemoved.subscribe(response => {
      if (response) {
        // this.cart_items = JSON.parse(sessionStorage.getItem('cart_items'));
        // this.productCount = this.calculateProductCount(this.cart_items);
        // console.log('product count', this.productCount);
        if ("cart_items" in sessionStorage) {
          this.cart_items = JSON.parse(sessionStorage.getItem('cart_items'));
          this.productCount = this.calculateProductCount(this.cart_items);
          console.log('product count', this.productCount);
        } else {
          this.productCount = 0;
        }
      }
    });

    // if (this.cart_items.length === 0 || this.cart_items === undefined || this.cart_items === null || this.cart_items === []) {
    //   this.productCount = 0;
    // }
    // else{
    //   this.cart_items = JSON.parse(sessionStorage.getItem('cart_items'));
    //   this.productCount = this.calculateProductCount(this.cart_items);
    //   console.log('product count', this.productCount);
    // }

    if ("cart_items" in sessionStorage) {
      this.cart_items = JSON.parse(sessionStorage.getItem('cart_items'));
      this.productCount = this.calculateProductCount(this.cart_items);
      console.log('product count', this.productCount);
    } else {
      this.productCount = 0;
    }


  }

  ngOnInit(): void {
    this.sellerName = sessionStorage.getItem('sellerName');
    this.vendorCode = sessionStorage.getItem('vendorId');
  }

  goToCategories() {
    let shopName = sessionStorage.getItem('vendorName').toString();
    console.log('vendor name', shopName);
    this.router.navigate(['/buyProducts/categories'], { queryParams: { name: shopName } });
  }

  goToCart() {
    this.router.navigate(['/buyProducts/goToCart']);
  }

  goToAddress() {
    // this.router.navigate(['/buyProducts/addressDetailsData']);
  }

  goToMyOrders() {
    this.isExisting = sessionStorage.getItem('isExisting');
    if ("isExisting" in sessionStorage) {
      this.router.navigate(['/buyProducts/myOrder']);
    } else {
      this.router.navigate(['/buyProducts/myOrder']);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  calculateProductCount(arr) {
    let totalProductCount;
    let sum = 0;
    arr.filter(item => {
      sum += Number(item.RequiredQuantity);
    });
    return sum;
  }
}
