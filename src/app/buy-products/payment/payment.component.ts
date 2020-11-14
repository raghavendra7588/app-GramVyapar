import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  public payuform: any = {};
  disablePaymentButton: boolean = true;
  response: any;
  responseArr: any = [];
  totalMRP: any = 0;
  totalDiscount: any = 0;
  totalPayableAmount: number = 0;
  totalItemsOrdered: number = 0;

  constructor(
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.response = data;
    console.log('this is response', this.response);
    this.responseArr.push(this.response);
    console.log('Response Array', this.responseArr);
    this.payableCalculation(this.responseArr);
  }

  confirmPayment() {
    const paymentPayload = {
      email: this.payuform.email,
      name: this.payuform.firstname,
      phone: this.payuform.phone,
      productInfo: this.payuform.productinfo,
      amount: this.payuform.amount
    }
    return this.http.post<any>('http://localhost:8080/payment/payment-details', paymentPayload).subscribe(
      data => {
        console.log(data);
        this.payuform.txnid = data.txnId;
        this.payuform.surl = data.sUrl;
        this.payuform.furl = data.fUrl;
        this.payuform.key = data.key;
        this.payuform.hash = data.hash;
        this.payuform.txnid = data.txnId;
        this.disablePaymentButton = false;
      }, error1 => {
        console.log(error1);
      })
  }

  ngOnInit() {
  }

  payableCalculation(arr) {
    console.log('Array',arr);
    this.totalMRP = 0;
    this.totalDiscount = 0;
    this.totalItemsOrdered = 0;
    this.totalPayableAmount = 0;

    for (let i = 0; i < arr.length; i++) {
      console.log('isnide for calculation');
      this.totalMRP += (parseFloat(arr[i].MRP) * parseFloat(arr[i].RequiredQuantity));
      this.totalDiscount += (parseFloat(arr[i].Discount) * parseFloat(arr[i].RequiredQuantity));
      this.totalItemsOrdered += Number(arr[i].RequiredQuantity);
      // this.totalFinalPrice += arr[i].FinalPrice;
    }
    this.totalPayableAmount = this.totalMRP - this.totalDiscount;
  }

}
