import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BuyProductsService } from '../buy-products.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';

import { ActivatedRoute, Router } from '@angular/router';
import { DeleteMyOrder, EditMyOrder } from '../buy-products.model';
import { EmitterService } from 'src/app/shared/emitter.service';

@Component({
  selector: 'app-dialog-my-orders-edit',
  templateUrl: './dialog-my-orders-edit.component.html',
  styleUrls: ['./dialog-my-orders-edit.component.css']
})
export class DialogMyOrdersEditComponent implements OnInit {

  PurchaseProductId: number;


  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = ['select', 'name', 'brandName', 'quantity', 'mrp', 'discount', 'finalPrice', 'oldQuantity', 'newQuantity'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  updateAllRecordsCount = 0;
  dataSource: any;
  checkFinalPrice: boolean;
  checkCategoryId: boolean;
  isActive: boolean;
  multipleEntriesArray: any = [];
  uniquePurchaseOrderItemArray: any = [];
  multipleEntries: any = [];
  myOrdersData: any = [];

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

  editMyOrder: EditMyOrder = new EditMyOrder();
  deleteMyOrder: DeleteMyOrder = new DeleteMyOrder();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogMyOrdersEditComponent>,
    public buyProductsService: BuyProductsService,
    public toastr: ToastrService,
    public emitterService: EmitterService,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    let mappedMyOrdersData: any = [];
    this.PurchaseProductId = data;
    // this.buyProductsService.getAllOrdersDataByPurchaseProductId(this.PurchaseProductId).subscribe(data => {
    //   console.log('received data', data);

    //   this.myOrdersData = data;
    //   mappedMyOrdersData = this.createCustomMyOrder(this.myOrdersData);
    //   this.dataSource = new MatTableDataSource(this.myOrdersData);
    //   this.dataSource.paginator = this.paginator;



    //   this.orderNo = this.myOrdersData[0].OrderNo;
    //   this.customerName = this.myOrdersData[0].customerName;

    //   this.vendorName = this.myOrdersData[0].VendorName;
    //   this.mobileNumber = this.myOrdersData[0].mobileNumber;

    //   this.paymentType = this.myOrdersData[0].PaymentType;
    //   this.orderDate = this.myOrdersData[0].OrderDate;

    //   this.deliveryTime = this.myOrdersData[0].DeliveryTime;
    //   this.deliveryType = this.myOrdersData[0].DeliveryType;

    //   this.houseNo = this.myOrdersData[0].houseNO;
    //   this.landMark = this.myOrdersData[0].landmark;

    //   this.area = this.myOrdersData[0].area;
    //   this.city = this.myOrdersData[0].city;

    //   this.payableCalculation(this.myOrdersData);


    // });

  }

  ngOnInit(): void {
  }

  createCustomMyOrder(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].pincode = 0;
    }
    return arr;
  }

  payableCalculation(arr) {

    this.totalMRP = 0;
    this.totalDiscount = 0;
    this.totalItemsOrdered = 0;
    this.totalPayableAmount = 0;
    for (let i = 0; i < arr.length; i++) {
      this.totalMRP += Number(arr[i].MRP) * Number(arr[i].RequiredQuantity);
      this.totalDiscount += Number(arr[i].Discount) * Number(arr[i].RequiredQuantity);
      this.totalItemsOrdered += Number(arr[i].RequiredQuantity);

    }
    this.totalPayableAmount = this.totalMRP - this.totalDiscount;


  }



  isAllSelected() {

    const numSelected = this.selection.selected.length;
    this.updateAllRecordsCount = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.updateAllRecordsCount = 0;
    }
    else {
      this.dataSource.data.forEach((row) => {
        this.selection.select(row);
      });
    }
  }


  onChange(event) {
    if (event.checked === true) {
      this.updateAllRecordsCount++;
    }
    else {
      this.updateAllRecordsCount--;
    }
  }



  updateAll() {
    this.checkFinalPrice = true;
    this.checkCategoryId = true;
    this.selection.selected.forEach((element) => {
      if (this.checkFinalPrice === false) {
        return;
      }

      if (this.checkCategoryId === false) {
        return;
      }
      this.checkCategoryId = this.checkStorageCategoryId(element);

      if (!(this.checkCategoryId)) {
        this.toastr.error('Category Mismatched !');
        return;
      }

      this.checkFinalPrice = this.checkItemFinalPrice(element);
      if (!this.checkFinalPrice) {
        this.toastr.error('Please Check Quantity');
        return;
      }

    });
    if (this.checkFinalPrice && this.checkCategoryId) {
      this.selection.selected.forEach((element) => {
        this.multipleEntriesArray.push(element);
        this.uniquePurchaseOrderItemArray = this.uniqueEntries(this.multipleEntriesArray, element);
        this.isActive = false;
      });
      this.postMultipleInsertion(this.uniquePurchaseOrderItemArray);
    }
  }
  uniqueEntries(arr, obj) {
    let isExist = arr.some(o => Number(o.ProductId) === Number(obj.ProductId) && Number(o.id) === Number(obj.id)
      && Number(o.PurchaseProductsItemId) === Number(obj.PurchaseProductsItemId));
    if (!isExist)
      arr.push(obj);
    return arr;
  }

  checkStorageCategoryId(element) {
    let isCategoryValid: boolean = true;

    let cartItems = JSON.parse(sessionStorage.getItem('cart_items'));

    if (cartItems === null || cartItems === undefined || cartItems === []) {
      return true;
    }
    else {
      for (let i = 0; i < cartItems.length; i++) {
        if (Number(cartItems[i].categoryid) === Number(element.CategoryId)) {
          isCategoryValid = true;
        }
        else {
          isCategoryValid = false;
        }
      }
    }


    return isCategoryValid;
  }
  checkItemFinalPrice(element) {

    let isRecordValid: boolean = true;

    let requiredQuantity = Number(element.RequiredQuantity);
    let availableQuantity = Number(element.Quantity);
    let newQuantity = Number(element.pincode);

    if ((Number(newQuantity) < 1) || (Number(newQuantity) > Number(availableQuantity))) {
      isRecordValid = false;
    }

    else {
      if ((Number(newQuantity) >= 1) || (Number(newQuantity) < Number(availableQuantity))) {
        isRecordValid = true;
      }
    }



    return isRecordValid;
  }


  postMultipleInsertion(elements) {
    elements.forEach(element => {



      this.editMyOrder = new EditMyOrder();
 


      this.editMyOrder.Discount = Number(element.Discount);
      this.editMyOrder.FinalPrice = Number(element.FinalPrice);
      this.editMyOrder.MRP = Number(element.MRP);
      this.editMyOrder.Quantity = Number(element.Quantity);

      this.editMyOrder.RequiredQuantity = Number(element.RequiredQuantity);
      this.editMyOrder.Unit = element.Unit;

      this.editMyOrder.name = element.name;
      this.editMyOrder.PurchaseProductId = element.PurchaseProductId;
      this.editMyOrder.PurchaseProductsItemId = element.PurchaseProductsItemId;
      this.editMyOrder.NewQuantity = Number(element.pincode);
      this.editMyOrder.categoryid = Number(element.CategoryId);
      this.editMyOrder.RequiredQuantity = this.editMyOrder.NewQuantity;
      this.editMyOrder.id = Number(element.id);
      this.editMyOrder.productid = Number(element.ProductId);

      this.editMyOrder.brandId = Number(element.BrandId);
      this.multipleEntries.push(this.editMyOrder);

    });


    let prevStorageArray: any = [];
    let finalStorageArray: any = [];



    finalStorageArray = this.multipleEntries;
    prevStorageArray = JSON.parse(sessionStorage.getItem('cart_items'));
    if (prevStorageArray === null || prevStorageArray === undefined || prevStorageArray === []) {
      finalStorageArray = this.multipleEntries;
    }
    else {
      finalStorageArray = this.createOrderItems(prevStorageArray, this.multipleEntries);
    }


    sessionStorage.removeItem('cart_items');
    sessionStorage.setItem('cart_items', JSON.stringify(finalStorageArray));

    this.emitterService.isProductIsAddedOrRemoved.emit(true);
    this.dialogRef.close();
    this.router.navigate(['buyProducts/goToCart']);
  }

  deleteProducts(response) {

    this.deleteMyOrder.PurchaseProductId = response.PurchaseProductId;
    this.deleteMyOrder.PurchaseProductsItemId = response.PurchaseProductsItemId;
    // this.buyProductsService.deleteMyOrdersData(this.deleteMyOrder).subscribe(data => {
    // });
  }

  createOrderItems(storageArray, currentItemsArray) {
  
    var finalarray = currentItemsArray.filter(function (currentItems) {
      return storageArray.some(function (stroageItems) {
        if ((Number(currentItems.id) === Number(stroageItems.id)) && (Number(currentItems.productid) == Number(stroageItems.productid))) {
          storageArray.Discount = currentItemsArray.Discount;
          storageArray.FinalPrice = currentItemsArray.FinalPrice;
          storageArray.MRP = currentItemsArray.MRP;
          storageArray.Quantity = currentItemsArray.Quantity;
          storageArray.RequiredQuantity = currentItemsArray.RequiredQuantity;
          return storageArray;
        }
        else {
          storageArray.push(currentItems);
          return storageArray;
        }
      });
    });

    return finalarray;
  }
}
