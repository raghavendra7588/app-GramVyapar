import { AfterViewInit, Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BuyProductsService } from '../buy-products.service';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EmitterService } from 'src/app/shared/emitter.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-categories-home',
  templateUrl: './categories-home.component.html',
  styleUrls: ['./categories-home.component.css']
})
export class CategoriesHomeComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['name', 'brandname'];

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

  masterData: any = [];
  masterDataResponse: any = [];


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

    this.activatedRoute.queryParams.subscribe(params => {
      this.name = params['name']
    });

    sessionStorage.setItem('vendorName', this.name);


    if ("isFirstTime" in sessionStorage) {
      this.isFirstTime = false;
      this.spinner.show();
    }
    else {
      this.isFirstTime = true;
    }

    this.emitterService.isFirstTimeUser.subscribe(value => {
      if (value) {

        if ("isFirstTime" in sessionStorage) {
          this.isFirstTime = false;
          this.spinner.show();
        }
        else {
          this.isFirstTime = true;
        }
      }
    });
    // this.spinner.show();

    this.buyProductsService.getVendorDetails(this.name).subscribe(response => {

      this.vendorResponse = response;
      this.responseVendorCode = this.vendorResponse.vendorcode;
      this.responseSellerId = this.vendorResponse.id;
      this.responseVendorName = this.vendorResponse.name;
      this.isHomeDelivery = this.vendorResponse.homedelivery;
      this.homeDeliveryLimit = Number(this.vendorResponse.homedeliverylimit);
      this.vendorContactNo = this.vendorResponse.mobilenumber;



      sessionStorage.setItem('sellerName', this.responseVendorName);
      sessionStorage.setItem('vendorId', this.responseVendorCode);
      sessionStorage.setItem('sellerId', this.responseSellerId);
      sessionStorage.setItem('isHomeDelivery', this.isHomeDelivery);
      sessionStorage.setItem('homeDeliveryLimit', this.homeDeliveryLimit.toString());
      sessionStorage.setItem('onlineYN', this.vendorResponse.onlineYN);
      sessionStorage.setItem('creditYN', this.vendorResponse.creditYN);
      sessionStorage.setItem('vendorContactNo', this.vendorContactNo);
      this.emitterService.isVendorContactNumber.emit(true);

      this.parentId = '0';
      this.vendorId = sessionStorage.getItem('vendorId');
      this.emitterService.isValidateResponse.emit(true);

      //required
      // this.buyProductsService.getAllCategory(this.vendorId).subscribe(data => {

      //   this.categoryListData = data;
      //   console.log('inside get api api call &&&', this.categoryListData);

      //   //required
      //   //  this.checkCartItems(this.categoryListData);
      // });

      // this.emitterService.masterResponse.subscribe(response => {
      //   if (response) {
      //     console.log('master data emitter', response);
      //   }
      // });

      if ("isFirstTime" in sessionStorage) {
        
        this.categoryListData = JSON.parse(sessionStorage.getItem('category_array'));
        this.masterData = this.buyProductsService.masterDataArray;
        
        
        this.responseVendorCode = sessionStorage.getItem("vendorId");
        let masterDataLengthCount = sessionStorage.getItem("master_data");
        
        if (this.isFirstTime === false) {
          

          if (this.masterData === null || this.masterData === undefined || this.masterData === [] || Number(masterDataLengthCount) < 1 || !this.masterData.length) {
           
            this.masterData = this.getAllProductsData(this.responseVendorCode);
            console.log('due to page refresh master called', this.masterData);
          }
          else {
            console.log('2nd time masterData', this.buyProductsService.masterDataResonseArray);
            this.masterData = this.buyProductsService.masterDataResonseArray;
            this.categoryListData = this.createUniqueCategoriesName(this.masterData);
            console.log('2nd time cat list data unique array', this.categoryListData);
            this.checkCartItems(this.categoryListData);
            this.spinner.hide();

          }
        }


      }
      else {
        console.log('no data for category array');
        this.masterData = this.getAllProductsData(this.responseVendorCode);
      }



    });
    // console.log('i will excecute');
    this.parentId = '0';
    this.vendorId = sessionStorage.getItem('vendorId');


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
  }

  checkCartItems(arr) {
    if ((this.cartItems === null || this.cartItems === undefined || this.cartItems === [])) {
      this.categoryListData;
      return;
    }
    else {
      let particularCategories: any = [];

      this.categoryListData = [];
      console.log('uniqueCategoriesArray', this.uniqueCategoriesArray);
      arr.filter(item => {

        if (this.uniqueCategoriesArray.includes(Number(item.id))) {
          particularCategories = item;
          this.categoryListData.push(particularCategories);

        }
        console.log('category array', this.categoryListData);
      });
    }

  }



  getSubCategoryListData() {
    this.parentId = '3';
    //required
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

    });
  }


  selectedCategoryFromList(response) {
    console.log('category selected', response);
    this.parentId = response.id;
    this.categoryId = response.id;

    this.createUniqueSubCategoriesName(this.categoryId);
    //required
    // this.buyProductsService.getAllSubCategory(this.parentId, this.vendorId).subscribe(data => {
    //   this.subCategoryListData = data;
    //   this.parentId = '0';

    // });
  }

  selectedSubCategoryFromList(response) {
    console.log('sub category response', response);
    this.subCategoryId = response.subcategoryid;
    this.SubCategoryId = response.subcategoryid;
    this.isDataLoaded = true;
    // this.getAllBrandsData();

    this.createUniqueBrands(this.categoryId, this.SubCategoryId);
  }

  selectedBrandFromList(response) {
    console.log('response brands click', response);
    console.log('catch brand array', this.catchBrandArray);
    let filteredBrandArray = this.catchBrandArray.filter(function (item) {
      return item.brandname.trim() === response.brandname.trim() && item.brandid === response.brandid;
    });
    console.log('filteredBrandArray', filteredBrandArray);
    this.productsArray = filteredBrandArray;
    this.brandsData = this.productsArray;
    //required
    // this.dataSource = new MatTableDataSource(this.productsArray);
    // this.dataSource.paginator = this.paginator;
  }

  selectedVarientFromList(response, i) {

    this.availableQuantity = 'False';
    this.selectedIndex = i;
    // document.getElementById("mrp" + response.productid).innerHTML = response.productDetails[i].MRP;
    document.getElementById("finalPrice" + response.productid).innerHTML = (Number(response.productDetails[i].FinalPrice)).toString();
    // document.getElementById("discount" + response.productid).innerHTML = response.productDetails[i].Discount;
    this.showInitialProductDetails = false;
    this.finalProductDetails = true;


    this.selectedProductId = response.productid;
    this.availableQuantity = response.productDetails[i].outOfStockFlag;

  }




  onQuantityChange(response, quantity, i) {
    console.log('quantity', quantity);
    console.log('response', response);
    if (this.selectedIndex === undefined || this.selectedIndex === null) {
      i = 0;
      this.selectedIndex = 0;
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
    }

    if (Number(quantity) > 0) {
      this.catchResponse = this.pushProduct(this.purchaseProductArray, response, this.selectedIndex);
      this.purchaseProductArray = this.catchResponse;
      this.selectedQuantity = 0;
      sessionStorage.setItem('cart_items', JSON.stringify(this.purchaseProductArray));
      this.toastr.success('Product is Added Into Cart');
      this.totalProductsCalculation(this.purchaseProductArray);
      this.emitterService.isProductIsAddedOrRemoved.emit(true);
    }
    else {
      this.toastr.error('Check Quantity');
    }

  }


  //   arr.push({
  //     brandImageUrl: response.brandImageUrl, imgurl: response.imgurl, name: response.name,
  //     brandid: response.brandid, productid: response.productid,
  //     id: response.productDetails[j].id, Unit: response.productDetails[j].Unit, Discount: response.productDetails[j].Discount,
  //     FinalPrice: response.productDetails[j].FinalPrice, MRP: response.productDetails[j].MRP, Quantity: response.productDetails[j].Quantity,
  //     RequiredQuantity: response.mappingid, categoryid: response.categoryid
  //   });

  pushProduct(arr, response, j) {

    let sellerID = sessionStorage.getItem('sellerId');
    let vendorCode = sessionStorage.getItem('vendorId');

    if (j === undefined) {
      j = 0;
    }

    const index = arr.findIndex((o) => o.productid === response.productid && o.id === response.productDetails[j].id);

    if (index === -1) {
      console.log('not exist');

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

      });

    } else {

      console.log('exist');
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].productid === response.productid && arr[i].id === response.productDetails[j].id) {
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

    this.selectedIndex = 0;
    this.customBrandsSelectAll();
    // this.buyProductsService.getALLBrandData(this.vendorId, this.categoryId, this.SubCategoryId, this.brandId).subscribe(response => {
    //   this.allBrandsData = response;
    //   this.dataSource = new MatTableDataSource(this.allBrandsData);
    //   this.dataSource.paginator = this.paginator;
    // });
  }

  onSubCategorySelectAll() {
    this.brandId = "0";
    this.SubCategoryId = "0";
    this.selectedIndex = 0;
    this.uniqueBrandNamesArray = [];
    this.customSubCategorySelectAll();
    // this.buyProductsService.getALLSubCaetgoryData(this.vendorId, this.categoryId, this.SubCategoryId, this.brandId).subscribe(response => {

    //   this.allSubCategoryData = response;
    //   this.brandsData = this.allSubCategoryData;

    //   this.dataSource = new MatTableDataSource(this.allSubCategoryData);
    //   this.dataSource.paginator = this.paginator;
    // });



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

  getAllProductsData(vendorCode: string) {
    this.buyProductsService.getAllData(vendorCode).subscribe(response => {
      console.log('** get all data response **', response);
      this.masterData = response;
      this.masterDataResponse = response;
      let masterDataLength = this.masterData.length;
      sessionStorage.setItem("master_data", masterDataLength.toString());
      this.buyProductsService.masterDataArray = this.masterData;
      this.buyProductsService.masterDataResonseArray = this.masterData;
      console.log('master data', this.buyProductsService.masterDataArray);
      this.categoryListData = this.createUniqueCategoriesName(this.masterData);
      if ("category_array" in sessionStorage) {
        this.checkCartItems(this.categoryListData);
      }


      console.log('categoryListData new fetched from master Api getAllProductsData()', this.categoryListData);
      this.spinner.hide();
    });
    return this.masterData;
  }

  createUniqueCategoriesName(array: any) {
    let sortedCategoryArray: Array<any> = [];
    for (let i = 0; i < array.length; i++) {
      if ((sortedCategoryArray.findIndex(p => p.name.trim() == array[i].categoryname.trim())) == -1) {
        var item = {
          name: array[i].categoryname.trim(), id: array[i].categoryid, subcategoryid: array[i].subcategoryid,
          subcategoryname: array[i].subcategoryname.trim()
        }
        sortedCategoryArray.push(item);
      }
    }
    this.categoryListData = sortedCategoryArray;
    sessionStorage.setItem('category_array', JSON.stringify(this.categoryListData));
    this.checkCartItems(this.categoryListData);
    // console.log('outside get api custom call &&&', this.categoryListData);
    return sortedCategoryArray;
  }

  createUniqueSubCategoriesName(id: any) {
    console.log('received id sub cat', id);
    let sortedSubCategoryArray: Array<any> = [];
    let finalSubCategoryArray: Array<any> = [];
    if ("category_array" in sessionStorage) {
      console.log('got category array');
      this.categoryListData = JSON.parse(sessionStorage.getItem('category_array'));
      this.masterData = this.buyProductsService.masterDataArray;
      console.log('master data from service', this.masterData);
      this.checkCartItems(this.categoryListData);
    }
    for (let i = 0; i < this.masterData.length; i++) {

      if ((sortedSubCategoryArray.findIndex(p => p.name.trim() == this.masterData[i].subcategoryname.trim())) == -1) {

        var item = {
          categoryname: this.masterData[i].categoryname.trim(), id: this.masterData[i].categoryid, subcategoryid: this.masterData[i].subcategoryid,
          name: this.masterData[i].subcategoryname.trim(), brandid: this.masterData[i].brandid, productid: this.masterData[i].productid,
          brandname: this.masterData[i].brandname.trim()
        }
        sortedSubCategoryArray.push(item);
      }
    }
    console.log('SubCategoryArray', sortedSubCategoryArray);
    console.log('2nd time sub cat');
    for (let i = 0; i < sortedSubCategoryArray.length; i++) {
      if (Number(sortedSubCategoryArray[i].id) === Number(id)) {
        sortedSubCategoryArray[i].mappingid = "0";
        finalSubCategoryArray.push(sortedSubCategoryArray[i]);
      }
    }
    this.subCategoryListData = finalSubCategoryArray;
    console.log('outside get api  call sub category &&&', this.subCategoryListData);
    return sortedSubCategoryArray;
  }

  createUniqueBrands(categoryId, subCategoryId) {
    let brandsArray: Array<any> = [];
    let uniqueBrandNames: any = [];
    for (let i = 0; i < this.masterData.length; i++) {
      // if (Number(categoryId) === Number(this.masterData[i].categoryid) || Number(subCategoryId) === Number(this.masterData[i].subcategoryid)) {
      if (Number(subCategoryId) === Number(this.masterData[i].subcategoryid)) {
        brandsArray.push(this.masterData[i]);
      }
    }
    this.brandsData = brandsArray;
    this.catchBrandArray = brandsArray;
    console.log('specific brands data', this.brandsData);
    // let customResponse = this.createCustomBrandsDataResponse(this.brandsData);
    // this.brandsData = customResponse;

    // console.log('mapping id made 0', this.brandsData);

    this.dataSource = new MatTableDataSource(this.brandsData);
    this.dataSource.paginator = this.paginator;

    uniqueBrandNames = this.createUniqueBrandName(this.brandsData);
    this.uniqueBrandNamesArray = this.sortUniqueBrandName(uniqueBrandNames);
    console.log('uniqye brand names', this.uniqueBrandNamesArray);
  }


  customSubCategorySelectAll() {
    let subCategorySelectAll: Array<any> = [];
    for (let i = 0; i < this.masterData.length; i++) {
      if (Number(this.categoryId) === Number(this.masterData[i].categoryid)) {
        subCategorySelectAll.push(this.masterData[i]);
      }

    }
    this.brandsData = subCategorySelectAll;
    this.uniqueBrandNamesArray = [];
  }

  customBrandsSelectAll() {
    let brandSelectAll: Array<any> = [];
    for (let i = 0; i < this.masterData.length; i++) {
      if (Number(this.SubCategoryId) === Number(this.masterData[i].subcategoryid) && (Number(this.categoryId) === Number(this.masterData[i].categoryid))) {
        brandSelectAll.push(this.masterData[i]);
      }

    }
    this.brandsData = brandSelectAll;
    console.log('selected brands select all ', this.brandsData);
    this.uniqueBrandNamesArray = [];
  }

  customMasterDataResponse(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].mappingid = "0";
    }
    this.masterDataResponse = arr;
    this.buyProductsService.masterDataResonseArray = this.masterDataResponse;
    console.log('this.buyProductsService.masterDataResonseArray', this.buyProductsService.masterDataResonseArray);
  }

  ngOnDestroy() {
    console.log('on destroy called');
    this.masterData = this.masterDataResponse;
    console.log('assignment done');
  }
}
