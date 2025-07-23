import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../modules/users/usersSlice";
import alertReducer from "../other/alertSlice";
import confirmReducer from "../other/ConfirmSlice";
import actionReducer from "../global/actions/actionSlice";
import settingsReducer from "../modules/settings/SettingsSlice";
import subscriptionsReducer from "../modules/subscription/SubscriptionSlice";
import bidsReducer from "../modules/bids/BidsSlice";
import officesReducer from "../modules/offices/OfficesSlice";
import logsReducer from "../modules/logs/LogsSlice";
import facilitiesReducer from "../modules/facilities/FacilitiesSlice";
import currencyExchangeReducer from "../other/apis/CurrencyExchangeSlice";
import facilityBidsReducer from "../modules/facilities/bids/FacilityBidsSlice";
import facilityAccommodationsReducer from "../modules/facilities/accommodations/accommodationsSlice";
import accommodationRentReducer from "../modules/facilities/accommodations/AccommodationRentSlice";
import facilityRentReducer from "../modules/facilities/rent/FacilityRentSlice";
import facilityTenantsReducer from "../modules/facilities/tenants/TenantsSlice";
import tenantRentReducer from "../modules/facilities/tenants/TenantRentSlice";
import facilityServiceFeesReducer from "../modules/facilities/serviceFees/FacilityServiceFeesSlice";
import facilityBookingsReducer from "../modules/facilities/bookings/bookingsSlice";
import facilityHistoryReducer from "../modules/facilities/history/HistorySlice";
import landlordTenantsReducer from "../modules/tenants/TenantsSlice";
import otherFacilitiesReducer from "../modules/market/otherFacilitiesSlice";
import receiptsReducer from "../modules/receipts/receiptsSlice";
import facilityExpensesReducer from "../modules/facilities/expenses/expenseSlice";
import viewRightsReducer from "../modules/users/rights/viewRightsSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    alert: alertReducer,
    confirm: confirmReducer,
    action: actionReducer,
    settings: settingsReducer,
    subscriptions: subscriptionsReducer,
    bids: bidsReducer,
    offices: officesReducer,
    logs: logsReducer,
    facilities: facilitiesReducer,
    currencyExchange: currencyExchangeReducer,
    facilityBids: facilityBidsReducer,
    facilityAccommodations: facilityAccommodationsReducer,
    facilityTenants: facilityTenantsReducer,
    accommodationRent: accommodationRentReducer,
    facilityRent: facilityRentReducer,
    tenantRent: tenantRentReducer,
    facilityServiceFees: facilityServiceFeesReducer,
    facilityBookings: facilityBookingsReducer,
    facilityHistory: facilityHistoryReducer,
    landlordTenants: landlordTenantsReducer,
    otherFacilities: otherFacilitiesReducer,
    receipts: receiptsReducer,
    facilityExpenses: facilityExpensesReducer,
    viewRights: viewRightsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
