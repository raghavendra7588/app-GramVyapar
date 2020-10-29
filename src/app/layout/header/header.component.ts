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
  }

  ngOnInit(): void {
    this.sellerName = sessionStorage.getItem('sellerName');
    this.vendorCode = sessionStorage.getItem('vendorId');
  }

  goToCategories() {
    this.router.navigate(['/buyProducts/categories']);
  }

  goToCart() {
    this.router.navigate(['/buyProducts/goToCart']);
  }

  goToAddress() {
    // this.router.navigate(['/buyProducts/addressDetailsData']);
  }

  goToMyOrders() {
    this.isExisting = sessionStorage.getItem('isExisting');
    // if (this.isExisting === "false") {
    //   return;
    // }
    // if (this.isExisting === "true") {
    //   this.router.navigate(['/buyProducts/myOrder']);
    // }
    if ("isExisting" in sessionStorage) {
      this.router.navigate(['/buyProducts/myOrder']);
    } else {
      return; 
    }

  }

}
