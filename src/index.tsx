import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { store } from "./app/store";
import { Provider } from "react-redux";
import "./styles/main.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { fetchCurrencyExchange } from "./other/apis/CurrencyExchangeSlice";
import { fetchAdminFinancialSettings } from "./modules/settings/SettingsSlice";
import { fetchOtherFacilities } from "./modules/market/otherFacilitiesSlice";

store.dispatch(fetchCurrencyExchange());
store.dispatch(fetchAdminFinancialSettings());
store.dispatch(fetchOtherFacilities({ page: 0, size: 100 }));

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
