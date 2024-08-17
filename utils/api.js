import axios from "axios";

const API_KEY = "cur_live_KbkQbdlrDUlhy14nULTWr5F7LM5WdnMGCSqrqyb8";
const BASE_URL = "https://api.currencyapi.com/v3/latest";

export const api = (params = {}) => {
  const url = `${BASE_URL}?apikey=${API_KEY}&${new URLSearchParams(params)}`;

  return axios
    .get(url)
    .then((response) => {
      console.log("API Response:", response.data);
      const data = response.data;

      if (!data || !data.meta || !data.data) {
        console.error("Invalid API response format:", data);
        throw new Error("Invalid API response format");
      }

      const rates = {};
      for (const [currency, details] of Object.entries(data.data)) {
        rates[currency] = details.value;
      }

      return {
        base: params.base_currency || "UNKNOWN",
        date: data.meta.last_updated_at || "UNKNOWN DATE",
        rates: rates,
      };
    })
    .catch((error) => {
      console.error("CurrencyAPI Error:", error.message);
      throw new Error("Failed to fetch data from CurrencyAPI");
    });
};
