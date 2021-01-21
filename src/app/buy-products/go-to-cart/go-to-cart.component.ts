import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';


import { AddressDetails, CartItems, OrderedItems, PaymentGateWay, PlaceOrder, PurchaseProducts } from '../buy-products.model';
import { BuyProductsService } from '../buy-products.service';
import { ToastrService } from 'ngx-toastr';

import { MatDialog } from '@angular/material/dialog';
import { DialogAddAddressComponent } from '../dialog-add-address/dialog-add-address.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { EmitterService } from 'src/app/shared/emitter.service';
import { DialogOrderNoComponent } from '../dialog-order-no/dialog-order-no.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DialogEditAddressComponent } from '../dialog-edit-address/dialog-edit-address.component';
// import { PaymentComponent } from '../payment/payment.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AppDateAdapter } from './format-datepicker';



@Component({
  selector: 'app-go-to-cart',
  templateUrl: './go-to-cart.component.html',
  styleUrls: ['./go-to-cart.component.css']
})
export class GoToCartComponent implements OnInit {

  dataSource: any;
  modalRef: BsModalRef;
  modalReff: BsModalRef;


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
  placeOrderData: PlaceOrder = new PlaceOrder();
  cartItemsData: CartItems = new CartItems();

  isDisplay: boolean;
  cartLength: number;

  isAddressSelected: boolean = false;

  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = ['select', 'name', 'quantity', 'finalPrice', 'requiredQuantity', 'update', 'delete'];

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

  message: string;
  deleteRecordResponse: any;

  isDeliveryType: boolean = false;
  ispaymentType: boolean = false;
  isDeliveryDate: boolean = false;
  isDeliveryTime: boolean = false;
  events: string[] = [];
  vendorName: string;
  mobileNo: any;
  customerId: string;
  verifyUserDetails: any = [];
  isMobileNumberEntered: boolean = false;

  purchaseProducts: PurchaseProducts = new PurchaseProducts();
  payuform: PaymentGateWay = new PaymentGateWay();
  maxLengthPhone = 10;

  placeOrderResponse: any = [];
  disableCondition: boolean;
  updateResponse: any = [];

  isHomeDelivery: string;
  homeDeliveryLimit: number;

  creditYN: string;
  onlineYN: string;
  selectedDeliveryType: string;
  totalOrder: number;
  prevTotalOrder: number;
  isMobileNoValid: boolean = false;
  mobileNoLength: number;
  isOnlineSelected: string;
  disablePaymentButton: boolean = true;
  payuUrl: string = 'https://3intellects.co.in/uat_AdminApi/payU.aspx';
  txnid: string;
  isOnlineTransactionModeSelected: boolean = false;
  isHidden: boolean = true;
  makePayment: boolean = false;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public emitterService: EmitterService,
    public buyProductsService: BuyProductsService,
    public toastr: ToastrService,
    public dialog: MatDialog,
    private modalService: BsModalService
  ) {
    this.vendorName = sessionStorage.getItem('vendorName');

    this.emitterService.isProductRemoved.subscribe(value => {
      if (value) {
        this.getCartItems();
        if (this.cartItems.length === 0 || this.cartItems === null || this.cartItems === undefined || this.cartItems === []) {
          this.isDisplay = false;
        }
      }
    });

    this.emitterService.isAddressCreated.subscribe(value => {
      if (value) {
        this.getCartItems();

        this.clearValues();
        if (this.addressData.length === 0 || this.addressData === undefined || this.addressData === null) {
          this.isAddressSelected = false;
          this.addressSelected = false;
          this.isMobileNumberEntered = false;
        }
      }
    });


    this.emitterService.addedAddressData.subscribe(value => {
      if (value) {

        this.addressData = value.addresses;
        if (this.addressData.length === 0 || this.addressData === undefined || this.addressData === null) {
          this.isAddressSelected = false;
          this.addressSelected = false;
        }
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
      this.cartLength = 0;
    }
    else {
      this.isDisplay = true;
    }
    this.payableCalculation(this.cartItems);

    this.creditYN = sessionStorage.getItem('creditYN');
    this.onlineYN = sessionStorage.getItem('onlineYN');

    this.vendorId = sessionStorage.getItem('vendorId');
    this.currentAddressId = Number(sessionStorage.getItem('address_id'));
    this.purchaseProducts.AddressId = Number(sessionStorage.getItem('address_id'));
    this.purchaseProducts.OrderNo = (this.getRandomNumbers()).toString();

    this.orderDate = new Date();
    let orderDate = this.convertDate(this.orderDate);
    this.purchaseProducts.OrderDate = orderDate;

    this.deliveryType = [
      { id: 0, type: 'Pickup' },
      { id: 1, type: 'Home Delivery' }
    ];


    if (this.creditYN === "Y") {
      this.paymentType = [
        { id: 0, type: 'Cash' },
        { id: 1, type: 'Credit' }
      ];

    }
    else {
      this.paymentType = [
        { id: 0, type: 'Cash' }
      ];
    }
    if (this.onlineYN === "Y") {
      this.paymentType.push({ id: 2, type: 'Online' });
    }

    this.deliveryTime = [
      { id: 0, type: '9.00 AM - 1.00PM', minHour: 9, maxHour: 13 },
      { id: 1, type: '1.00 PM - 5.00PM', minHour: 13, maxHour: 17 },
      { id: 2, type: '5.00 PM - 9.00PM', minHour: 17, maxHour: 21 },
      { id: 3, type: 'Anytime Ok', minHour: 0, maxHour: 24 }
    ];


  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${type}: ${event.value}`);
    this.isDeliveryDate = true;

  }

  openModal(template: TemplateRef<any>, response) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.deleteRecordResponse = response;

  }

  openUpdateModal(template: TemplateRef<any>, response) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.updateResponse = response;
  }

  openConfirmModal(template: TemplateRef<any>) {
    this.modalReff = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {

    this.message = 'Confirmed!';
    this.deleteRecord(this.deleteRecordResponse);
    this.modalRef.hide();
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
    return;
  }

  updateConfirm() {
    this.message = 'Confirmed!';
    this.updateSingleQuantity(this.updateResponse);
    this.modalRef.hide();
  }

  confirmUser(): void {
    this.message = 'Confirmed!';
    this.modalReff.hide();
  }

  declineUser(): void {
    this.message = 'Declined!';
    this.router.navigate(['/login']);
    this.modalReff.hide();
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


    let prevStorageArray: any = [];
    let finalStorageArray: any = [];
    prevStorageArray = JSON.parse(sessionStorage.getItem('cart_items'));

    finalStorageArray = this.mergeOrderItems(prevStorageArray, this.multipleEntries);
    sessionStorage.removeItem('cart_items');
    sessionStorage.setItem('cart_items', JSON.stringify(finalStorageArray));

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

    this.currentlySelectedAddress = response;

    this.address.name = response.name;
    this.address.mobilenumber = response.mobilenumber;
    this.address.flatNo = response.flatNo;
    this.address.societyName = response.societyName;
    this.address.locality = response.locality;
    this.address.pincode = response.pincode;
    this.address.areaName = response.areaName;
    this.address.city = response.city;
    this.address.state = response.state;
    this.addressId = response.id.toString();
    this.purchaseProducts.AddressId = Number(response.id);
    this.isAddressSelected = true;
    this.addressSelected = true;
    this.payuform.Name = response.name;
    this.payuform.mobilno = response.mobilenumber;
    this.payuform.Amount = this.totalPayableAmount.toString();
   
    this.disablePaymentButton = true;
  }

  getCartItems() {
    this.cartItems = JSON.parse(sessionStorage.getItem('cart_items'));
    this.dataSource = new MatTableDataSource(this.cartItems);
    this.dataSource.paginator = this.paginator;
    if (this.cartItems === null || this.cartItems === undefined || this.cartItems === []) {
      this.isDisplay = false;
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
    this.router.navigate(['buyProducts/categories' + '/' + this.vendorName]);
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

      this.payableCalculation(this.cartItems);
    }


  }

  incrementQuantity(response, i) {
    let currentQuantity: any;
    currentQuantity = Number((document.getElementById("qunatity" + i) as HTMLInputElement).value);
    currentQuantity += 1;
    document.getElementById("qunatity" + i).innerHTML = currentQuantity;
    response.RequiredQuantity = currentQuantity;

  }


  deleteRecord(response) {

    let storageArray = JSON.parse(sessionStorage.getItem('cart_items'));
    let finalStorageArray = storageArray.filter(data => {
      return data.productid != response.productid && data.id != response.id
    });
    sessionStorage.removeItem('cart_items');
    sessionStorage.setItem('cart_items', JSON.stringify(finalStorageArray));

    if (finalStorageArray.length === 0 || finalStorageArray === undefined || finalStorageArray === null || finalStorageArray === []) {
      sessionStorage.removeItem('cart_items');
    }


    this.emitterService.isProductRemoved.emit(true);
    this.payableCalculation(finalStorageArray);
    this.emitterService.isProductIsAddedOrRemoved.emit(true);
  }

  selectedDeliveryTypeFromList(response) {

    this.isDeliveryType = true;
    this.selectedDeliveryType = response.type;


  }

  selectedPaymentTermFromList(response) {
    this.ispaymentType = true;
    if (this.purchaseProducts.PaymentType === 'Online') {
      this.isOnlineTransactionModeSelected = true;
       this.toastr.info('Kindly Enter Email ID', '', {
      timeOut: 3000,
      positionClass: 'toast-bottom-right'
    });
      this.disablePaymentButton = true;
      sessionStorage.setItem("isOnlineSelected", "true");
    }
    if (this.purchaseProducts.PaymentType === 'Credit') {
      this.isOnlineTransactionModeSelected = false;
    }
    if (this.purchaseProducts.PaymentType === 'Cash') {
      this.isOnlineTransactionModeSelected = false;
    }
    else {
      if ("isOnlineSelected" in sessionStorage) {
        sessionStorage.removeItem("isOnlineSelected");
      }
    }
  }

  selectedDeliveryTimeFromList(response) {
    this.isDeliveryTime = true;
    this.selectedTimeSlot = response.id;
  }


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

    for (let i = 0; i < this.deliveryTime.length; i++) {

      if (this.deliveryTime[i].id === this.selectedTimeSlot) {
        minTimeSlot = this.deliveryTime[i].minHour;
        maxTimeSlot = this.deliveryTime[i].maxHour;
      }
    }
    if ((formattedTodaysDate === selectedDeliveryDate)) {
      if (currentHour >= maxTimeSlot) {
        this.toastr.error('Check Delivery Time');
        return;
      }

    }

    let userid = sessionStorage.getItem('customerId');
    let vendorCode = sessionStorage.getItem('vendorId');
    let selectedProductStorageArray = JSON.parse(sessionStorage.getItem('cart_items'));

    let ProductStorageArray: any = [];
    ProductStorageArray = this.createProductArray(selectedProductStorageArray);

    let formattedDeliveryDate = this.convertDateInYMD(this.purchaseProducts.DeliveryDate);


    let placOrderObj = {
      deliverySlot: this.purchaseProducts.DeliveryTime,
      paymentType: this.purchaseProducts.PaymentType,
      societyName: this.currentlySelectedAddress.societyName,
      flatNo: this.currentlySelectedAddress.flatNo,
      pincode: this.currentlySelectedAddress.pincode,
      city: this.currentlySelectedAddress.city,
      state: this.currentlySelectedAddress.state,
      overallDiscount: 0,
      LanguageCode: "en",
      cartid: "0",
      locality: this.currentlySelectedAddress.locality,
      deliveryType: this.purchaseProducts.DeliveryType,
      deliveryUpto: formattedDeliveryDate,
      userid: userid,
      mobilenumber: this.mobileNo,
      vendorCode: vendorCode,
      deliveryCharges: 0,
      status: "ConfirmOrder",
      isactive: "Y",
      areaName: this.currentlySelectedAddress.areaName,
      name: this.currentlySelectedAddress.name,
      referralAmountUsed: 0,
      deliveredDate: "",
      cartDetails: ProductStorageArray
    }

    this.isHomeDelivery = sessionStorage.getItem('isHomeDelivery');
    this.homeDeliveryLimit = Number(sessionStorage.getItem('homeDeliveryLimit'));
    let homeDeliveryValueLimit = this.homeDeliveryLimit;


    if (this.isHomeDelivery === 'N') {
      this.toastr.error('Home Delivery Not Available For this Seller', 'Important', { positionClass: 'toast-bottom-right' });
      return;
    }


    if (this.totalPayableAmount <= this.homeDeliveryLimit && this.selectedDeliveryType === "Home Delivery") {

      this.toastr.error(`Home Delivery Is Available Above ${homeDeliveryValueLimit} Amount`, 'Important', { positionClass: 'toast-bottom-right' });
      return;
    }

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
    this.isOnlineSelected = sessionStorage.getItem("isOnlineSelected");
    sessionStorage.removeItem('totalPayableAmount');
    sessionStorage.setItem('totalPayableAmount', this.totalPayableAmount.toString());
    if (this.isOnlineSelected === "true") {
      sessionStorage.removeItem('placOrderObj');
      sessionStorage.setItem('placOrderObj', JSON.stringify(placOrderObj));
      // this.dialog.open(PaymentComponent, {
      //   width: '600px',
      //   height: '630px',
      //   data: placOrderObj,
      //   disableClose: true
      // });
      this.purchaseProducts.DeliveryDate = new Date(this.prevDeliveryDate);
    }
    else {
      this.buyProductsService.placeOrderData(placOrderObj).subscribe(response => {
        this.placeOrderResponse = response;
        this.toastr.success('Your Order Is Placed');
        this.openDialog();
        sessionStorage.removeItem('cart_items');
        sessionStorage.removeItem('category_array');
        this.purchaseProducts.DeliveryDate = new Date(this.prevDeliveryDate);
        this.emitterService.isProductIsAddedOrRemoved.emit(true);
        sessionStorage.setItem('isExisting', 'true');
        sessionStorage.removeItem('totalOrder');
        sessionStorage.removeItem("isOnlineSelected");
        this.prevTotalOrder = Number(this.prevTotalOrder + 1);
        sessionStorage.setItem('totalOrder', this.prevTotalOrder.toString());
      });
    }


  }
  createProductArray(selectedProductStorageArray) {
    let arr: any = [];

    let totalFinalPrice = 0;



    for (let i = 0; i < selectedProductStorageArray.length; i++) {


      totalFinalPrice = ((selectedProductStorageArray[i].MRP - selectedProductStorageArray[i].Discount) * selectedProductStorageArray[i].RequiredQuantity);






      var itemsObj = {
        id: "0",
        cartid: "0",
        productVarientid: selectedProductStorageArray[i].id,
        mrp: selectedProductStorageArray[i].MRP,
        quantity: selectedProductStorageArray[i].RequiredQuantity,
        discount: selectedProductStorageArray[i].Discount,
        finalPrice: totalFinalPrice
      }
      arr.push(itemsObj);
    }
    return arr;
  }

  GoToCart() {
    this.router.navigate(['buyProducts/goToCart']);
  }
  goToCategories() {
    let shopName = sessionStorage.getItem('vendorName').toString();
    this.router.navigate(['/buyProducts/categories'], { queryParams: { name: shopName } });
  }

  convertDate(receivedDate) {
    let date = new Date(receivedDate);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    const stringDate = [day, month, year].join("-");
    let fullDate = stringDate;
    return fullDate
  }

  convertDateInYMD(receivedDate) {
    let date = new Date(receivedDate);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    // const stringDate = [year, month, day].join("/");
    const stringDate = [day, month, year].join("-");
    let fullDate = stringDate;
    return fullDate
  }


  getRandomNumbers() {
    var minm = 100000;
    var maxm = 999999;
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
  }


  openDialog() {
    this.dialog.open(DialogOrderNoComponent, {
      height: '150px',
      width: '400px',
      data: this.placeOrderResponse,
      disableClose: true
    });
  }

  goToCategoriesPage() {

    let shopName = sessionStorage.getItem('vendorName').toString();
    this.router.navigate(['/buyProducts/categories'], { queryParams: { name: shopName } });
  }

  clearValues() {
    this.selectedAddressId = '';
    this.address.name = '';
    this.address.mobilenumber = '';
    this.address.flatNo = '';
    this.address.societyName = '';
    this.address.locality = '';
    this.address.pincode = '';
    this.address.city = '';
    this.address.areaName = '';
    this.address.state = '';
    this.isAddressSelected = false;
  }

  checkUser() {
    this.dialog.open(DialogAddAddressComponent, {
      height: '400px',
      width: '800px'
    });
  }

  verifyUserData() {
    this.buyProductsService.verifyUserDetails(this.mobileNo).subscribe(response => {
      sessionStorage.removeItem('totalOrder');
      this.verifyUserDetails = response;

      this.customerId = this.verifyUserDetails.customerId;
      sessionStorage.setItem('customerId', this.customerId);
      this.isMobileNumberEntered = true;
      this.prevTotalOrder = Number(this.verifyUserDetails.TotalOrder);

      if (this.prevTotalOrder === 0) {
      }
      else {
        sessionStorage.setItem('totalOrder', this.prevTotalOrder.toString());
      }



      this.selectedAddressId = '';
      this.clearValues();
      this.addressData = [];
      if (this.verifyUserDetails.addresses.length === 0 || this.verifyUserDetails.addresses === undefined
        || this.verifyUserDetails.addresses === null) {
        this.dialog.open(DialogAddAddressComponent, {
          height: '400px',
          width: '800px',
          data: this.verifyUserDetails
        });
      }

      else {
        this.toastr.info('Kindly Select Desire Address From The List', 'Important', { positionClass: 'toast-bottom-right' });
        this.addressData = this.verifyUserDetails.addresses;
      }

    });
  }

  editAddress() {

    this.dialog.open(DialogEditAddressComponent, {
      height: '400px',
      width: '800px',
      data: this.currentlySelectedAddress
    });
  }

  updateSingleQuantity(response) {

    let inputValue = Number(response.RequiredQuantity);
    let availableQty = Number(response.Quantity);
    let productId = Number(response.productid);
    let id = Number(response.id);


    if (inputValue < 1) {
      this.toastr.error('check Quantity');
    }
    else {
      if (inputValue > availableQty) {
        this.toastr.error('Quantity Exceeds than Available');
      }
      else {
        response.RequiredQuantity = inputValue.toString();

        let cartItemResponse = JSON.parse(sessionStorage.getItem('cart_items'));
        for (let i = 0; i < cartItemResponse.length; i++) {
          if (Number(cartItemResponse[i].productid) === productId && Number(cartItemResponse[i].id) === id) {

            cartItemResponse[i].RequiredQuantity = inputValue.toString();
          }
        }

        sessionStorage.removeItem('cart_items');
        sessionStorage.setItem('cart_items', JSON.stringify(cartItemResponse));

        this.payableCalculation(cartItemResponse);
        this.toastr.success('Product Is Updated');
        this.emitterService.isProductIsAddedOrRemoved.emit(true);

      }
    }
  }




  mobileNoCount() {

    this.mobileNoLength = Number(this.mobileNo.length);

    if (this.mobileNoLength === 10) {
      this.isMobileNoValid = true;
    }
    else {
      this.isMobileNoValid = false;
    }
  }

  confirmPayment() {
    let date = new Date();
    this.txnid = ('web' + 'txnid' + date.getMilliseconds());
    let url = new URL(this.payuUrl);
    url.searchParams.set('Name', this.payuform.Name);
    url.searchParams.set('EmailID', this.payuform.EmailID);
    url.searchParams.set('Amount', this.payuform.Amount);
    url.searchParams.set('mobileno', this.payuform.mobilno.toString());
    url.searchParams.set('TransationID', this.txnid.toString());

    this.payuUrl = url.href;
    this.buyProductsService.pUrl = url.href;
    console.log(this.buyProductsService.pUrl);

    this.disablePaymentButton = false;
    this.makePayment = true;
  }



}