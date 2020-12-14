import { AfterViewInit, Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BuyProductsService } from '../buy-products.service';
import { MatPaginator } from '@angular/material/paginator';
// import { EmitterService } from 'src/shared/emitter.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EmitterService } from 'src/app/shared/emitter.service';
import { ProductName } from '../buy-products.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-categories-home',
  templateUrl: './categories-home.component.html',
  styleUrls: ['./categories-home.component.css']
})
export class CategoriesHomeComponent implements OnInit {

  // displayedColumns: string[] = ['name', 'brandname', 'selectVarient', 'mrp',
  //   'discount', 'finalPrice', 'requiredQuantity', 'add'];


  // displayedColumns: string[] = ['name', 'brandname', 'selectVarient', 'mrp',
  //   'discount', 'requiredQuantity', 'add'];


  displayedColumns: string[] = ['name', 'brandname', 'selectVarient', 'finalPrice',
    'requiredQuantity', 'add'];
    ProductForm: FormGroup;
  dataSource: any;
  searchResult: any;
  patientCategory: FormGroup;
  isDataLoaded: boolean = false;
  categoryListData: any = [];
  parentId: string;
  vendorId: string;
  subCategoryListData: any = [];
  groceryArray: any = [];
  sweetMartArray: any = [];
  brandsData: any = [];
  subCategoryId: string;
  selectedSubCategory: any;
  selectedCategory: any = [];
  selectedBrands: any;
  purchaseProductArray: any = [];
  catchResponse: any = [];
  availableQuantity: any;
  selectedProductId: any;
  productForm: FormGroup;
  mrp = 0;
  discount = 0;
  finalPrice = 0;
  uniqueBrandNamesArray: any = [];
  catchBrandArray: any = [];
  productsArray: any = [];
  totalNoOfProducts: number;
  totalProducts: number;
  showInitialProductDetails: boolean;
  finalProductDetails: boolean;
  selectedValue: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  requiredQuantity: boolean = false;
  fakeRequiredQuantity: boolean = true;
  categoryIdArray: any = [];
  uniqueCategoriesArray: any = [];
  cartItems: any = [];
  selectedIndex: number;

  allBrandsData: any = [];
  allSubCategoryData: any = [];
  sellerId: string;
  categoryId: string;
  SubCategoryId: string;
  brandId: string;
  isQuantityValid: number;
  name: any;
  responseVendorCode: any;
  responseSellerId: any;
  responseVendorName: any;
  vendorResponse: any = [];
  cartid: string;
  tableData: any = [];

  page = 1;
  pageSize = 15;
  collectionSize: any;
  countries: any;
  isHomeDelivery: string;
  homeDeliveryLimit: number;

  quantityList: any = [];
  selectedQuantity: number;
  totalOrder: string;

  isFirstTime: boolean;
  vendorContactNo: string;

  productName: ProductName = new ProductName();
  // masterProductName: Array<ProductName>;
  masterProductName: Array<any>;
  allProductNameData: Array<any>;

  myControl = new FormControl();
  filteredOptions: Observable<ProductName[]>;
  keyword = 'name';
  userId: string;

  productSearchData: any = [];
  autoCompleteResponse: any = [];
  // page = 1;
  // pageSize = 4;
  // collectionSize = COUNTRIES.length;
  // countries: Country[];
  txtVarient: any = [];
  constructor(
    public formBuilder: FormBuilder,
    public buyProductsService: BuyProductsService,
    private router: Router,
    public emitterService: EmitterService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.productForm = this.fb.group({
      varient: this.fb.array(['', Validators.required ])
   });
    this.activatedRoute.queryParams.subscribe(params => {
      this.name = params['name']
    });
    if ("isFirstTime" in sessionStorage) {
      this.isFirstTime = false;
      // this.spinner.show();
    }
    else {
      this.isFirstTime = true;
    }

    this.emitterService.isFirstTimeUser.subscribe(value => {
      if (value) {

        if ("isFirstTime" in sessionStorage) {
          this.isFirstTime = false;
          // this.spinner.show();
        }
        else {
          this.isFirstTime = true;
        }
      }
    });

    sessionStorage.setItem('vendorName', this.name);
    this.spinner.show();
    this.buyProductsService.getVendorDetails(this.name).subscribe(response => {

      this.vendorResponse = response;
      this.responseVendorCode = this.vendorResponse.vendorcode;
      this.responseSellerId = this.vendorResponse.id;
      this.responseVendorName = this.vendorResponse.name;
      this.isHomeDelivery = this.vendorResponse.homedelivery;
      this.homeDeliveryLimit = Number(this.vendorResponse.homedeliverylimit);
      this.vendorContactNo = this.vendorResponse.mobilenumber;
      // this.totalOrder = "0";

      sessionStorage.setItem('sellerName', this.responseVendorName);
      sessionStorage.setItem('vendorId', this.responseVendorCode);
      sessionStorage.setItem('sellerId', this.responseSellerId);
      sessionStorage.setItem('isHomeDelivery', this.isHomeDelivery);
      sessionStorage.setItem('homeDeliveryLimit', this.homeDeliveryLimit.toString());
      sessionStorage.setItem('onlineYN', this.vendorResponse.onlineYN);
      sessionStorage.setItem('creditYN', this.vendorResponse.creditYN);
      sessionStorage.setItem('vendorContactNo', this.vendorContactNo);
      this.emitterService.isVendorContactNumber.emit(true);
      // sessionStorage.setItem('totalOrder', this.totalOrder);

      // this.getMasterProductNameData(this.responseVendorCode);
      this.buyProductsService.getAllMasterDataByProductName(this.responseVendorCode).subscribe(response => {

        this.masterProductName = response;
        this.masterProductName = this.createCustomProductName(this.masterProductName);
        this.allProductNameData = this.masterProductName;
        this.spinner.hide();
      });


      this.parentId = '0';
      this.vendorId = sessionStorage.getItem('vendorId');
      this.emitterService.isValidateResponse.emit(true);
      this.buyProductsService.getAllCategory(this.vendorId).subscribe(data => {

        this.categoryListData = data;
        // this.isDataLoaded = true;
        this.checkCartItems(this.categoryListData);
      });
    });
    this.parentId = '0';
    this.vendorId = sessionStorage.getItem('vendorId');



    // this.buyProductsService.getAllCategory(this.parentId, this.vendorId).subscribe(data => {

    //   this.categoryListData = data;

    //   this.checkCartItems(this.categoryListData);
    // });

    this.patientCategory = this.fb.group({
      patientCategory: [null, Validators.required]
    });

    this.showInitialProductDetails = true;
    this.finalProductDetails = false;
    this.cartItems = JSON.parse(sessionStorage.getItem('cart_items'));

    if (this.cartItems === null || this.cartItems === undefined || this.cartItems === []) {

      return;
    }
    else {

      for (let i = 0; i < this.cartItems.length; i++) {
        this.categoryIdArray.push(this.cartItems[i].categoryid);
      }

      this.uniqueCategoriesArray = [... new Set(this.categoryIdArray)];
      let numberArray = this.uniqueCategoriesArray.map(Number);
      this.uniqueCategoriesArray = numberArray;

      this.totalProductsCalculation(this.cartItems);
    }

    this.refreshCountries();

  }

  ngOnInit(): void {
    this.quantityList = [
      { id: 0, title: 1 },
      { id: 1, title: 2 },
      { id: 2, title: 3 },
      { id: 3, title: 4 },
      { id: 4, title: 5 }
    ];


  }
  createCustomProductName(arr) {
    let customResponse: any = [];
    for (let i = 0; i < arr.length; i++) {
      var products = { id: i, name: arr[i].Name, CategoryId: arr[i].CategoryId, SubCategoryId: arr[i].SubCategoryId, BrandId: arr[i].BrandId };
      customResponse.push(products);
    }
    return customResponse
  }
  selectEvent(item) {
    let productName = item.name;
    this.userId = "0";
    this.selectedSubCategory = "";
    this.selectedBrands = "";
    this.brandsData = [];
    this.uniqueBrandNamesArray = [];
    this.spinner.show();
    this.buyProductsService.getProductSearch(this.userId, productName, this.responseVendorCode).subscribe(response => {

      this.productSearchData = response;
      let customResponse = this.createCustomBrandsDataResponse(this.productSearchData);
      this.autoCompleteResponse = customResponse;
      this.brandsData = customResponse;
      console.log('res', customResponse);
      this.assignData()
      this.spinner.hide();
      this.isDataLoaded = true;
    });
  }
  assignData() {
    this.brandsData = this.autoCompleteResponse;
  }

  onChangeSearch(search: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    // this.brandsData = this.autoCompleteResponse;
  }

  onFocused(e) {
    // do something
  }

  displayFn(product) {
    return product && product.Name ? product.Name : '';
  }

  private _filter(Name: string): any {
    const filterValue = Name.toLowerCase();

    return this.masterProductName.filter(option => option.Name.toLowerCase().indexOf(filterValue) === 0);
  }

  totalProductsCalculation(arr) {
    let items = 0;
    if (arr) {
      for (let i = 0; i < arr.length; i++) {
        items += Number(arr[i].RequiredQuantity);
      }
      this.totalNoOfProducts = items;
      return items;
    }
    else {
      this.totalNoOfProducts = 0;
      return items = 0;
    }

  }
  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator
  }

  checkCartItems(arr) {
    if ((this.cartItems === null || this.cartItems === undefined || this.cartItems === [])) {
      this.categoryListData;
      return;
    }
    else {
      let particularCategories: any = [];

      this.categoryListData = [];
      arr.filter(item => {

        if (this.uniqueCategoriesArray.includes(Number(item.id))) {
          particularCategories = item;
          this.categoryListData.push(particularCategories);
        }

      });
    }

  }


  // getCategoryListData() {
  //   this.buyProductsService.getAllCategory(this.parentId, this.vendorId).subscribe(data => {
  //     this.categoryListData = data;
  //   });
  // }

  getSubCategoryListData() {
    this.parentId = '3';
    this.buyProductsService.getAllSubCategory(this.parentId, this.vendorId).subscribe(data => {
      this.subCategoryListData = data;

      this.parentId = '0';
    });
  }
  onCategoriesClick(response) {

    this.subCategoryId = response.id;
    this.getAllBrandsData();
  }



  getAllBrandsData() {
    this.brandId = "0";
    let uniqueBrandNames: any = [];
    this.brandsData = [];

    this.buyProductsService.getAllProduct(this.categoryId, this.subCategoryId, this.brandId, this.vendorId).subscribe(response => {

      this.brandsData = response;
      this.catchBrandArray = response;
      let customResponse = this.createCustomBrandsDataResponse(this.brandsData);
      this.brandsData = customResponse;

      this.tableData = this.brandsData;
      this.collectionSize = this.brandsData.length;

      this.dataSource = new MatTableDataSource(this.brandsData);
      this.dataSource.paginator = this.paginator;

      uniqueBrandNames = this.createUniqueBrandName(this.brandsData);
      this.uniqueBrandNamesArray = this.sortUniqueBrandName(uniqueBrandNames);
      this.spinner.hide();
    });
  }


  selectedCategoryFromList(response) {
    this.parentId = response.id;
    this.categoryId = response.id;
    this.spinner.show();
    this.selectedSubCategory = "";
    this.selectedBrands = "";
    this.brandsData = [];
    this.masterProductName = this.allProductNameData;
    this.filterProductSearch(this.categoryId);
    this.buyProductsService.getAllSubCategory(this.parentId, this.vendorId).subscribe(data => {
      this.subCategoryListData = data;
      this.parentId = '0';
      this.spinner.hide();
      // this.getAllSubCategoryData();
    });
  }

  selectedSubCategoryFromList(response) {
    this.subCategoryId = response.id;
    this.SubCategoryId = response.id;
    this.isDataLoaded = true;
    this.selectedBrands = '';
    this.spinner.show();
    // this.filterProductSearchBySubCategoryId(this.SubCategoryId);
    this.getAllBrandsData();
  }

  selectedBrandFromList(response) {
    this.brandsData = [];
    this.spinner.show();
    let filteredBrandArray = this.catchBrandArray.filter(function (item) {
      return item.brandname.trim() === response.brandname.trim() && item.brandid === response.brandid;
    });
    this.productsArray = filteredBrandArray;
    this.brandsData = this.productsArray;
    this.spinner.hide();
    this.dataSource = new MatTableDataSource(this.productsArray);
    this.dataSource.paginator = this.paginator;
  }

  selectedVarientFromList(response, i) {

    this.availableQuantity = 'False';
    this.selectedIndex = i;
    // document.getElementById("mrp" + response.productid).innerHTML = response.productDetails[i].MRP;
    document.getElementById("finalPrice" + response.productid).innerHTML = (Number(response.productDetails[i].FinalPrice)).toString();
    // document.getElementById("discount" + response.productid).innerHTML = response.productDetails[i].Discount;
    this.showInitialProductDetails = false;
    this.finalProductDetails = true;

    // for (let i = 0; i < this.brandsData.length; i++) {
    //   for (let j = 0; j < response.productDetails.length; j++) {
    //     if (Number(response.productid) === Number(this.brandsData[i].productid) &&
    //       (response.name) === (this.brandsData[i].name) &&
    //       Number(response.brandid) === Number(this.brandsData[i].brandid)
    //     ) {
    //    
    //       response.productDetails[j].Unit = this.brandsData[i].productDetails[j].Unit;
    //     }
    //   }
    // }
    this.selectedProductId = response.productid;
    this.availableQuantity = response.productDetails[i].outOfStockFlag;

  }

  selectedProductNameFromList(response) {
    // console.log('you selected', response);
  }


  onQuantityChange(response, quantity, i,productForm) {

    if (productForm === undefined || productForm === null) {
      i = 0;
      this.toastr.error('Please select varient');
      return;
    }

    if (this.availableQuantity === 'True') {
      this.toastr.error('Currently this Product is Out of Stock');
      return;
    }

    this.purchaseProductArray = JSON.parse(sessionStorage.getItem('cart_items') || '[]');


    if ("cart_items" in sessionStorage) {
      if (Number(this.purchaseProductArray[0].categoryid) != Number(response.categoryid)) {
        this.toastr.error('Two Different Category Products Can Not Be Ordered Together');
        return;
      }

    } else {
      //console.log("");
    }

    if (Number(quantity) > 0) {

      // this.catchResponse = this.pushProduct(this.purchaseProductArray, response, i);
      this.catchResponse = this.pushProduct(this.purchaseProductArray, response, this.selectedIndex);
      this.purchaseProductArray = this.catchResponse;
      this.selectedQuantity = 0;
      sessionStorage.setItem('cart_items', JSON.stringify(this.purchaseProductArray));
      this.toastr.success('Product is Added Into Cart');
      this.totalProductsCalculation(this.purchaseProductArray);
      // this.selectedIndex = undefined;
      this.emitterService.isProductIsAddedOrRemoved.emit(true);
    }
    else {
      this.toastr.error('Check Quantity');
    }

  }

  // pushProduct(arr, response, j) {

  //   let sellerID = sessionStorage.getItem('sellerId');
  //   let vendorCode = sessionStorage.getItem('vendorId');

  //   if (j === undefined) {
  //     j = 0;
  //   }


  //   // let productItemsObj = {
  //   //   deliverySlot: "", paymentType: "", status: "", isactive: "Y",
  //   //   cartDetails: [{
  //   //     ImageVersion: "0", cartid: "0", discount: response.productDetails[j].Discount.toString(),
  //   //     finalPrice: response.productDetails[j].FinalPrice.toString(), id: response.productDetails[j].id.toString(),
  //   //     mrp: response.productDetails[j].MRP.toString(),
  //   //     productVarientid: 1662, quantity: response.mappingid
  //   //   }],
  //   //   LanguageCode: "en", cartid: "0", deliveryUpto: "", deliveredDate: "", deliveryType: "", userid: sellerID.toString(),
  //   //   vendorCode: vendorCode.toString()
  //   // }


  //   arr.push({
  //     brandImageUrl: response.brandImageUrl, imgurl: response.imgurl, name: response.name,
  //     brandid: response.brandid, productid: response.productid,
  //     id: response.productDetails[j].id, Unit: response.productDetails[j].Unit, Discount: response.productDetails[j].Discount,
  //     FinalPrice: response.productDetails[j].FinalPrice, MRP: response.productDetails[j].MRP, Quantity: response.productDetails[j].Quantity,
  //     RequiredQuantity: response.mappingid, categoryid: response.categoryid
  //   });
  //   // this.buyProductsService.addToCartItems(productItemsObj).subscribe(res => {
  //   //   // this.cartid = res.cartid;
  //   //   this.toastr.success('Product is Added Into Cart');
  //   // });


  //   return arr;
  // }


  pushProduct(arr, response, j) {

    let sellerID = sessionStorage.getItem('sellerId');
    let vendorCode = sessionStorage.getItem('vendorId');

    if (j === undefined) {
      j = 0;
    }

    const index = arr.findIndex((o) => o.productid === response.productid && o.id === response.productDetails[j].id);

    if (index === -1) {                 //not exist


      // arr.push({
      //   brandImageUrl: response.brandImageUrl, imgurl: response.imgurl, name: response.name,
      //   brandid: response.brandid, productid: response.productid,
      //   id: response.productDetails[j].id, Unit: response.productDetails[j].Unit, Discount: response.productDetails[j].Discount,
      //   FinalPrice: response.productDetails[j].FinalPrice, MRP: response.productDetails[j].MRP, Quantity: response.productDetails[j].Quantity,
      //   RequiredQuantity: response.mappingid, categoryid: response.categoryid
      // });

      arr.push({
        name: response.name,
        brandid: response.brandid,
        productid: response.productid,
        id: response.productDetails[j].id,
        Unit: response.productDetails[j].Unit,
        Discount: response.productDetails[j].Discount,
        FinalPrice: response.productDetails[j].FinalPrice,
        MRP: response.productDetails[j].MRP,
        Quantity: response.productDetails[j].Quantity,
        RequiredQuantity: response.mappingid,
        categoryid: response.categoryid
        // id: "0",
        // cartid: "0",
        // productVarientid: response.productDetails[j].id,
        // mrp: response.productDetails[j].MRP,
        // quantity: response.productDetails[j].Quantity,
        // discount:response.productDetails[j].Discount,
        // finalPrice: response.productDetails[j].FinalPrice
      });

    } else {


      for (let i = 0; i < arr.length; i++) {
        if (arr[i].productid === response.productid && arr[i].id === response.productDetails[j].id) {
          // arr[i].RequiredQuantity = arr[i].RequiredQuantity + response.mappingid;
          arr[i].RequiredQuantity = response.mappingid;
          arr[i].brandImageUrl = response.brandImageUrl;
          arr[i].imgurl = response.imgurl;
          arr[i].name = response.name;
          arr[i].id = response.productDetails[j].id;
          arr[i].Unit = response.productDetails[j].Unit;
          arr[i].Discount = response.productDetails[j].Discount;
          arr[i].FinalPrice = response.productDetails[j].FinalPrice;
          arr[i].MRP = response.productDetails[j].MRP;
          arr[i].Quantity = response.productDetails[j].Quantity
          arr[i].categoryid = response.categoryid
        }
      }
    }
    // console.table('unique storage array', arr);
    return arr;
  }



  applyFilterOnKey(filter: string) {
    this.dataSource.filter = filter.trim().toLowerCase();
  }


  applyFilter() {
    this.dataSource.filter = this.searchResult.trim().toLowerCase();
  }

  goCart() {
    this.router.navigate(['/buyProducts/goToCart']);
  }


  createUniqueBrandName(array: any) {

    let sortedArray: Array<any> = [];
    for (let i = 0; i < array.length; i++) {
      if ((sortedArray.findIndex(p => p.brandname.trim() == array[i].brandname.trim())) == -1) {
        var item = {
          brandname: array[i].brandname.trim(), subcategoryid: array[i].subcategoryid, brandid: array[i].brandid,
          productid: array[i].productid
        }
        sortedArray.push(item);
      }
    }
    return sortedArray;
  }


  sortUniqueBrandName(array) {
    array.sort((a, b) => {
      return a.brandname.localeCompare(b.brandname);
    });
    return array
  }

  onBrandSelectAll() {
    this.brandId = "0";
    this.brandsData = [];
    this.selectedIndex = 0;
    this.spinner.show();
    this.buyProductsService.getALLBrandData(this.vendorId, this.categoryId, this.SubCategoryId, this.brandId).subscribe(response => {
      this.allBrandsData = response;
      this.brandsData = this.allBrandsData;
      this.dataSource = new MatTableDataSource(this.allBrandsData);
      this.dataSource.paginator = this.paginator;
      this.spinner.hide();
    });
  }

  onSubCategorySelectAll() {
    this.brandId = "0";
    this.SubCategoryId = "0";
    this.selectedIndex = 0;
    this.uniqueBrandNamesArray = [];

    this.buyProductsService.getALLSubCaetgoryData(this.vendorId, this.categoryId, this.SubCategoryId, this.brandId).subscribe(response => {

      this.allSubCategoryData = response;
      this.brandsData = this.allSubCategoryData;
      setTimeout(() => this.brandsData = response);
      // this.brandsData = response;

      this.dataSource = new MatTableDataSource(this.allSubCategoryData);
      this.dataSource.paginator = this.paginator;
    });

    // this.dataSource = new MatTableDataSource(this.allSubCategoryData);
    // this.dataSource.paginator = this.paginator;
  }
  getAllSubCategoryData() {
    this.brandId = "0";
    this.SubCategoryId = "0";
    this.selectedIndex = 0;
    this.uniqueBrandNamesArray = [];


    this.buyProductsService.getALLSubCaetgoryData(this.vendorId, this.categoryId, this.SubCategoryId, this.brandId).subscribe(response => {
      this.allSubCategoryData = response;
    });
  }

  createCustomBrandsDataResponse(array) {
    for (let i = 0; i < array.length; i++) {
      array[i].mappingid = "0";
    }
    return array;
  }


  refreshCountries() {
    this.countries = this.tableData
      .map((country, i) => ({ id: i + 1, ...country }))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  selectedQuantityFromList(product: any, response: any) {

    this.selectedQuantity = Number(product.title);
    response.mappingid = this.selectedQuantity.toString();
  }

  filterProductSearch(categoryId: string) {
    let filteredProductSearch: any = [];
    filteredProductSearch = this.masterProductName.filter(item => {
      return Number(item.CategoryId) === Number(categoryId)
    });

    this.masterProductName = filteredProductSearch;

  }

  filterProductSearchBySubCategoryId(subCategoryId: string) {

    let filteredProductSearch: any = [];

    filteredProductSearch = this.allProductNameData.filter(item => {
      return Number(item.SubCategoryId) === Number(subCategoryId)
    });

    this.masterProductName = filteredProductSearch;

  }
}
