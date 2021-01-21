import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PaymentModel, ProductName } from './buy-products.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BuyProductsService {


  masterDataArray: any = [];
  masterDataResonseArray: any = [];
  pUrl: string = '';
  private ADMIN_BASE_URL = 'https://3intellects.co.in/Uat_AdminApi/api/';

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
  private GET_ALL_DATA_BY_PRODUCT_NAME = this.ADMIN_BASE_URL + 'Product/GetAllProductList';
  private GET_PRODUCT_SEARCH = this.ADMIN_BASE_URL + 'Product/GetProductSearch';
  private GET_HASH_KEY = this.ADMIN_BASE_URL + 'Transaction/GetHashKey';
  private PAYMENT_GATEWAY = 'https://sandboxsecure.payu.in/_payment';
 
  public API_BASE_URL = environment.apiBaseUrl;

  PAYMENT_GATEWAY_URL = 'https://3intellects.co.in/uat_AdminApi/payU.aspx';

  constructor(public http: HttpClient) { }

  getAllData(vendorcode: string) {
    const data = { "categoryid": "0", "subcategoryid": "0", "brandid": "0", "vendorCode": vendorcode.toString() }

    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(this.GET_PRODUCT_LIST, data, { headers: reqHeader });
  }


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

  getAllMasterDataByProductName(sellerId: string): Observable<Array<ProductName>> {
    const data = {
      "SellerId": sellerId
    }
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<Array<ProductName>>(this.GET_ALL_DATA_BY_PRODUCT_NAME, data, { headers: reqHeader });
  }

  getProductSearch(userId: string, productName: string, vendorCode: string) {
    const data = {
      userid: userId,
      hotkeyword: productName,
      vendorCode: vendorCode
    }
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(this.GET_PRODUCT_SEARCH, data, { headers: reqHeader });
  }

  getHashKey(hashKeyRequest) {
    return this.http.post(this.GET_HASH_KEY, hashKeyRequest);
  }

  httpHeader = {
    headers: new HttpHeaders({
      'NoAuth': 'True',
      'Access-Control-Allow-Origin': '**',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
      'Access-Control-Allow-Credentials': 'true'
    })
  };


  paymentGateWay(gateWayRequest) {
    return this.http.post(this.PAYMENT_GATEWAY, gateWayRequest);
  }

  get(url): Observable<any> {
    return this.http.get(this.API_BASE_URL + url);
  }

  post(url, body: any): Observable<any> {
    return this.http.post(this.API_BASE_URL + url, body, this.httpHeader);
  }

  put(url, body: any): Observable<any> {
    return this.http.put(this.API_BASE_URL + url, body, this.httpHeader);
  }

  delete(url): Observable<any> {
    return this.http.delete(this.API_BASE_URL + url, this.httpHeader);
  }
  createPayment(paymentRequest) {

    let reqHeader = new HttpHeaders({
      'NoAuth': 'True',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
      'Access-Control-Allow-Credentials': 'true'
    });

    return this.http.post('https://test.payu.in/_payment', paymentRequest, { headers: reqHeader });
  }

  postPaymenGatewayUrl(Amount, TransactionID, Name, EmailID, mobileno) {
    let params = new HttpParams()
      .append('Amount', Amount.toString())
      .append('TransactionID', TransactionID.toString())
      .append('Name', Name.toString())
      .append('EmailID', EmailID.toString())
      .append('mobileno', mobileno.toString());

    return this.http.post(this.PAYMENT_GATEWAY, { params });
  }

}
