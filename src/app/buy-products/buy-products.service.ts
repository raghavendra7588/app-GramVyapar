import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BuyProductsService {

  // private BASE_URL = 'http://203.112.144.38/uat_InventoryService/';
  private BASE_URL = 'http://localhost:55547/';

  private GET_PRODUCT_LIST = 'http://203.112.144.38/AdminApi/api/Product/GetProductList';
  private GET_ALL_CATEGORY_DATA = 'http://203.112.144.38/AdminApi/api/Category/getall';
  private GET_ALL_SUBCATEGORIES_DATA = 'http://203.112.144.38/AdminApi/api/Category/getall';
  private GET_PRODUCT_INFORMATION = 'http://203.112.144.38/AdminApi/api/Product/GetProductInfo';
  private INSERT_ADDRESS_DATA = this.BASE_URL + 'api/APPAddress';
  private GET_ADDRESS_DATA_BY_ID = this.BASE_URL + 'api/APPAddress';
  private INSERT_PURCHASE_PRODUCT = this.BASE_URL + 'api/PurchaseProducts';
  private GET_ADDRESS_BASED_ON_PINCODE = 'http://203.112.144.38/uat_AdminApi/api/Pincode/GetCityState';
  private GET_ALL_MY_ORDERS_DATA = this.BASE_URL + 'api/MyOrders/getMyOrders';
  private GET_ALL_MY_ORDERS_DATA_BY_PURCHASE_PRODUCT_ID = this.BASE_URL + 'api/MyOrders';
  private UPDATE_MY_ORDERS_DATA = this.BASE_URL + 'api/MyOrders/editMyOrders';
  private DELETE_MY_ORDERS_DATA = this.BASE_URL + 'api/MyOrders/deleteMyOrders';

  private GET_ALL_SUBCATEGORY_DATA = 'http://203.112.144.38/uat_AdminApi/api/Product/GetProductList';
  private GET_ALL_BRAND_DATA = 'http://203.112.144.38/uat_AdminApi/api/Product/GetProductList';
  private GET_VENDOR_DETAILS = 'http://203.112.144.38/uat_AdminApi/api/User/GetVendorDetails';



  constructor(public http: HttpClient) { }



  getAllCategory(parentid: string, vendorcode: string) {
    const data = {
      "parentid": parentid,
      "vendorcode": vendorcode
    }
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(this.GET_ALL_CATEGORY_DATA, data, { headers: reqHeader });
  }

  getAllSubCategory(parentid: string, vendorcode: string) {

    const data = {
      "parentid": parentid,
      "vendorcode": vendorcode
    }
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(this.GET_ALL_SUBCATEGORIES_DATA, data, { headers: reqHeader });
  }


  getAllProduct(subcategoryid: string, vendorCode: string) {
    const data = { 'vendorCode': vendorCode, subcategoryid: subcategoryid }
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(this.GET_PRODUCT_LIST, data, { headers: reqHeader });
  }

  getProductInformation(id: string, vendorCode: string) {
    const data = { 'id': id, 'vendorCode': vendorCode }
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(this.GET_PRODUCT_INFORMATION, data, { headers: reqHeader });
  }

  getAddressDetailsBasedOnPinCode(pinCode: string) {
    const data = { 'pincode': pinCode }
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(this.GET_ADDRESS_BASED_ON_PINCODE, data, { headers: reqHeader });
  }

  insertAddressData(addressData) {
    return this.http.post(this.INSERT_ADDRESS_DATA, addressData);
  }

  getAddressDataById(vendorId) {
    return this.http.get(this.GET_ADDRESS_DATA_BY_ID + '/' + vendorId);
  }

  savePurchaseProduct(purchaseProductData) {
    return this.http.post(this.INSERT_PURCHASE_PRODUCT, purchaseProductData);
  }

  getALLOrdersData(MyOrdersData) {
    return this.http.post(this.GET_ALL_MY_ORDERS_DATA, MyOrdersData);
  }

  getAllOrdersDataByPurchaseProductId(PurchaseProductId: number) {
    return this.http.get(this.GET_ALL_MY_ORDERS_DATA_BY_PURCHASE_PRODUCT_ID + '/' + PurchaseProductId);
  }

  updateOrdersData(MyOrdersData) {
    return this.http.post(this.UPDATE_MY_ORDERS_DATA, MyOrdersData);
  }

  deleteMyOrdersData(MyOrdersData) {
    return this.http.post(this.DELETE_MY_ORDERS_DATA, MyOrdersData);
  }

  getALLSubCaetgoryData(vendorCode: string, categoryid: string, subcategoryid: string, brandid: string) {
    const data = { 'vendorCode': vendorCode, 'categoryid': categoryid, 'subcategoryid': subcategoryid, 'brandid': brandid }
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(this.GET_ALL_SUBCATEGORY_DATA, data, { headers: reqHeader });
  }


  getALLBrandData(vendorCode: string, categoryid: string, subcategoryid: string, brandid: string) {
    const data = { 'vendorCode': vendorCode, 'categoryid': categoryid, 'subcategoryid': subcategoryid, 'brandid': brandid }
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(this.GET_ALL_BRAND_DATA, data, { headers: reqHeader });
  }

  getVendorDetails(name:string) {
    const data = { 'name': name}
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(this.GET_VENDOR_DETAILS, data, { headers: reqHeader });
  }
}
