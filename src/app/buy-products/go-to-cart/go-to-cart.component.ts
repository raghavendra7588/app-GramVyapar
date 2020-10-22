import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
// import { Address } from 'src/app/purchase/purchase.model';

import { AddressDetails, OrderedItems, PurchaseProducts } from '../buy-products.model';
import { BuyProductsService } from '../buy-products.service';
import { ToastrService } from 'ngx-toastr';
// import { DialogOrderNoComponent } from '../dialog-order-no/dialog-order-no.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddAddressComponent } from '../dialog-add-address/dialog-add-address.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { EmitterService } from 'src/app/shared/emitter.service';
import { DialogOrderNoComponent } from '../dialog-order-no/dialog-order-no.component';

@Component({
  selector: 'app-go-to-cart',
  templateUrl: './go-to-cart.component.html',
  styleUrls: ['./go-to-cart.component.css']
})
export class GoToCartComponent implements OnInit {

  dataSource: any;
  modalRef: BsModalRef;
  cartItems: any = [];
  totalFinalPrice: number = 0;
  totalMRP: any = 0;
  totalDiscount: any = 0;
  totalPayableAmount: number = 0;
  totalItemsOrdered: number = 0;
  selectedAddressId: any;
  addressData: any = [];
  vendorId: string;
  addressId: string;
  address: AddressDetails = new AddressDetails();
  orderedItems: OrderedItems = new OrderedItems();
  isDisplay: boolean;
  cartLength: number;

  isAddressSelected: boolean = false;

  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = ['select', 'name', 'quantity', 'mrp', 'discount', 'finalPrice', 'requiredQuantity', 'delete'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  checkFinalPrice: boolean;
  updateAllRecordsCount: number = 0;
  multipleEntriesArray: any = [];
  uniquePurchaseOrderItemArray: any = [];
  isActive: boolean;
  multipleEntries: any = [];





  deliveryType: any = [];
  paymentType: any = [];
  deliveryTime: any = [];
  currentAddressData: any = [];

  deliveryTypeStr: string;
  paymentTypeStr: string;
  deliveryTimeStr: string;
  deliveryDate: any;

  subTotal = 0.00;
  discountTotal = 0.00;
  finalAmountTotal = 0.00;
  currentVendorId: string;
  currentAddressId: number;

  name: string;
  houseNo: string;
  landMark: string;
  society: string;
  pinCode: number;
  city: string;
  area: string;
  state: string;
  orderDate: any;
  purchaseProductResponse: any = [];
  ProductsResponse: any;
  prevDeliveryDate: any;
  minDate: any;
  selectAddressId: any;
  addressSelected: boolean = false;
  currentlySelectedAddress: any;
  selectedTimeSlot: any;
  // modalRef: BsModalRef;
  message: string;
  deleteRecordResponse: any;

  purchaseProducts: PurchaseProducts = new PurchaseProducts();

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public emitterService: EmitterService,
    public buyProductsService: BuyProductsService,
    public toastr: ToastrService,
    public dialog: MatDialog,
    private modalService: BsModalService
  ) {
    this.emitterService.isProductRemoved.subscribe(value => {
      if (value) {
        this.getCartItems();
        if (this.cartItems.length === 0 || this.cartItems === null || this.cartItems === undefined || this.cartItems === []) {
          console.log('cndn matched');
          this.isDisplay = false;
        }
      }
    });

    this.emitterService.isAddressCreated.subscribe(value => {
      if (value) {
        console.log('address updated');
        this.getCartItems();
        this.getAddressData();
        this.clearValues();
      }
    });


    this.minDate = new Date();
  }

  ngOnInit(): void {

    this.vendorId = sessionStorage.getItem('vendorId');

    this.cartItems = JSON.parse(sessionStorage.getItem('cart_items'));

    this.dataSource = new MatTableDataSource(this.cartItems);
    this.dataSource.paginator = this.paginator;

    this.cartItems = JSON.parse(sessionStorage.getItem('cart_items'));
    this.dataSource = new MatTableDataSource(this.cartItems);
    this.dataSource.paginator = this.paginator;
    if (this.cartItems === null || this.cartItems === undefined) {
      this.isDisplay = false;
      console.log('isDisplay', this.isDisplay);
      this.cartLength = 0;
    }
    else {
      this.isDisplay = true;
    }
    this.payableCalculation(this.cartItems);
    // this.getCartItems();





    this.vendorId = sessionStorage.getItem('vendorId');
    this.currentAddressId = Number(sessionStorage.getItem('address_id'));
    this.purchaseProducts.AddressId = Number(sessionStorage.getItem('address_id'));
    this.purchaseProducts.OrderNo = (this.getRandomNumbers()).toString();

    this.orderDate = new Date();
    console.log('orderDate', this.orderDate);
    let orderDate = this.convertDate(this.orderDate);
    this.purchaseProducts.OrderDate = orderDate;

    this.deliveryType = [
      { id: 0, type: 'Pickup' },
      { id: 1, type: 'Home Delivery' }
    ];

    this.paymentType = [
      { id: 0, type: 'Cash' },
      { id: 1, type: 'Credit' },
      // { id: 2, type: 'Online' }
    ];

    this.deliveryTime = [
      { id: 0, type: '9.00 AM - 1.00PM', minHour: 9, maxHour: 13 },
      { id: 1, type: '1.00 AM - 5.00PM', minHour: 13, maxHour: 17 },
      { id: 2, type: '5.00 AM - 9.00PM', minHour: 17, maxHour: 21 },
      { id: 3, type: 'Anytime Ok', minHour: 0, maxHour: 24 }
    ];

    this.buyProductsService.getAddressDataById(this.vendorId).subscribe(data => {
      this.addressData = data;
      console.log('adddress  api data', this.addressData);

    });
    this.getAddressData();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openModal(template: TemplateRef<any>, response) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.deleteRecordResponse = response;
    console.log('deleteRecordResponse', this.deleteRecordResponse);
  }

  confirm(): void {
    console.log('deleteRecordResponse inside confirm', this.deleteRecordResponse);
    this.message = 'Confirmed!';
    this.deleteRecord(this.deleteRecordResponse);
    this.modalRef.hide();
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
    return ;
  }


  applyFilter(filter: string) {
    this.dataSource.filter = filter.trim().toLowerCase();
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
    this.selection.selected.forEach((element) => {
      if (this.checkFinalPrice === false) {
        return;
      }

      this.checkFinalPrice = this.checkItemFinalPrice(element);
      if (!this.checkFinalPrice) {
        this.toastr.error('Please Check Quantity');
      }
    });
    if (this.checkFinalPrice) {
      this.selection.selected.forEach((element) => {
        this.multipleEntriesArray.push(element);
        this.uniquePurchaseOrderItemArray = this.uniqueEntries(this.multipleEntriesArray, element);
        this.isActive = false;
      });
      this.postMultipleInsertion(this.uniquePurchaseOrderItemArray);
    }
  }
  uniqueEntries(arr, obj) {
    let isExist = arr.some(o => Number(o.productid) === Number(obj.productid) && Number(o.id) === Number(obj.id));
    if (!isExist)
      arr.push(obj);
    return arr;
  }


  checkItemFinalPrice(element) {


    let isRecordValid: boolean = true;

    let requiredQuantity = element.RequiredQuantity;
    let availableQuantity = element.Quantity;

    if ((Number(requiredQuantity) < 1) || (Number(requiredQuantity) > Number(availableQuantity))) {
      isRecordValid = false;
    }
    else {
      if ((Number(requiredQuantity) > 1) || (Number(requiredQuantity) < Number(availableQuantity))) {
        isRecordValid = true;
      }
    }
    return isRecordValid;
  }


  postMultipleInsertion(elements) {
    elements.forEach(element => {
      this.orderedItems = new OrderedItems();

      this.orderedItems.Discount = element.Discount;
      this.orderedItems.FinalPrice = element.FinalPrice;
      this.orderedItems.MRP = element.MRP;
      this.orderedItems.Quantity = element.Quantity;
      this.orderedItems.RequiredQuantity = element.RequiredQuantity;
      this.orderedItems.Unit = element.Unit;
      this.orderedItems.brandImageUrl = element.brandImageUrl;
      this.orderedItems.brandid = element.brandid;
      this.orderedItems.id = element.id;
      this.orderedItems.imgurl = element.imgurl;
      this.orderedItems.name = element.name;
      this.orderedItems.productid = element.productid;

      this.multipleEntries.push(this.orderedItems);

    });
    console.log(this.multipleEntries);

    let prevStorageArray: any = [];
    let finalStorageArray: any = [];
    prevStorageArray = JSON.parse(sessionStorage.getItem('cart_items'));
    console.log('prevStorageArray ', prevStorageArray);
    finalStorageArray = this.mergeOrderItems(prevStorageArray, this.multipleEntries);
    sessionStorage.removeItem('cart_items');
    sessionStorage.setItem('cart_items', JSON.stringify(finalStorageArray));
    console.log('finalStorageArray ', finalStorageArray);
    this.payableCalculation(finalStorageArray);
    this.toastr.success('Records Are Updated');
    this.updateAllRecordsCount = 0;
    this.selection.clear();
    this.multipleEntriesArray = [];
    this.multipleEntries = [];
    this.emitterService.isProductIsAddedOrRemoved.emit(true);

  }


  mergeOrderItems(storageArray, orderedItems) {
    for (let i = 0; i < orderedItems.length; i++) {
      for (let j = 0; j < storageArray.length; j++) {
        if (Number(orderedItems[i].productid) === Number(storageArray[j].productid) &&
          Number(orderedItems[i].id) === Number(storageArray[j].id)) {
          console.log('cndn matched');

          storageArray[j].Discount = orderedItems[i].Discount;
          storageArray[j].FinalPrice = orderedItems[i].FinalPrice;
          storageArray[j].MRP = orderedItems[i].MRP;
          storageArray[j].Quantity = orderedItems[i].Quantity;
          storageArray[j].RequiredQuantity = orderedItems[i].RequiredQuantity;
          storageArray[j].Unit = orderedItems[i].Unit;
          storageArray[j].brandImageUrl = orderedItems[i].brandImageUrl;
          storageArray[j].brandid = orderedItems[i].brandid;
          storageArray[j].id = orderedItems[i].id;
          storageArray[j].imgurl = orderedItems[i].imgurl;
          storageArray[j].name = orderedItems[i].name;
          storageArray[j].productid = orderedItems[i].productid;



        }
      }
    }
    return storageArray;
  }




















  selectedAddressFromList(response) {
    // console.log(response);
    this.currentlySelectedAddress = response;
    console.log(' this.currentlySelectedAddress', this.currentlySelectedAddress);
    this.address.name = response.name;
    this.address.mobileNumber = response.mobileNumber;
    this.address.houseNo = response.houseNO;
    this.address.society = response.society;
    this.address.landMark = response.landmark;
    this.address.pinCode = response.pincode;
    this.address.area = response.area;
    this.address.city = response.city;
    this.address.state = response.state;
    this.addressId = response.id.toString();
    this.purchaseProducts.AddressId = Number(response.id);
    this.isAddressSelected = true;
    this.addressSelected = true;
  }

  getCartItems() {
    this.cartItems = JSON.parse(sessionStorage.getItem('cart_items'));
    this.dataSource = new MatTableDataSource(this.cartItems);
    this.dataSource.paginator = this.paginator;
    if (this.cartItems === null || this.cartItems === undefined || this.cartItems === []) {
      console.log('i checked this getCartItems');
      this.isDisplay = false;
      console.log('isDisplay', this.isDisplay);
      this.cartLength = 0;
    }

    else {
      this.isDisplay = true;
    }
    this.payableCalculation(this.cartItems);
  }

  addNewAddress() {
    this.dialog.open(DialogAddAddressComponent, {
      height: '400px',
      width: '800px'
    });

    // this.router.navigate(['buyProducts/addressDetailsData']);
  }

  editExistingAddress() {
    this.dialog.open(DialogAddAddressComponent, {
      height: '400px',
      width: '800px',
      data: this.currentlySelectedAddress
    });
  }

  payableCalculation(arr) {

    if (arr === undefined || arr == null || arr === []) {
      this.totalMRP = 0;
      this.totalDiscount = 0;
      this.totalItemsOrdered = 0;
      this.totalPayableAmount = 0;
      console.log('i checked this payableCalculation');
      this.isDisplay = false;
    }
    else {
      this.totalMRP = 0;
      this.totalDiscount = 0;
      this.totalItemsOrdered = 0;
      this.totalPayableAmount = 0;
      for (let i = 0; i < arr.length; i++) {
        this.totalMRP += (parseFloat(arr[i].MRP) * parseFloat(arr[i].RequiredQuantity));
        this.totalDiscount += (parseFloat(arr[i].Discount) * parseFloat(arr[i].RequiredQuantity));
        this.totalItemsOrdered += Number(arr[i].RequiredQuantity);
        // this.totalFinalPrice += arr[i].FinalPrice;
      }
      this.totalPayableAmount = this.totalMRP - this.totalDiscount;
    }

  }
  goToProductCategoriesPage() {
    this.router.navigate(['buyProducts/categories']);
  }

  removeItems(item) {
    let tempCartItemsArray: any = [];
    tempCartItemsArray = this.cartItems;

    let index = tempCartItemsArray.findIndex(function (o) {
      return o.id === item.id && o.productid === item.productid;
    })
    if (index !== -1) {
      tempCartItemsArray.splice(index, 1);
    }

    sessionStorage.removeItem('cart_items');
    sessionStorage.setItem('cart_items', JSON.stringify(tempCartItemsArray));
    this.emitterService.isProductRemoved.emit(true);

  }



  decrementQuantity(response, i) {
    let currentQuantityValue: any;

    currentQuantityValue = Number((document.getElementById("qunatity" + i) as HTMLInputElement).value);
    if (currentQuantityValue > 0) {
      currentQuantityValue -= 1;

      document.getElementById("qunatity" + i).innerHTML = currentQuantityValue;
      response.RequiredQuantity = currentQuantityValue;
    }
    if (currentQuantityValue < 1) {

      let tempCartItemsArray: any = [];
      tempCartItemsArray = this.cartItems;

      let index = tempCartItemsArray.findIndex(function (o) {
        return o.id === response.id && o.productid === response.productid;
      })
      if (index !== -1) {
        tempCartItemsArray.splice(index, 1);
      }
      sessionStorage.removeItem('cart_items');
      sessionStorage.setItem('cart_items', JSON.stringify(tempCartItemsArray));
      this.emitterService.isProductRemoved.emit(true);
      // let filteredCartItems: any = [];
      // filteredCartItems = this.cartItems.filter(item => {
      //   return item.id != response.id && item.productid != response.productid
      // });
      // this.cartItems = filteredCartItems;

      this.payableCalculation(this.cartItems);
    }


  }

  incrementQuantity(response, i) {
    let currentQuantity: any;
    currentQuantity = Number((document.getElementById("qunatity" + i) as HTMLInputElement).value);
    currentQuantity += 1;
    document.getElementById("qunatity" + i).innerHTML = currentQuantity;
    response.RequiredQuantity = currentQuantity;

    // sessionStorage.removeItem('cart_items');
    //   sessionStorage.setItem('cart_items', JSON.stringify(tempCartItemsArray));
    //   this.emitterService.isProductRemoved.emit(true);
  }


  // getAddressData() {
  //   this.buyProductsService.getAddressDataById(this.vendorId).subscribe(data => {
  //     this.addressData = data;
  //   });
  // }

  // placeOrder() {
  //   console.log('address id', this.addressId);
  //   sessionStorage.setItem('address_id', this.addressId.toString());
  //   this.router.navigate(['buyProducts/placeOrder']);
  // }


  deleteRecord(response) {

    let storageArray = JSON.parse(sessionStorage.getItem('cart_items'));
    let finalStorageArray = storageArray.filter(data => {
      return data.productid != response.productid && data.id != response.id
    });
    sessionStorage.removeItem('cart_items');
    sessionStorage.setItem('cart_items', JSON.stringify(finalStorageArray));
    // this.cartItems.length === 0 || this.cartItems === null || this.cartItems === undefined || this.cartItems === []
    if (finalStorageArray.length === 0 || finalStorageArray === undefined || finalStorageArray === null || finalStorageArray === []) {
      console.log('empty the cart now');
      sessionStorage.removeItem('cart_items');
    }


    this.emitterService.isProductRemoved.emit(true);
    this.payableCalculation(finalStorageArray);
    this.emitterService.isProductIsAddedOrRemoved.emit(true);
  }










  selectedDeliveryTypeFromList(response) {
    console.log(response);
    this.selectedTimeSlot = response.id;
    console.log('&&&&&& id ', this.selectedTimeSlot);

  }
  selectedPaymentTermFromList(response) {
    console.log(response);
  }


  getAddressData() {
    this.buyProductsService.getAddressDataById(this.vendorId).subscribe(data => {
      this.addressData = data;
      // this.getSpecificAddress(this.addressData, this.addressId);
    });
  }

  // getSpecificAddress(address, id) {
  //   address.filter(data => {
  //     if (data.id === id) {
  //       this.name = data.name;
  //       this.houseNo = data.houseNO;
  //       this.society = data.society;
  //       this.landMark = data.landmark;
  //       this.pinCode = data.pincode;
  //       this.city = data.city;
  //       this.area = data.area;
  //     }
  //   });
  // }

  placeOrder() {
    this.purchaseProducts.VendorCode = sessionStorage.getItem('vendorId');
    this.purchaseProducts.SellerId = Number(sessionStorage.getItem('sellerId'));
    let todaysDate = new Date();
    let formattedTodaysDate = this.convertDate(todaysDate);
    let selectedDeliveryDate = this.convertDate(this.purchaseProducts.DeliveryDate);
    let minTimeSlot: number;
    let maxTimeSlot: number;

    let date = new Date();
    let currentHour = date.getHours();
    console.log('current hr', currentHour);
    for (let i = 0; i < this.deliveryTime.length; i++) {

      if (this.deliveryTime[i].id === this.selectedTimeSlot) {
        console.log('formattedTodaysDate', formattedTodaysDate);
        console.log('selectedDeliveryDate', selectedDeliveryDate);
        minTimeSlot = this.deliveryTime[i].minHour;
        maxTimeSlot = this.deliveryTime[i].maxHour;
        // console.log('you selected ', this.deliveryTime[i]);
      }
    }
    if ((formattedTodaysDate === selectedDeliveryDate)) {
      if (currentHour >= maxTimeSlot) {
        this.toastr.error('Check Delivery Time');
        return;
      }

    }
    console.log('i supposed to not exceute');


    if (this.purchaseProducts.OrderNo === null || this.purchaseProducts.OrderNo === undefined) {
      this.purchaseProducts.OrderNo = 'NULL';
    }


    if (this.purchaseProducts.DeliveryDate === null || this.purchaseProducts.DeliveryDate === undefined || this.purchaseProducts.DeliveryDate.toString() === '') {

      this.purchaseProducts.DeliveryDate = 'NULL';
    }
    else {

      this.prevDeliveryDate = this.purchaseProducts.DeliveryDate;
      let deliveryDate = this.convertDate(this.purchaseProducts.DeliveryDate);
      this.purchaseProducts.DeliveryDate = deliveryDate;
    }

    if (this.purchaseProducts.DeliveryType === null || this.purchaseProducts.DeliveryType === undefined || this.purchaseProducts.DeliveryType.toString() === '') {
      this.purchaseProducts.DeliveryType = 'NULL';
    }

    if (this.purchaseProducts.PaymentType === null || this.purchaseProducts.PaymentType === undefined || this.purchaseProducts.PaymentType.toString() === '') {
      this.purchaseProducts.PaymentType = 'NULL';
    }

    if (this.purchaseProducts.DeliveryTime === null || this.purchaseProducts.DeliveryTime === undefined || this.purchaseProducts.DeliveryTime.toString() === '') {
      this.purchaseProducts.DeliveryTime = 'NULL';
    }
    this.purchaseProducts.items = JSON.parse(sessionStorage.getItem('cart_items'));
    this.purchaseProducts.VendorName = sessionStorage.getItem('sellerName');

    console.log(this.purchaseProducts);
    this.buyProductsService.savePurchaseProduct(this.purchaseProducts).subscribe(data => {

      this.ProductsResponse = data;
      this.toastr.success('Your Order Is Placed');
      sessionStorage.removeItem('cart_items');
      sessionStorage.removeItem('categoryId');
      sessionStorage.removeItem('address_id');
      this.openDialog();
      this.emitterService.isProductIsAddedOrRemoved.emit(true);
      this.purchaseProducts.DeliveryDate = this.prevDeliveryDate;
    });

  }

  GoToCart() {
    this.router.navigate(['buyProducts/goToCart']);
  }
  goToCategories() {
    this.router.navigate(['/buyProducts/categories']);
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

  getRandomNumbers() {
    var minm = 100000;
    var maxm = 999999;
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    // return Math.floor(100000 + Math.random() * 900000);
  }


  openDialog() {
    this.dialog.open(DialogOrderNoComponent, {
      height: '150px',
      width: '400px',
      data: this.purchaseProducts.OrderNo,
      disableClose: true
    });
  }

  goToCategoriesPage() {
    this.router.navigate(['buyProducts/categories']);
  }

  clearValues() {
    this.selectedAddressId = '';
    this.address.name = '';
    this.address.mobileNumber = 0;
    this.address.houseNo = '';
    this.address.society = '';
    this.address.landMark = '';
    this.address.pinCode = 0;
    this.address.city = '';
    this.address.area = '';
    this.address.state = '';
    this.isAddressSelected = false;
  }

}
