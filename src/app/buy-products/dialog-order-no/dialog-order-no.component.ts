import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-order-no',
  templateUrl: './dialog-order-no.component.html',
  styleUrls: ['./dialog-order-no.component.css']
})
export class DialogOrderNoComponent implements OnInit {
  orderNo: any;
  placeOrderResponse: any = [];

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogOrderNoComponent>) {
    this.placeOrderResponse = data;


    let slicedOrderNo = this.placeOrderResponse.orderid.slice(this.placeOrderResponse.orderid.length - 6);
    this.orderNo = slicedOrderNo;
  }


  ngOnInit(): void {
  }

  agreeToPrint() {
    let shopName = sessionStorage.getItem('vendorName').toString();
    this.router.navigate(['/buyProducts/categories'], { queryParams: { name: shopName } });
    this.dialogRef.close(true);
  }
  notPrint() {
    let shopName = sessionStorage.getItem('vendorName').toString();
    this.router.navigate(['/buyProducts/categories'], { queryParams: { name: shopName } });
    this.dialogRef.close(true);
  }

}
