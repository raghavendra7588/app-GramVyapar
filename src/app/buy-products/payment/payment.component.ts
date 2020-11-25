import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BuyProductsService } from '../buy-products.service';
import { GenerateHashKey, PaymentForm, PaymentFormUpdated, PaymentModel } from '../buy-products.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  // public payuform: any = {};
  disablePaymentButton: boolean = true;
  // hashKeyResponse: any;

  response: any;
  responseArr: any = [];
  totalMRP: any = 0;
  totalDiscount: any = 0;
  totalPayableAmount: number = 0;
  totalItemsOrdered: number = 0;
  generateHashKey: GenerateHashKey = new GenerateHashKey();
  // payuform: PaymentForm = new PaymentForm();
  payuform: PaymentFormUpdated = new PaymentFormUpdated();
  paymentForm: FormGroup;
  hashKeyResponse: any = [];
  vendorCode: string;

  paymentModel: PaymentModel = new PaymentModel();

  responseHashKey: string;
  responseTxnId: string;

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
  constructor(
    private http: HttpClient,
    public buyProductService: BuyProductsService
  ) {

  }



  confirmPayment() {
    // const paymentPayload = {
    //   email: this.payuform.email,
    //   name: this.payuform.firstname,
    //   phone: this.payuform.phone,
    //   productInfo: this.payuform.productinfo,
    //   amount: this.payuform.amount
    // }
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
    // this.payuform.firstname = "Kirti"
    // this.payuform.txnid = this.hashKeyRequest.txnid;
    // this.payuform.surl = this.hashKeyRequest.surl;
    // this.payuform.furl = this.hashKeyRequest.furl;
    // this.payuform.key = "";
    // this.payuform.hash = "";
    // this.disablePaymentButton = false;
    this.hashKeyRequest = {
      amount: this.payuform.amount,
      firstname: this.payuform.firstname,
      email: this.payuform.email,
      phone: this.payuform.phone,
      productinfo: this.payuform.productinfo,
      surl: "https://www.payumoney.com/mobileapp/payumoney/success.php",
      furl: "https://www.payumoney.com/mobileapp/payumoney/failure.php",
      mode: "Online",
      udf1: "GV000001",
      txnid: "131",
    }

    this.buyProductService.getHashKey(this.hashKeyRequest).subscribe(response => {

      this.hashKeyResponse = response;
      // this.hashKeyResponse = this.hashKeyResponse.hashKey;
      this.responseHashKey = this.hashKeyResponse.hashKey;
      this.responseTxnId = this.hashKeyResponse.id;

      // this.paymentModel.firstname = this.paymentForm.value.firstname;
      // this.paymentModel.lastname = this.paymentForm.value.lastname;
      // this.paymentModel.email = this.paymentForm.value.email;
      // this.paymentModel.phone = this.paymentForm.value.phone;
      // this.paymentModel.amount = this.paymentForm.value.amount;
      // this.paymentModel.productinfo = this.paymentForm.value.productinfo;


      // this.paymentModel.firstname = this.payuform.name;

      // this.paymentModel.email = this.payuform.email;
      // this.paymentModel.phone = this.payuform.phone.toString();
      // this.paymentModel.amount = this.payuform.amount;
      // this.paymentModel.productinfo = this.payuform.productName;
      // this.paymentModel.hash = this.hashKeyResponse;
      // this.disablePaymentButton = false;
      // this.paymentModel.txnid = val;
      // // this.paymentModel.service_provider = 'payu_paisa';
      // console.log('Payment Model : ' + JSON.stringify(this.paymentModel));
 

      this.payuform.amount = this.payuform.amount;
      this.payuform.phone = this.payuform.phone;
      this.payuform.hash = this.responseHashKey;
      this.payuform.Txnid = this.responseTxnId;
      this.payuform.Surl = "https://www.payumoney.com/mobileapp/payumoney/success.php";
      this.payuform.Furl = "https://www.payumoney.com/mobileapp/payumoney/failure.php";
      this.payuform.service_provider = 'payu_paisa';
      this.payuform.Key = "5tJYJdBY";
      this.payuform.udf1 = 'GV000001';
      console.log(' this.payuform', this.payuform);
      
      const formData = new FormData();
      formData.append('amount', this.payuform.amount);
      formData.append('productinfo', this.payuform.productinfo);
      formData.append('firstname', this.payuform.firstname);
      formData.append('email', this.payuform.email);
      formData.append('phone', this.payuform.phone);
      formData.append('Surl', this.payuform.Surl);
      formData.append('Furl', this.payuform.Furl);
      formData.append('Key', this.payuform.Key);
      formData.append('hash', this.payuform.hash);
      formData.append('Txnid', this.payuform.Txnid);
      formData.append('service_provider', this.payuform.service_provider);
      formData.append('udf1', this.payuform.udf1);

      this.disablePaymentButton = false;
      this.buyProductService.createPayment(formData).subscribe(
        res => {
          console.log('payment gateway response',res);
          // this.onSuccessPayment(res);
        },
        err => {
          console.log('error occured  ', err);
          // this.onFailurePayment(err);
        }
      );
      // this.buyProductService.paymentGateWay(paymentGateWayRequest).subscribe(response => {
      //   console.log('payment gateway response', response);
      // });
    });

  }

  ngOnInit() {
  }


}