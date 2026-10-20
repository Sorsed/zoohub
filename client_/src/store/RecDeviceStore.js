import { makeAutoObservable } from "mobx";
export default class RecDeviceStore {
  constructor() {
    this._types = [];
    this._brands = [];
    this._devices = [];
    this._selectedType = {};
    this._selectedBrand = {};
    this._selectedDevice = {};
    this._selectedPriceFrom = 0;
    this._selectedPriceBefore = 999999;

    this._page = 1; //текущая страница
    this._totalCount = 0; //общее колво товаров по запросу
    this._limit = 4; //колво на странице
    makeAutoObservable(this);
  }

  setTypes(types) {
    this._types = types;
  }
  setBrands(brands) {
    this._brands = brands;
  }
  setDevices(devices) {
    this._devices = devices;
  }

  setSelectedType(type) {
    this.setPage(1);
    this._selectedType = type;
  }

  setSelectedDevice(device) {
    this._selectedDevice = device;
  }

  setSelectedBrand(brand) {
    this.setPage(1);
    this._selectedBrand = brand;
  }
  setSelectedPriceFrom(price) {
    this.setPage(1);
    this._selectedPriceFrom = price;
  }
  setSelectedPriceBefore(price) {
    this.setPage(1);
    this._selectedPriceBefore = price;
  }

  setPage(page) {
    this._page = page;
  }
  setTotalCount(count) {
    this._totalCount = count;
  }

  get types() {
    return this._types;
  }
  get brands() {
    return this._brands;
  }
  get devices() {
    return this._devices;
  }
  get selectedType() {
    return this._selectedType;
  }
  get selectedBrand() {
    return this._selectedBrand;
  }
  get selectedDevice() {
    return this._selectedDevice;
  }
  get selectedPriceFrom() {
    return this._selectedPriceFrom;
  }
  get selectedPriceBefore() {
    return this._selectedPriceBefore;
  }

  get totalCount() {
    return this._totalCount;
  }
  get page() {
    return this._page;
  }
  get limit() {
    return this._limit;
  }
}
