import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmitterService } from 'src/app/shared/emitter.service';
import { BuyProductsService } from '../buy-products.service';

@Component({
  selector: 'app-payment-failure',
  templateUrl: './payment-failure.component.html',
  styleUrls: ['./payment-failure.component.css']
})
export class PaymentFailureComponent implements OnInit {

  constructor(
    private router: Router,
    public buyProductsService: BuyProductsService,
    public toastr: ToastrService
  ) {

    this.toastr.error('Transaction Failed !!', '', {
      timeOut: 3000,
    });
  }

  ngOnInit(): void {
  }

  tryAgain() {
    this.router.navigate(['/buyProducts/goToCart']);
  }
}
