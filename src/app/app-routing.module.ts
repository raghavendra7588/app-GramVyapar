import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddressDetailDataComponent } from './buy-products/address-detail-data/address-detail-data.component';
import { CategoriesHomeComponent } from './buy-products/categories-home/categories-home.component';
import { GoToCartComponent } from './buy-products/go-to-cart/go-to-cart.component';
import { MyOrdersComponent } from './buy-products/my-orders/my-orders.component';
import { LoginComponent } from './user/login/login.component';



const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'buyProducts/categories', component: CategoriesHomeComponent},
  { path: 'buyProducts/goToCart', component: GoToCartComponent },
  { path: 'buyProducts/addressDetailsData', component: AddressDetailDataComponent },
  { path: 'buyProducts/myOrder', component: MyOrdersComponent },
  {
    path: '**',
    redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
