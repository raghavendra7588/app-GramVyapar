import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BuyProductsService } from '../buy-products.service';
import { GenerateHashKey, PaymentForm, PaymentFormUpdated, PaymentGateWay, PaymentModel } from '../buy-products.model';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  disablePaymentButton: boolean = true;
  paymentGateWayForm: FormGroup;
  name = 'test';
  response: any;
  responseArr: any = [];
  totalMRP: any = 0;
  totalDiscount: any = 0;
  totalPayableAmount: number = 0;
  totalItemsOrdered: number = 0;
  generateHashKey: GenerateHashKey = new GenerateHashKey();
  // payuform: PaymentFormUpdated = new PaymentFormUpdated();
  payuform: PaymentGateWay = new PaymentGateWay();

  paymentForm: FormGroup;
  hashKeyResponse: any = [];
  vendorCode: string;

  paymentModel: PaymentModel = new PaymentModel();
  maxLengthPhone = 10;
  responseHashKey: string;
  responseTxnId: string;
  txnid: number;
  hashKeyRes: any = [];

  payuUrl: string = 'https://3intellects.co.in/uat_AdminApi/payU.aspx';

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
    public buyProductService: BuyProductsService,
    public router: Router,
    private dialogRef: MatDialogRef<PaymentComponent>,
    public formBuilder: FormBuilder,
    public toastr: ToastrService
  ) {
    this.paymentGateWayForm = this.formBuilder.group({
      productName: [''],
      name: [''],
      email: [''],
      phone: [''],
      amount: ['']
    });

    let TransactionID = uuidv4();
    this.txnid = TransactionID.substring(0, 8);
    this.payuform.Amount = sessionStorage.getItem('totalPayableAmount');
    console.log('amt', this.payuform.Amount);
  }



  confirmPayment() {

    this.hashKeyRequest = {
      amount: this.payuform.Amount,
      firstname: this.payuform.Name,
      email: this.payuform.EmailID,
      phone: this.payuform.mobilno,
      productinfo: this.payuform.productinfo,
      surl: "https://www.payumoney.com/mobileapp/payumoney/success.php",
      furl: "https://www.payumoney.com/mobileapp/payumoney/failure.php",
      mode: "Online",
      udf1: "GV000001",
      txnid: "131",
    }

    this.buyProductService.getHashKey(this.hashKeyRequest).subscribe(response => {
      this.toastr.success('Press Submit To Continue');
      this.hashKeyRes = response;
      // this.txnid = this.hashKeyRes.id;
      this.payuform.Amount = this.payuform.Amount + ".00";
      this.payuform.mobilno = this.payuform.mobilno;
      // this.payuform.Name
      // this.payuform.hash = this.hashKeyRes.hashKey;
      this.payuform.TransationID = this.txnid.toString();
      // this.payuform.Surl = "https://www.payumoney.com/mobileapp/payumoney/success.php";
      // this.payuform.Furl = "https://www.payumoney.com/mobileapp/payumoney/failure.php";
      // this.payuform.service_provider = 'payu_paisa';
      // this.payuform.Key = "5tJYJdBY";
      // this.payuform.udf1 = 'GV000001';





      let url = new URL(this.payuUrl);
      url.searchParams.set('Name', this.payuform.Name);
      url.searchParams.set('EmailID', this.payuform.EmailID);
      url.searchParams.set('Amount', this.payuform.Amount);
      url.searchParams.set('mobileno', this.payuform.mobilno.toString());
      url.searchParams.set('TransationID', this.txnid.toString());

      this.payuUrl = url.href;
      this.buyProductService.pUrl = url.href









      // const formData = new FormData();
      // formData.append('amount', this.payuform.amount);
      // formData.append('productinfo', this.payuform.productinfo);
      // formData.append('firstname', this.payuform.firstname);
      // formData.append('email', this.payuform.email);
      // formData.append('phone', this.payuform.phone);
      // formData.append('Surl', this.payuform.Surl);
      // formData.append('Furl', this.payuform.Furl);
      // formData.append('Key', this.payuform.Key);
      // formData.append('hash', this.payuform.hash);
      // formData.append('Txnid', this.payuform.Txnid);
      // formData.append('service_provider', this.payuform.service_provider);
      // formData.append('udf1', this.payuform.udf1);

      this.disablePaymentButton = false;
      //   this.buyProductService.createPayment(formData).subscribe(
      //     res => {
      //       console.log('payment gateway response', res);
      //     },
      //     err => {
      //       console.log('error occured  ', err);
      //     }
      //   );

    });
  }



  ngOnInit() {
  }

  navigateToSuccess() {
    let failure = 'failure';
    let success = 'success';
    let TransationID = 124;
    this.router.navigate(['/success/'], { queryParams: { TransationID: TransationID, Status: 'success' } });

    this.dialogRef.close();

  }

  // navigateToPaymentGateway() {

  //   this.paymentGateWay.Txnid = '100';
  //   console.log(this.paymentGateWay);
  //   this.buyProductService.postPaymenGatewayUrl(this.paymentGateWay.amount, this.paymentGateWay.Txnid, this.paymentGateWay.firstname, this.paymentGateWay.email, this.paymentGateWay.phone).subscribe(res => {
  //     console.log(res);
  //   });
  // }

}