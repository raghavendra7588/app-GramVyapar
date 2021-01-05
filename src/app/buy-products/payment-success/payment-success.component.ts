import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmitterService } from 'src/app/shared/emitter.service';
import { BuyProductsService } from '../buy-products.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {

  placeOrderObj: any;
  placeOrderResponse: any = [];
  orderNo: number;


  constructor(
    private router: Router,
    private emitterService: EmitterService,
    public buyProductsService: BuyProductsService,
    public toastr: ToastrService
  ) {
    if ("isFirstTime" in sessionStorage) {
      let prevTotalOrder: number;
      this.placeOrderObj = JSON.parse(sessionStorage.getItem('placOrderObj'));
      this.buyProductsService.placeOrderData(this.placeOrderObj).subscribe(response => {
        this.placeOrderResponse = response;
        this.toastr.success('Your Order Is Placed');
        let slicedOrderNo = this.placeOrderResponse.orderid.slice(this.placeOrderResponse.orderid.length - 6);
        this.orderNo = slicedOrderNo;
        sessionStorage.removeItem('cart_items');
        sessionStorage.removeItem('category_array');
        sessionStorage.removeItem('placOrderObj');
        sessionStorage.removeItem('totalPayableAmount');
        this.emitterService.isProductIsAddedOrRemoved.emit(true);
        sessionStorage.setItem('isExisting', 'true');
        sessionStorage.removeItem('totalOrder');
        sessionStorage.removeItem("isOnlineSelected");
        prevTotalOrder = Number(sessionStorage.getItem('totalOrder'));
        prevTotalOrder = prevTotalOrder + 1;
        sessionStorage.setItem('totalOrder', prevTotalOrder.toString());
      });

    }
    else {

    }
  }

  ngOnInit(): void {
  }

  continueShopping() {
    let shopName = sessionStorage.getItem('vendorName').toString();
    this.emitterService.isOrderedPlaced.emit(true);
    this.router.navigate(['/buyProducts/categories'], { queryParams: { name: shopName } });
  }

}
