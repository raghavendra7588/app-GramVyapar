import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { GenerateHashKey, PaymentForm, PaymentModel } from '../buy-products.model';
import { FormBuilder, FormGroup, Validators, FormControl, NumberValueAccessor } from '@angular/forms';
import { BuyProductsService } from '../buy-products.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  // public payuform: any = {};

  disablePaymentButton: boolean = true;
  response: any;
  responseArr: any = [];
  totalMRP: any = 0;
  totalDiscount: any = 0;
  totalPayableAmount: number = 0;
  totalItemsOrdered: number = 0;
  generateHashKey: GenerateHashKey = new GenerateHashKey();
  payuform: PaymentForm = new PaymentForm();
  paymentForm: FormGroup;
  hashKeyResponse: any = [];
  vendorCode: string;

  paymentModel: PaymentModel = new PaymentModel();



  constructor(
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public buyProductService: BuyProductsService) {
    this.response = data;
    console.log('this is response', this.response);
    this.responseArr = this.response.cartDetails;
    this.vendorCode = sessionStorage.getItem("vendorId");
    console.log(this.vendorCode);
    this.payableCalculation(this.responseArr);

    this.paymentForm = this.formBuilder.group({
      productname: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      Surl: [''],
      Furl: [''],
      Key: [''],
      Hash: [''],
      Txnid: [''],
      Serviceprovider: ['']
    });

    this.payuform.productName="testProductName";
    this.payuform.name="raghavendra";
    this.payuform.email="raghavendradeshmukh12@gmail.com";
    this.payuform.phone="7588641864";
    this.payuform.amount="10";

  }

  confirmPayment() {
    // const paymentPayload = {
    //   email: this.payuform.email,
    //   name: this.payuform.firstname,
    //   phone: this.payuform.phone,
    //   productInfo: this.payuform.productinfo,
    //   amount: this.payuform.amount
    // }
    let val = Math.floor(1000 + Math.random() * 9000);
    console.log(val);

    console.log(this.payuform);

    let hashKeyRequest = {
      amount: this.payuform.amount,
      firstname: this.payuform.name,
      email: this.payuform.email,
      phone: this.payuform.phone,
      productinfo: this.payuform.productName,
      surl: "https://www.payumoney.com/mobileapp/payumoney/success.php",
      furl: "https://www.payumoney.com/mobileapp/payumoney/failure.php",
      mode: "Online",
      udf1: this.vendorCode.toString(),
      txnid: val.toString(),
    }

    console.log(hashKeyRequest);

    // let paymentGateWayRequest = {
    //   amount: this.payuform.amount,
    //   firstname: this.payuform.name,
    //   email: this.payuform.email,
    //   phone: this.payuform.phone,
    //   productinfo: this.payuform.productName,
    //   surl: "https://www.payumoney.com/mobileapp/payumoney/success.php",
    //   furl: "https://www.payumoney.com/mobileapp/payumoney/failure.php",
    //   mode: "Online",
    //   udf1: this.vendorCode.toString(),
    //   txnid: val.toString(),
    //   udf2: "",
    //   udf3: "",
    //   udf4: "",
    //   udf5: ""
    // };


    // let paymentGateWayRequest = {
    //   amount: this.payuform.amount,
    //   firstname: this.payuform.name,
    //   email: this.payuform.email,
    //   phone: this.payuform.phone,
    //   productinfo: this.payuform.productName,
    //   surl: "https://www.payumoney.com/mobileapp/payumoney/success.php",
    //   furl: "https://www.payumoney.com/mobileapp/payumoney/failure.php",
    //   mode: "Online",
    //   udf1: this.vendorCode.toString(),
    //   txnid: val.toString(),
    //   udf2: "",
    //   udf3: "",
    //   udf4: "",
    //   udf5: ""
    // };



    this.buyProductService.getHashKey(hashKeyRequest).subscribe(response => {
      console.log('got hash key ', response);
      this.hashKeyResponse = response;
      this.hashKeyResponse =   this.hashKeyResponse.hashKey;
      this.paymentModel.firstname = this.paymentForm.value.firstname;
      this.paymentModel.lastname = this.paymentForm.value.lastname;
      this.paymentModel.email = this.paymentForm.value.email;
      this.paymentModel.phone = this.paymentForm.value.phone;
      this.paymentModel.amount = this.paymentForm.value.amount;
      this.paymentModel.productinfo = this.paymentForm.value.productinfo;
      this.paymentModel.hash = this.hashKeyResponse;
      this.paymentModel.txnid = val;
      this.paymentModel.service_provider='payu_paisa';
      console.log('Payment Model : ' + JSON.stringify(this.paymentModel));
      this.buyProductService.createPayment(this.paymentModel).subscribe(
        res => {
          this.onSuccessPayment(res);
        },
        err => {
          this.onFailurePayment(err);
        }
      );
      // this.buyProductService.paymentGateWay(paymentGateWayRequest).subscribe(response => {
      //   console.log('payment gateway response', response);
      // });
    });

    // return this.http.post<any>('http://localhost:8080/payment/payment-details', paymentPayload).subscribe(
    //   data => {
    //     console.log(data);
    //     this.payuform.txnid = data.txnId;
    //     this.payuform.surl = data.sUrl;
    //     this.payuform.furl = data.fUrl;
    //     this.payuform.key = data.key;
    //     this.payuform.hash = data.hash;
    //     this.payuform.txnid = data.txnId;
    //     this.disablePaymentButton = false;
    //   }, error1 => {
    //     console.log(error1);
    //   })



    // this.paymentModel.firstname = this.paymentForm.value.firstname;
    // this.paymentModel.lastname = this.paymentForm.value.lastname;
    // this.paymentModel.email = this.paymentForm.value.email;
    // this.paymentModel.phone = this.paymentForm.value.phone;
    // this.paymentModel.amount = this.paymentForm.value.amount;
    // this.paymentModel.productinfo = this.paymentForm.value.productinfo;

    // console.log('Payment Model : ' + JSON.stringify(this.paymentModel));
    // this.paymentService.createPayment(this.paymentModel).subscribe(
    //   res => {
    //     this.onSuccessPayment(res);
    //   },
    //   err => {
    //     this.onFailurePayment(err);
    //   }
    // );

  }

  ngOnInit() {
  }

  payableCalculation(arr) {

    this.totalMRP = 0;
    this.totalDiscount = 0;
    this.totalItemsOrdered = 0;
    this.totalPayableAmount = 0;

    for (let i = 0; i < arr.length; i++) {

      this.totalMRP += (parseFloat(arr[i].mrp) * parseFloat(arr[i].quantity));
      this.totalDiscount += (parseFloat(arr[i].discount) * parseFloat(arr[i].quantity));
      this.totalItemsOrdered += Number(arr[i].quantity);
      // this.totalFinalPrice += arr[i].FinalPrice;
    }
    this.totalPayableAmount = this.totalMRP - this.totalDiscount;
  }

  onSuccessPayment(response) {
    console.log('Success Payment : ' + response);
    if (response.url) {
      // Render PayUmoney payment gateway page
      window.location.href = response.url;
    }
  }

  onFailurePayment(error) {
    console.log('Failure Payment : ' + error);
  }

}
