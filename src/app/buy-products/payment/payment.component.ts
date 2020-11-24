import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  public payuform: any = {};
  disablePaymentButton: boolean = true;
  hashKeyRequest = {
    amount: "",
    firstname: "",
    email: "",
    phone: "",
    productinfo: "",
    surl: "https://www.payumoney.com/mobileapp/payumoney/success.php",
    furl: "https://www.payumoney.com/mobileapp/payumoney/failure.php",
    mode: "",
    udf1: "",
    txnid: "",
  };
  constructor(private http: HttpClient) {
    this.hashKeyRequest = {
      amount: this.payuform.amount,
      firstname: this.payuform.name,
      email: this.payuform.email,
      phone: this.payuform.phone,
      productinfo: this.payuform.productName,
      surl: "https://www.payumoney.com/mobileapp/payumoney/success.php",
      furl: "https://www.payumoney.com/mobileapp/payumoney/failure.php",
      mode: "Online",
      udf1: "GV000001",
      txnid: "131",
    }
  }



  confirmPayment() {
    const paymentPayload = {
      email: this.payuform.email,
      name: this.payuform.firstname,
      phone: this.payuform.phone,
      productInfo: this.payuform.productinfo,
      amount: this.payuform.amount
    }
    // return this.http.post<any>('http://localhost:8080/payment/payment-details', paymentPayload).subscribe(
    //   data => {
    //   console.log(data);
    //   this.payuform.txnid = data.txnId;
    //   this.payuform.surl = data.sUrl;
    //   this.payuform.furl = data.fUrl;
    //   this.payuform.key = data.key;
    //   this.payuform.hash = data.hash;
    //   this.payuform.txnid = data.txnId;
    //     this.disablePaymentButton = false;
    // }, error1 => {
    //     console.log(error1);
    //   })
    this.payuform.firstname = "Kirti"
    this.payuform.txnid = this.hashKeyRequest.txnid;
    this.payuform.surl = this.hashKeyRequest.surl;
    this.payuform.furl = this.hashKeyRequest.furl;
    this.payuform.key = "";
    this.payuform.hash = "";
    this.disablePaymentButton = false;

  }

  ngOnInit() {
  }


}