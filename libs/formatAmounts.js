export const FormatAmounts = {
    formatAmountToMoney: (number) => {
        if (number === null || number === undefined || number === '') return '';
        number = number.toString();

        const currencyOptions = { style: 'currency', currency: 'CLP' };
        const numbersFormats = new Intl.NumberFormat('es-ES', currencyOptions);

        return numbersFormats.format(number);
    }
}