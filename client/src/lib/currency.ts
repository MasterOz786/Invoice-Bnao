export interface CurrencyRate {
  from: string;
  to: string;
  rate: number;
}

export interface CurrencyRates {
  [fromCurrency: string]: {
    [toCurrency: string]: number;
  };
}

export async function fetchCurrencyRates(): Promise<CurrencyRates | null> {
  try {
    const response = await fetch("/api/currency/rates");
    if (!response.ok) {
      throw new Error("Failed to fetch currency rates");
    }
    const data = await response.json();
    return data.rates;
  } catch (error) {
    console.error("Error fetching currency rates:", error);
    return null;
  }
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: CurrencyRates
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const rate = rates[fromCurrency]?.[toCurrency];
  if (!rate) {
    console.warn(`No conversion rate found for ${fromCurrency} to ${toCurrency}`);
    return amount;
  }

  return amount * rate;
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}
