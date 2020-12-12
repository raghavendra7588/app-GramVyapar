import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';



import { CategoriesHomeComponent } from './categories-home/categories-home.component';
import { GoToCartComponent } from './go-to-cart/go-to-cart.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { AddressDetailDataComponent } from './address-detail-data/address-detail-data.component';
import { DialogAddAddressComponent } from './dialog-add-address/dialog-add-address.component';
import { ToastrModule } from 'ngx-toastr';
import { BuyProductsService } from './buy-products.service';
import { DialogOrderNoComponent } from './dialog-order-no/dialog-order-no.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DialogMyOrdersViewComponent } from './dialog-my-orders-view/dialog-my-orders-view.component';
import { DialogMyOrdersEditComponent } from './dialog-my-orders-edit/dialog-my-orders-edit.component';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { NumberDirective } from './number.directive';
import { DialogEditAddressComponent } from './dialog-edit-address/dialog-edit-address.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxScrollTopModule } from 'ngx-scrolltop';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { PaymentComponent } from './payment/payment.component';
import { MatMomentDateModule, MomentDateAdapter } from "@angular/material-moment-adapter";

export const DateFormat = {
  parse: {
    dateInput: 'input',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'MM/DD/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

@NgModule({
  declarations: [CategoriesHomeComponent, GoToCartComponent, MyOrdersComponent, AddressDetailDataComponent,
    DialogAddAddressComponent,
    DialogOrderNoComponent,
    DialogMyOrdersViewComponent,
    DialogMyOrdersEditComponent,
    NumberDirective,
    DialogEditAddressComponent,
    PaymentComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    MatTableModule,
    MatCardModule,
    MatMenuModule,
    MatExpansionModule,
    MatDialogModule,
    MatRadioModule,
    MatDatepickerModule,
    MatDividerModule,
    MatListModule,
    MatCheckboxModule,
    MatPaginatorModule,
    NgbPaginationModule,
    MatAutocompleteModule,
    NgxSpinnerModule,
    AutocompleteLibModule,
    ToastrModule.forRoot({
      timeOut: 1200,
      preventDuplicates: true,
      // positionClass: 'toast-bottom-right'
    }),
    ModalModule.forRoot(),
    MatNativeDateModule,
    Ng2SearchPipeModule,
    NgxScrollTopModule
  ],
  exports: [CategoriesHomeComponent, GoToCartComponent, MyOrdersComponent, AddressDetailDataComponent],
  entryComponents: [DialogAddAddressComponent, DialogOrderNoComponent, DialogMyOrdersViewComponent, DialogMyOrdersEditComponent,
    DialogEditAddressComponent, PaymentComponent],
  providers: [BuyProductsService,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DateFormat }],

})
export class BuyProductsModule { }
