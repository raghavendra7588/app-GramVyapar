import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BuyProductsService } from '../buy-products.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AnonymousSubject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-dialog-my-orders-view',
  templateUrl: './dialog-my-orders-view.component.html',
  styleUrls: ['./dialog-my-orders-view.component.css']
})
export class DialogMyOrdersViewComponent implements OnInit {

  PurchaseProductId: number;

  displayedColumns: string[] = ['PrdName', 'ProductName', 'MRP', 'QuantityOrdered', 'finalPrice',];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  myOrdersData: any = [];
  myOrdersResponse: any;
  finalMyOrdersResponse: any = [];
  dataSource: any;
  totalMRP = 0;
  totalDiscount = 0;
  totalItemsOrdered = 0;
  totalPayableAmount = 0;
  youSaved = 0;

  customerName: string;
  vendorName: string;
  mobileNumber: string;
  paymentType: string;
  orderDate: string;
  deliveryTime: string;
  deliveryType: string;
  houseNo: string;
  landMark: string;
  area: string;
  city: string;
  orderNo: string;
  orderDataResponse: any = [];
  state: string;
  formattedAddress: string;
  mobilenumber: string;
  sellerName: any;
  vendorCode: any;


  shipping_name: string;
  shipping_flatNo: string;
  shipping_society: string;
  shipping_locality: string;
  shipping_pincode: string;
  shipping_city: string;
  shipping_area: string;
  shipping_state: string;
  shipping_mobileNo: string;

  billing_name: string;
  billing_flatNo: string;
  billing_society: string;
  billing_locality: string;
  billing_pincode: string;
  billing_city: string;
  billing_area: string;
  billing_state: string;
  billing_mobileNo: string;

  vendorContactNo: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogMyOrdersViewComponent>,
    public buyProductsService: BuyProductsService,
  ) {

    this.orderDataResponse = data;
    this.finalMyOrdersResponse = this.orderDataResponse.orderDetails;
    this.dataSource = new MatTableDataSource(this.finalMyOrdersResponse);
    setTimeout(() => this.dataSource.paginator = this.paginator);


    this.orderNo = this.orderDataResponse.orderid;


    this.paymentType = this.orderDataResponse.paymentType;
    this.orderDate = this.orderDataResponse.deliveryUpto;

    this.deliveryTime = this.orderDataResponse.deliverySlot;
    this.deliveryType = this.orderDataResponse.deliveryType;

    this.shipping_name = this.orderDataResponse.name;
    this.shipping_flatNo = this.orderDataResponse.flatNo;
    this.shipping_society = this.orderDataResponse.societyName;
    this.shipping_locality = this.orderDataResponse.locality;
    this.shipping_city = this.orderDataResponse.city;
    this.shipping_area = this.orderDataResponse.areaName;
    this.shipping_state = this.orderDataResponse.state;
    this.shipping_mobileNo = this.orderDataResponse.shippingMobileNumber;

    this.billing_name = this.orderDataResponse.billingName;
    this.billing_flatNo = this.orderDataResponse.billingFlatNo;
    this.billing_locality = this.orderDataResponse.billingLocality;
    this.billing_society = this.orderDataResponse.billingSocietyName;
    this.billing_area = this.orderDataResponse.billingAreaName;
    this.billing_city = this.orderDataResponse.billingCity;
    this.billing_state = this.orderDataResponse.billingState;
    this.billing_mobileNo = this.orderDataResponse.billingMobileNumber;



    this.payableCalculation(this.orderDataResponse.orderDetails);
    // this.vendorContactNo = "7588641864";
    this.vendorContactNo = sessionStorage.getItem('vendorContactNo');
  }


  ngOnInit(): void {
    this.sellerName = sessionStorage.getItem('sellerName');
    this.vendorCode = sessionStorage.getItem('vendorId');
  }
  payableCalculation(arr) {

    this.totalMRP = 0;
    this.totalDiscount = 0;
    this.totalItemsOrdered = 0;
    this.totalPayableAmount = 0;
    for (let i = 0; i < arr.length; i++) {
      this.totalMRP += Number(arr[i].MRP) * Number(arr[i].QuantityOrdered);
      this.totalDiscount += Number(arr[i].Discount) * Number(arr[i].QuantityOrdered);
      this.totalItemsOrdered += Number(arr[i].QuantityOrdered);
    }
    this.totalPayableAmount = this.totalMRP - this.totalDiscount;
  }

}
