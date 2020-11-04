import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BuyProductsService {

  //private BASE_URL = 'http://localhost:55547/';

  private BASE_URL = 'https://3intellects.co.in/uat_InventoryService/';
  private ADMIN_BASE_URL = 'https://3intellects.co.in/uat_AdminApi/api/';

  private GET_PRODUCT_LIST = this.ADMIN_BASE_URL + 'Product/GetProductList';
  private GET_ALL_CATEGORY_DATA = this.ADMIN_BASE_URL + 'Category/getsellercategories';
  private GET_ALL_SUBCATEGORIES_DATA = this.ADMIN_BASE_URL + 'Category/getall';
  private GET_PRODUCT_INFORMATION = this.ADMIN_BASE_URL + 'Product/GetProductInfo';
  private GET_ADDRESS_BASED_ON_PINCODE = this.ADMIN_BASE_URL + 'Pincode/GetCityState';
  private GET_ALL_SUBCATEGORY_DATA = this.ADMIN_BASE_URL + 'Product/GetProductList';
  private GET_ALL_BRAND_DATA = this.ADMIN_BASE_URL + 'Product/GetProductList';
  private GET_VENDOR_DETAILS = this.ADMIN_BASE_URL + 'User/GetVendorDetails';
  private VERIFY_USER = this.ADMIN_BASE_URL + 'User/GetUserDetailsWithMobileNumber';
  private ADD_USER_ADDRESS = this.ADMIN_BASE_URL + 'User/AddAddress';
  private PLACE_ORDER_API = this.ADMIN_BASE_URL + 'Cart/ConfirmOrder';
  private GET_ORDER_LIST_DATA = this.ADMIN_BASE_URL + 'Order/GetCustomerOrderList';

  private GET_ALL_MY_ORDERS_DATA = this.BASE_URL + 'api/MyOrders/getMyOrders';
  private GET_ALL_MY_ORDERS_DATA_BY_PURCHASE_PRODUCT_ID = this.BASE_URL + 'api/MyOrders';
  private UPDATE_MY_ORDERS_DATA = this.BASE_URL + 'api/MyOrders/editMyOrders';
  private DELETE_MY_ORDERS_DATA = this.BASE_URL + 'api/MyOrders/deleteMyOrders';
  private INSERT_ADDRESS_DATA = this.BASE_URL + 'api/APPAddress';
  private GET_ADDRESS_DATA_BY_ID = this.BASE_URL + 'api/APPAddress';
  private INSERT_PURCHASE_PRODUCT = this.BASE_URL + 'api/PurchaseProducts';
  


  constructor(public http: HttpClient) { }



  getAllCategory(vendorcode: string) {
    const data = {
      "vendorCode": vendorcode
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


  getAllProduct(categoryId: string, subcategoryid: string, brandId: string, vendorCode: string) {
    const data = { 'categoryid': categoryId, 'subcategoryid': subcategoryid, 'brandid': brandId, 'vendorCode': vendorCode }
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

  getVendorDetails(name: string) {
    const data = { 'name': name }
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(this.GET_VENDOR_DETAILS, data, { headers: reqHeader });
  }

  addToCartItems(cartData) {
    return this.http.post(this.GET_ALL_BRAND_DATA, cartData);
  }


  verifyUserDetails(contactNumber: string) {
    const data = { 'mobilenumber': contactNumber }
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(this.VERIFY_USER, data, { headers: reqHeader });
  }

  addUserAddress(addressData) {
    return this.http.post(this.ADD_USER_ADDRESS, addressData);
  }

  placeOrderData(placeOrder) {
    return this.http.post(this.PLACE_ORDER_API, placeOrder);
  }

  getMyOrdersData(languageCode: string, userId: string) {
    const data = { "LanguageCode": languageCode, "userId": userId }
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(this.GET_ORDER_LIST_DATA, data, { headers: reqHeader });
  }

}
