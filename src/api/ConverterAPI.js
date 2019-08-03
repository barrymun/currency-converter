import axios from 'axios';

export class ConverterAPI {
    fromCurrency = `GBP`;
    toCurrency = `USD`;
    fromRef = `:from`;
    toRef = `:to`;
    baseUrl = `https://api.exchangeratesapi.io/latest?base=${this.fromRef}&symbols=${this.toRef}`;
    // baseUrl2 = `https://api.exchangeratesapi.io/latest?symbols=${this.fromRef},${this.toRef}`;
    baseUrl2 = `https://api.exchangeratesapi.io/latest?base=${this.fromRef}`;

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

    async convert2() {
        let url = this.baseUrl2
            .replace(this.fromRef, this.fromCurrency)
            .replace(this.toRef, this.toCurrency);
        return await axios.get(url);
    }

    static getGoingToAmount(exchangeRate, amount) {
        return exchangeRate * amount;
    }

    static getComingFromAmount(exchangeRate, amount) {
        return amount / exchangeRate;
    }
}