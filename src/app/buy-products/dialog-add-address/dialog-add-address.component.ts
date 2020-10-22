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
    console.log('receeived data', data);
    this.addressData = data;
    this.assignAddressData();

  }

  ngOnInit(): void {

    this.address.sellerId = Number(sessionStorage.getItem('sellerId'));
  }

  onSubmit() {
    if (this.address.name === null || this.address.name === undefined || this.address.name === '') {
      this.address.name = 'NULL';
    }
    if (this.address.mobileNumber === null || this.address.mobileNumber === undefined) {
      this.address.mobileNumber = 0;
    }
    if (this.address.houseNo === null || this.address.houseNo === undefined || this.address.houseNo === '') {
      this.address.houseNo = 'NULL';
    }
    if (this.address.society === null || this.address.society === undefined || this.address.society === '') {
      this.address.society = 'NULL';
    }
    if (this.address.landMark === null || this.address.landMark === undefined || this.address.landMark === '') {
      this.address.landMark = 'NULL';
    }
    if (this.address.pinCode === null || this.address.pinCode === undefined) {
      this.address.pinCode = 0;
    }
    if (this.address.city === null || this.address.city === undefined || this.address.city === '') {
      this.address.city = 'NULL';
    }
    if (this.address.area === null || this.address.area === undefined || this.address.area === '') {
      this.address.area = 'NULL';
    }
    if (this.address.state === null || this.address.state === undefined || this.address.state === '') {
      this.address.state = 'NULL';
    }
    this.address.vendorId = sessionStorage.getItem('vendorId');
    console.log((sessionStorage.getItem('vendorId')));
    console.log(this.address);

    this.buyProductsService.insertAddressData(this.address).subscribe(data => {
      this.toastr.success('Record Submitted Successfully');
      this.emitterService.isAddressCreated.emit(true);
      this.dialogRef.close();
    });
  }

  assignAddressData() {
    if (this.addressData) {
      this.address.name = this.addressData.name;
      this.address.mobileNumber = this.addressData.mobileNumber;
      this.address.houseNo = this.addressData.houseNO;
      this.address.society = this.addressData.society;
      this.address.landMark = this.addressData.landmark;
      this.address.pinCode = this.addressData.pincode;
      this.address.city = this.addressData.city;
      this.address.area = this.addressData.area;
      this.address.state = this.addressData.state;
      this.address.id = this.addressData.id;
      this.address.sellerId = this.addressData.sellerId;
      this.address.vendorId = this.addressData.vendorId;
    }
  }

  getPinCode() {
    console.log('input pinCode', this.address.pinCode);
    let pinCodeBasedData: any = [];
    this.buyProductsService.getAddressDetailsBasedOnPinCode(this.address.pinCode.toString()).subscribe(response => {
      console.log('response', response);
      pinCodeBasedData = response;
      this.address.area = pinCodeBasedData.city;
      this.address.state = pinCodeBasedData.state;
    });
  }

}
