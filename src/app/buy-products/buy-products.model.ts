export class AddressDetails {
    id: number;
    sellerId: number;
    vendorId: string;
    name: string;
    mobileNumber: number;
    houseNo: string;
    society: string;
    landMark: string;
    pinCode: number;
    city: string;
    area: string;
    state: string;
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
    DeliveryDate?: string;
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
