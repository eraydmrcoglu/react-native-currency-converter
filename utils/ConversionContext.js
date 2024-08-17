import React, { createContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { api } from "./api";

export const ConversionContext = createContext();

const DEFAULT_BASE_CURRENCY = "USD";
const DEFAULT_QUOTE_CURRENCY = "TRY";

export const ConversionContextProvider = ({ children }) => {
  const [baseCurrency, setBaseCurrency] = useState(DEFAULT_BASE_CURRENCY);
  const [quoteCurrency, setQuoteCurrency] = useState(DEFAULT_QUOTE_CURRENCY);
  const [date, setDate] = useState();
  const [rates, setRates] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchRates = (currency) => {
    setIsLoading(true);

    return api({ base_currency: currency })
      .then((res) => {
        setBaseCurrency(currency);
        setDate(res.date);
        setRates({
          ...res.rates,
          [currency]: 1,
        });
      })
      .catch((error) => {
        Alert.alert("Sorry, something went wrong.", error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const swapCurrencies = () => {
    const newBaseCurrency = quoteCurrency;
    const newQuoteCurrency = baseCurrency;
    setQuoteCurrency(newQuoteCurrency);
    fetchRates(newBaseCurrency);
  };

  useEffect(() => {
    fetchRates(DEFAULT_BASE_CURRENCY);
  }, []);

  const contextValue = {
    baseCurrency,
    quoteCurrency,
    setBaseCurrency: fetchRates,
    setQuoteCurrency,
    swapCurrencies,
    date,
    rates,
    isLoading,
  };

  return (
    <ConversionContext.Provider value={contextValue}>
      {children}
    </ConversionContext.Provider>
  );
};
