import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { httpHeaderRequstService } from '../auth-services/http-header.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShipmentNowService {

  constructor(private _httpHeaderService : httpHeaderRequstService,
    private http: HttpClient) { 
    }
    public sendUserRegisterData(data:any): Observable<any>{
        return this._httpHeaderService.post(`auth/register`,data);
    }

    public getSenderAddressBookData() {
        return this._httpHeaderService.get(`sender-address-book`);
    }

    public getRecipientAddressBookData() {
        return this._httpHeaderService.get(`recipient-address-book`);
    }

    public getpickupAddressBook() {
        return this._httpHeaderService.get(`pickup-address-book`);
    }

    public getSaveAsDefaultAddressData() {
        return this._httpHeaderService.get(`shipment-booking-sender-default-address`);
    }

    public getCountryData() {
        return this._httpHeaderService.get(`address-country?order_by=country_id&sort_by=ASC`);
    }

    public getStateData(countryId: any) {
        return this._httpHeaderService.get(`states?country_id=${countryId}&order_by=state_name&sort_by=ASC`);
    }

    public getPackageType() {
        return this._httpHeaderService.get(`package-type`);
    }

    public getServiceType() {
        return this._httpHeaderService.get(`service-type?order_by=service_type_id&sort_by=ASC`);
    }

    public getpackageContentsType() {
        return this._httpHeaderService.get(`package-content`);
    }

    public getshipmentPurposeType() {
        return this._httpHeaderService.get(`shipment-purpose?order_by=shipment_purpose_id&sort_by=ASC`);
    }

    public getbillTransportationToType() {
        return this._httpHeaderService.get(`bill-transportation-option`);
    }

    public getCurrencyData() {
        return this._httpHeaderService.get(`currency?per_page=&order_by=currency_id&sort_by=ASC`);
    }

    public getHarmonizedCodeData() {
        return this._httpHeaderService.get(`harmonized-system-code?order_by=harmonized_system_code_id&sort_by=ASC`);
    }

    public getDimensionsBook() {
        return this._httpHeaderService.get(`dimension-book`);
    }

    public addUpdateShipNowFirstStep(data: any) {
        return this._httpHeaderService.postWithFormData(`shipment-booking-sender`, data);
    }

    public addUpdateShipNowSecondStep(data: any) {
        return this._httpHeaderService.postWithFormData(`shipment-booking-recipient`, data);
    }

    public addUpdateShipNowThirdStep(data: any) {
        return this._httpHeaderService.postWithFormData(`shipment-booking-package`, data);
    }

    public addUpdateShipNowForthStep(data: any) {
        return this._httpHeaderService.postWithFormData(`shipment-billing-prefrence`, data);
    }

    public addUpdateShipNowFifthStep(data: any) {
        return this._httpHeaderService.postWithFormData(`shipment-commodity`, data);
    }

    public addUpdateShipNowSixStep(data: any) {
        return this._httpHeaderService.postWithFormData(`shipment-save`, data);
    }

    public saveDimensions(data: any) {
        return this._httpHeaderService.postWithFormData(`dimensions/store-update`, data);
    }

    public getShipmentHistoryData() {
        return this._httpHeaderService.get(`shipment-histories`);
    }

    public getShipmentBookingDetailsDetailsById(book_id: any) {
        return this._httpHeaderService.get(`shipment-booking-detail/${book_id}`);
    }

    public getLocationApi() {
        return this._httpHeaderService.get(`vayulogi-locations?order_by=vayu_logi_location_id&sort_by=DESC`);
    }

    public getShipmentNotificationType(type: any) {
        return this._httpHeaderService.get(`shipment-notification-types?shipment_notification_type=${type}`);
    }

    public getStatusData() {
        return this._httpHeaderService.get(`order-status?order_by=display_order&sort_by=ASC`);
    }

    public addUpdateTreacking(data: any) {
        return this._httpHeaderService.postWithFormData(`tracking-order/store-update`, data);
    }

    public getShipmentTrackingDetailsById(tracking_id: any) {
        return this._httpHeaderService.get(`tracking-order?sort_by=DESC&tracking_no=${tracking_id}`);
    }

    public printLabelById(shipment_booking_id: any) {
        return this._httpHeaderService.get(`shipment-booking-jazva-print-label/${shipment_booking_id}`);
        // return this._httpHeaderService.get(`shipment-booking-print-label/${shipment_booking_id}`);
    }

    public confirmOrder(data: any) {
        return this._httpHeaderService.postWithFormData(`shipment-order-confirm`, data);
    }

    public getUserWalletDetailsById(user_id: any) {
        return this._httpHeaderService.get(`customer-wallet-amount?user_id=${user_id}`);
    }

    public addPayment(data: any) {
        return this._httpHeaderService.postWithFormData(`customer-wallet-transection`, data);
    }

    public getExternalShippingData() {
        return this._httpHeaderService.get(`external-shipping-method?search=&service_type_id=2&order_by=external_shipping_method_name&sort_by=ASC&per_page=10&page_no=1`);
    }
}