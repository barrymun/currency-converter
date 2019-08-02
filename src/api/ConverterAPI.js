import axios from 'axios';

export class ConverterAPI {
    fromAmount = 1.0;
    toAmount = 1.0;
    fromCurrency = `GBP`;
    toCurrency = `USD`;
    fromRef = `:from`;
    toRef = `:to`;
    baseUrl = `https://api.exchangeratesapi.io/latest?base=${this.fromRef}&symbols=${this.toRef}`;

    constructor(fromCurrency, toCurrency) {
        this.fromCurrency = fromCurrency != null ? fromCurrency : this.fromCurrency;
        this.toCurrency = toCurrency != null ? toCurrency : this.toCurrency;
    }

    async convert() {
        let url = this.baseUrl
            .replace(this.fromRef, this.fromCurrency)
            .replace(this.toRef, this.toCurrency);
        return await axios.get(url);
    }

    static getAmount(exchangeRate, amount) {
        return exchangeRate * amount;
    }
}