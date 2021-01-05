
export class AddressDetails {
    id: string;
    name: string;
    mobilenumber: string;
    flatNo: string;
    societyName: string;
    locality: string;
    areaName: string;
    pincode: string;
    state: string;
    city: string;
    userId: string;
    primaryAddressFlag: string;
}

export class OrderedItems {
    Discount: string;
    FinalPrice: string;
    MRP: string;
    Quantity: string;
    RequiredQuantity: number;
    Unit: string;
    brandImageUrl: any;
    brandid: string;
    id: string;
    imgurl: any;
    name: string;
    productid: string;
}

export class PurchaseProducts {
    PurchaseProductId?: number;
    VendorCode?: string;
    VendorName?: string;
    SellerId?: number;
    OrderNo?: string;
    OrderDate?: string;
    DeliveryDate?: any;
    AddressId?: number;
    DeliveryType?: string;
    PaymentType?: string;
    DeliveryTime?: string;
    items?: Array<PurchaseProductsItems>;
}

export class PurchaseProductsItems {
    SellerId?: number;
    CategoryId?: number;
    SubCategoryId?: number;
    BrandId?: number;
    ProductId?: number;
    Discount?: number;
    FinalPrice?: number;
    MRP?: number;
    Quantity?: number;
    RequiredQuantity
    Unit?: string;
    id?: number;
    name?: string;
    VendorCode?: string;
}

export class MyOrders {
    vendorName?: string;
    vendorCode?: string;
    sellerId?: string;
    OrderDate?: any;
    DeliveryDate?: any;
    orderNo?: string;
}

export class EditMyOrder {
    PurchaseProductId?: number;
    PurchaseProductsItemId?: number;
    name?: string;
    Unit?: string;
    MRP?: number;
    Discount?: number;
    FinalPrice?: number;
    RequiredQuantity?: number;
    Quantity?: number;
    NewQuantity?: number;
    categoryid?: number;
    id?: number;
    productid?: number;
    brandId?: number;
    categoryId?: number;
}

export class DeleteMyOrder {
    PurchaseProductId?: number;
    PurchaseProductsItemId?: number;
}


export class PlaceOrder {
    deliverySlot: string;
    paymentType: string;
    societyName: string;
    flatNo: string;
    pincode: string;
    city: string;
    state: string;
    overallDiscount: number;
    LanguageCode: string;
    cartid: string;
    locality: string;
    deliveryType: string;
    deliveryUpto: string;
    userid: string;
    mobilenumber: string;
    vendorCode: string;
    deliveryCharges: number;
    status: string;
    isactive: string;
    areaName: string;
    name: string;
    referralAmountUsed: number;
    deliveredDate: string;
    cartDetails: Array<CartItems>;
}

export class CartItems {
    id: string;
    cartid: string;
    productVarientid: string;
    mrp: string;
    quantity: string;
    discount: string;
    finalPrice: string;
}

export class ProductName {
    Name: string;
}

export class PaymentInformation {
    productinfo: string;
    firstname: string;
    email: string;
    phone: string;
    amount: string;
}

export class GenerateHashKey {
    amount: string;
    firstname: string;
    email: string;
    phone: string;
    productinfo: string;
    surl: string;
    furl: string;
    mode: string;
    udf1: string;
    txnid: string;
}

export class PaymentForm {
    productName: string;
    name: string;
    email: string;
    amount: string;
    phone: string;
    surl: string;
    furl: string;
    key: string;
    hash: string;
    txnid: string;
    serviceProvider: string;
}

export class PaymentFormUpdated {
    productinfo: string;
    firstname: string;
    email: string;
    amount: string;
    phone: string;
    Surl: string;
    Furl: string;
    Key: string;
    hash: string;
    Txnid: string;
    service_provider: string;
    udf1: string;
}


export class PaymentGateWay {
    productinfo: string;
    Name: string;
    EmailID: string;
    Amount: string;
    mobilno: string;
    TransationID: string;
}

export class PaymentModel {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    amount: string;
    productinfo: string;
    txnid: number;
    surl: string;
    furl: string;
    hash: any;
    service_provider: string;

    constructor() {
        this.furl = 'https://www.payumoney.com/mobileapp/payumoney/failure.php';
        this.surl = 'https://www.payumoney.com/mobileapp/payumoney/success.php';
        this.txnid = this.getRandomInt();
    }

    getRandomInt() {
        return Math.floor(100000 + Math.random() * 900000);
    }
}