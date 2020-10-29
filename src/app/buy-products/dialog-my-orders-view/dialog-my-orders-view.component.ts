import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BuyProductsService } from '../buy-products.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-dialog-my-orders-view',
  templateUrl: './dialog-my-orders-view.component.html',
  styleUrls: ['./dialog-my-orders-view.component.css']
})
export class DialogMyOrdersViewComponent implements OnInit {

  PurchaseProductId: number;
  // displayedColumns: string[] = ['name', 'brandName', 'quantity', 'mrp', 'discount', 'finalPrice', 'requiredQuantity'];

  displayedColumns: string[] = ['PrdName', 'ProductName', 'MRP', 'Discount', 'QuantityOrdered'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  myOrdersData: any = [];
  myOrdersResponse: any;
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogMyOrdersViewComponent>,
    public buyProductsService: BuyProductsService,
  ) {

    this.orderDataResponse = data;
    console.log('order response', this.orderDataResponse);
    this.dataSource = new MatTableDataSource(this.orderDataResponse.orderDetails);
    // this.buyProductsService.getAllOrdersDataByPurchaseProductId(this.PurchaseProductId).subscribe(data => {
    //   console.log('received data ******', data);
    //   this.myOrdersData = data;
    //   this.dataSource = new MatTableDataSource(this.myOrdersData);

    this.formattedAddress = this.orderDataResponse.address.replace(/;/g, " ,");
    console.log("*******", this.formattedAddress);

    this.customerName = this.orderDataResponse.customerName;
    console.log("*******", this.customerName);

    this.mobilenumber = this.orderDataResponse.mobilenumber;
    console.log("*******", this.mobilenumber);

    this.city = this.orderDataResponse.city;
    this.state = this.orderDataResponse.state;

    this.orderNo = this.orderDataResponse.orderid;
    //   this.customerName = this.myOrdersData[0].customerName;

    //   this.vendorName = this.myOrdersData[0].VendorName;
    //   this.mobileNumber = this.myOrdersData[0].mobileNumber;

    this.paymentType = this.orderDataResponse.paymentType;
    this.orderDate = this.orderDataResponse.deliveryUpto;

    this.deliveryTime = this.orderDataResponse.deliverySlot;
    this.deliveryType = this.orderDataResponse.deliveryType;

    //   this.houseNo = this.myOrdersData[0].houseNO;
    //   this.landMark = this.myOrdersData[0].landmark;

    //   this.area = this.myOrdersData[0].area;
    //   this.city = this.myOrdersData[0].city;

    this.payableCalculation(this.orderDataResponse.orderDetails);
    //   this.dataSource.paginator = this.paginator;

    // });
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
      // this.totalFinalPrice += arr[i].FinalPrice;
    }
    this.totalPayableAmount = this.totalMRP - this.totalDiscount;
  }

  ngOnInit(): void {
  }

}
