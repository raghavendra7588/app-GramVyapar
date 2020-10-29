import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddressDetails } from 'src/app/buy-products/buy-products.model';
import { BuyProductsService } from '../buy-products.service';
import { ToastrService } from 'ngx-toastr';
import { EmitterService } from 'src/app/shared/emitter.service';


@Component({
  selector: 'app-dialog-add-address',
  templateUrl: './dialog-add-address.component.html',
  styleUrls: ['./dialog-add-address.component.css']
})
export class DialogAddAddressComponent implements OnInit {

  addressForm: FormGroup;
  address: AddressDetails = new AddressDetails();
  addressData: any;
  maxLengthPhone = 10;
  maxLengthPinCode = 6;
  isPinCode: boolean = false;
  isName: boolean = false;
  isMobileNo: boolean = false;
  addressResponse: any;

  constructor(
    public formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogAddAddressComponent>,
    public buyProductsService: BuyProductsService,
    public toastr: ToastrService,
    public emitterService: EmitterService) {

    this.addressForm = this.formBuilder.group({
      name: [''],
      mobileNumber: [''],
      houseNo: [''],
      society: [''],
      landMark: [''],
      pinCode: [''],
      city: [''],
      area: [''],
      state: ['']
    });

    this.addressData = data;
    this.address.mobilenumber = this.addressData.mobilenumber;
    this.isMobileNo = true;
    console.log('got address data ***', this.addressData);
    this.assignAddressData();

  }

  ngOnInit(): void {
    this.address.mobilenumber = this.addressData.mobilenumber;
    this.isMobileNo = true;
    // this.address.sellerId = Number(sessionStorage.getItem('sellerId'));
  }

  onSubmit() {
    if (this.address.name === null || this.address.name === undefined || this.address.name === '') {
      this.address.name = 'NULL';
    }
    if (this.address.mobilenumber === null || this.address.mobilenumber === undefined) {
      this.address.mobilenumber = "NULL";
    }
    if (this.address.flatNo === null || this.address.flatNo === undefined || this.address.flatNo === '') {
      this.address.flatNo = 'NULL';
    }
    if (this.address.societyName === null || this.address.societyName === undefined || this.address.societyName === '') {
      this.address.societyName = 'NULL';
    }
    if (this.address.locality === null || this.address.locality === undefined || this.address.locality === '') {
      this.address.locality = 'NULL';
    }
    if (this.address.pincode === null || this.address.pincode === undefined) {
      this.address.pincode = "NULL";
    }
    if (this.address.city === null || this.address.city === undefined || this.address.city === '') {
      this.address.city = 'NULL';
    }
    if (this.address.areaName === null || this.address.areaName === undefined || this.address.areaName === '') {
      this.address.areaName = 'NULL';
    }
    if (this.address.state === null || this.address.state === undefined || this.address.state === '') {
      this.address.state = 'NULL';
    }
    this.address.id = "0";
    this.address.userId = sessionStorage.getItem('customerId').toString();
    this.address.primaryAddressFlag = "";

    this.buyProductsService.addUserAddress(this.address).subscribe(data => {
      this.addressResponse = data;
      this.toastr.success('Record Submitted Successfully');
      this.emitterService.addedAddressData.emit(this.addressResponse);
      this.emitterService.isAddressCreated.emit(true);
      this.dialogRef.close();
    });
  }

  assignAddressData() {
    if (this.addressData) {
      this.address.name = this.addressData.name;
      this.address.mobilenumber = this.addressData.mobileNumber;
      this.address.flatNo = this.addressData.houseNO;
      this.address.societyName = this.addressData.society;
      this.address.locality = this.addressData.landmark;
      this.address.pincode = this.addressData.pincode;
      this.address.city = this.addressData.city;
      this.address.areaName = this.addressData.area;
      this.address.state = this.addressData.state;
      this.address.id = this.addressData.id;
    }
  }

  getPinCode() {
    let pinCodeBasedData: any = [];
    this.buyProductsService.getAddressDetailsBasedOnPinCode(this.address.pincode.toString()).subscribe(response => {
      pinCodeBasedData = response;
      this.address.areaName = pinCodeBasedData.city;
      this.address.state = pinCodeBasedData.state;
      this.isPinCode = true;
    });
  }

  nameInput() {
    this.isName = true;
  }
  mobileNumberInput() {
    this.isMobileNo = true;
  }

  closeDialog() {
    this.dialogRef.close();
    this.emitterService.isAddressCreated.emit(true);
  }
}
