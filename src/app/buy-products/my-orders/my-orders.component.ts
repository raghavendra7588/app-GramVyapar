import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { MatDialog } from '@angular/material/dialog';
import { EditMyOrder, MyOrders } from '../buy-products.model';
import { BuyProductsService } from '../buy-products.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DialogMyOrdersEditComponent } from '../dialog-my-orders-edit/dialog-my-orders-edit.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogMyOrdersViewComponent } from '../dialog-my-orders-view/dialog-my-orders-view.component';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  displayedColumns: string[] = ['customerName', 'orderid', 'deliveryUpto', 'view'];

  dataSource: any;
  vendorArray: any = [];
  vendorName: string;
  myOrdersData: any = [];
  myOrdersViewData: any = [];
  myOrders: MyOrders = new MyOrders();
  PurchaseProductId: number;
  DeliveryDate: any;
  OrderDate: any;
  languageCode: string;
  userId: string;
  ordersData: any = [];
  orderDataResponse: any = [];
  searchProducts: any;
  isDisplay: boolean;
  totalOrder: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    public buyProductsService: BuyProductsService,
    public dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute
  ) {



  }

  ngOnInit(): void {

    if ("sellerName" in sessionStorage) {
      this.vendorName = sessionStorage.getItem('sellerName');
    }
    if ("customerId" in sessionStorage) {
      this.userId = sessionStorage.getItem('customerId');
    }

    this.vendorArray = [{ id: 0, name: this.vendorName }];
    this.languageCode = "en";

    this.totalOrder = Number(sessionStorage.getItem('totalOrder'));




    if ("totalOrder" in sessionStorage) {
      this.buyProductsService.getMyOrdersData(this.languageCode, this.userId).subscribe(response => {
        this.ordersData = response;
        this.dataSource = new MatTableDataSource(this.ordersData);
        setTimeout(() => this.dataSource.paginator = this.paginator);

        this.isDisplay = true;
      });
    }
    else {
      this.isDisplay = false;
    }







  }
  searchProductsFromList() {
    this.dataSource.filter = this.searchProducts.trim().toLowerCase();
  }
  applyFilter(filter: string) {
    this.dataSource.filter = filter.trim().toLowerCase();
  }

  convertDate(receivedDate) {
    let date = new Date(receivedDate);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    const stringDate = [day, month, year].join("/");
    let fullDate = stringDate;
    return fullDate
  }

  selectedVendorName() {
    //console.log(this.myOrders.vendorName);
  }

  searchRecords() {
    let prevOrderNo: any;
    prevOrderNo = this.myOrders.orderNo;

    if (this.myOrders.vendorName === null || this.myOrders.vendorName === undefined || this.myOrders.vendorName === '') {
      if ("sellerName" in sessionStorage) {
        this.myOrders.vendorName = sessionStorage.getItem('sellerName');
      }
      else {
        this.myOrders.vendorName = '';
      }

    }

    if (this.myOrders.orderNo === null || this.myOrders.orderNo === undefined || this.myOrders.orderNo === '') {
      this.myOrders.orderNo = 'ALL';
    }

    if (this.OrderDate === null || this.OrderDate === undefined || this.OrderDate === '') {
      this.myOrders.OrderDate = 'ALL';
    }
    else {
      let startDate = this.convertDate(this.OrderDate);
      this.myOrders.OrderDate = startDate;
    }

    if (this.DeliveryDate === null || this.DeliveryDate === undefined || this.DeliveryDate === '') {
      this.myOrders.DeliveryDate = 'ALL';
    }
    else {
      let endDate = this.convertDate(this.DeliveryDate);
      this.myOrders.DeliveryDate = endDate;
    }


    if ("vendorId" in sessionStorage) {
      this.myOrders.vendorCode = sessionStorage.getItem('vendorId');
    }

    if ("sellerId" in sessionStorage) {
      this.myOrders.sellerId = sessionStorage.getItem('sellerId');
    }




    this.buyProductsService.getALLOrdersData(this.myOrders).subscribe(response => {
      this.myOrdersData = response;
      this.dataSource = new MatTableDataSource(this.myOrdersData);
      this.dataSource.paginator = this.paginator;

    });

    this.myOrders.orderNo = prevOrderNo;
  }

  editProducts(response) {
    this.PurchaseProductId = response.PurchaseProductId;
    this.dialog.open(DialogMyOrdersEditComponent, {
      height: '600px',
      width: '1200px',
      data: this.PurchaseProductId
    });
  }


  viewProducts(response) {
    this.PurchaseProductId = response.PurchaseProductId;
    this.orderDataResponse = response;
    this.myOrdersViewData = response;
    this.dialog.open(DialogMyOrdersViewComponent, {
      height: '600px',
      width: '1200px',
      data: this.orderDataResponse
    });
  }
  goToCategoriesPage() {
    let shopName = sessionStorage.getItem('vendorName').toString();
    this.router.navigate(['/buyProducts/categories'], { queryParams: { name: shopName } });
  }


}
