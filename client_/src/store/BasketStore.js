import { makeAutoObservable } from "mobx";

export default class BasketStore {
  constructor() {
    this._devices = [];
    makeAutoObservable(this);
  }
  setDevices(devices) {
    this._devices = devices;
  }
  clearDevices() {
    this._devices = [];
  }
  get devices() {
    return this._devices;
  }
}
