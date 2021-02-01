import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EmitterService } from 'src/app/shared/emitter.service';
import { UpdateEmail } from '../buy-products.model';
import { BuyProductsService } from '../buy-products.service';

@Component({
  selector: 'app-dialog-edit-email',
  templateUrl: './dialog-edit-email.component.html',
  styleUrls: ['./dialog-edit-email.component.css']
})
export class DialogEditEmailComponent implements OnInit {

  userData: any = [];
  userForm: FormGroup;
  updateEmail: UpdateEmail = new UpdateEmail();

  constructor(
    public formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogEditEmailComponent>,
    public buyProductsService: BuyProductsService,
    public toastr: ToastrService,
    public emitterService: EmitterService
  ) {

    this.userForm = this.formBuilder.group({
      mobileNumber: [''],
      emailid: ['']
    });

    this.userData = data;
    this.assignAddressData();
  }

  ngOnInit(): void {
  }


  assignAddressData() {
    if (this.userData) {

      this.updateEmail.mobilenumber = this.userData.mobilenumber;
      this.updateEmail.emailid = this.userData.emailid;
    }
  }


  onSubmit() {
    if (this.updateEmail.emailid === null || this.updateEmail.emailid === undefined || this.updateEmail.emailid === '') {
      this.updateEmail.emailid = '';
    }

    this.buyProductsService.updateEmailId(this.updateEmail).subscribe(res => {
      this.toastr.success('Record Updated Successfully');  
      this.emitterService.isEmailIDUpdated.emit(this.updateEmail);
      this.dialogRef.close();
    });
  }
}
