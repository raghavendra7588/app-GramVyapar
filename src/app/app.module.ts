import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from './layout/layout.module';
import { UserModule } from './user/user.module';
import { BuyProductsModule } from './buy-products/buy-products.module';
import { SharedModule } from './shared/shared.module';


import { BuyProductsService } from './buy-products/buy-products.service';
import { EmitterService } from './shared/emitter.service';
import { UserService } from './user/user.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    UserModule,
    BuyProductsModule,
    SharedModule
  ],
  providers: [BuyProductsService, EmitterService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
