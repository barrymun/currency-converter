import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import Select from 'react-select';

import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";

import {ConverterAPI} from "../api/ConverterAPI";
import currencyJSON from '../currency';

const styles = theme => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        minWidth: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
    },
    select: {
        width: 160,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    divider: {
        width: 10,
    },
});
let options = Object.keys(currencyJSON).map((key, index) => {
    return {label: currencyJSON[key].name, value: key};
});

class Root extends React.Component {
    initialFromCurrency = 'GBP';
    initialToCurrency = 'USD';

    state = {
        fromInputValue: '',
        toInputValue: '',
        fromAmount: 1.0,
        toAmount: 1.0,
        exchangeRate: null,
        selectedFromCurrency: {
            label: currencyJSON[this.initialFromCurrency].name,
            value: currencyJSON[this.initialFromCurrency].code,
        },
        selectedToCurrency: {
            label: currencyJSON[this.initialToCurrency].name,
            value: currencyJSON[this.initialToCurrency].code,
        }
    };

    constructor(props) {
        super(props);
        this.setStateAsync = this.setStateAsync.bind(this);
    }

    setStateAsync(state) {
        return new Promise(resolve => this.setState(state, resolve));
    };

    async componentDidMount() {
        const {selectedToCurrency} = this.state;
        let api = new ConverterAPI();
        let r = await api.convert();
        let x = await api.convert2();
        console.log({x})
        let exchangeRate = r.data.rates[selectedToCurrency.value];
        let toAmount = ConverterAPI.getGoingToAmount(exchangeRate, this.state.toAmount);
        this.setState({exchangeRate, toAmount});
    }

    render() {
        const {classes} = this.props;
        const {
            selectedFromCurrency,
            selectedToCurrency,
            fromAmount,
            toAmount,
            exchangeRate,
        } = this.state;

        if (exchangeRate == null) return null;

        return (
            <div className={classes.container}>
                <Card className={classes.card}>
                    <div className={classes.select}>
                        <Select
                            className="currency"
                            classNamePrefix="select"
                            name="selectedFromCurrency"
                            defaultValue={selectedFromCurrency}
                            options={options}
                            onChange={this.handleSelectChange}
                        />
                    </div>
                    <TextField
                        label=""
                        value={fromAmount}
                        onChange={this.handleChange('fromAmount')}
                        type="text"
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                    />
                    <div>
                        {selectedFromCurrency.value}
                    </div>
                </Card>

                <div className={classes.divider}/>

                <Card className={classes.card}>
                    <div className={classes.select}>
                        <Select
                            className="currency"
                            classNamePrefix="select"
                            name="selectedToCurrency"
                            defaultValue={selectedToCurrency}
                            options={options}
                            onChange={this.handleSelectChange}
                        />
                    </div>
                    <TextField
                        label=""
                        value={toAmount}
                        onChange={this.handleChange('toAmount')}
                        type="text"
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                    />
                    <div>
                        {selectedToCurrency.value}
                    </div>
                </Card>
            </div>
        );
    }


    handleChange = name => event => {
        const value = event.target.value;
        const {exchangeRate} = this.state;

        if (isNaN(value)) return;

        let key, amount;
        if (name === 'fromAmount') {
            key = 'toAmount';
            amount = ConverterAPI.getGoingToAmount(exchangeRate, value);
        } else {
            key = 'fromAmount';
            amount = ConverterAPI.getComingFromAmount(exchangeRate, value);
        }
        return new Promise(resolve =>
            this.setState({[name]: value, [key]: amount}, () => resolve()));
    };


    handleSelectChange = async (value, data) => {
        // console.log({value})
        // console.log({data})
        await this.setStateAsync({[data.name]: value});
        const {selectedFromCurrency, selectedToCurrency} = this.state;
        let r, from, to, key, amount, currencyKey;
        if (data.name === 'selectedFromCurrency') {
            key = 'toAmount';
            amount = ConverterAPI.getGoingToAmount(this.state.exchangeRate, this.state.toAmount)
            currencyKey = 'selectedToCurrency';
            from = selectedFromCurrency.value;
            to = selectedToCurrency.value;
        } else {
            key = 'fromAmount';
            amount = ConverterAPI.getComingFromAmount(this.state.exchangeRate, this.state.toAmount)
            currencyKey = 'selectedFromCurrency';
            from = selectedToCurrency.value;
            to = selectedFromCurrency.value;
        }
        let api = new ConverterAPI(from, to);
        r = await api.convert();
        console.log(r)
        let exchangeRate = r.data.rates[this.state[currencyKey].value];
        console.log({exchangeRate})
        this.setState({exchangeRate, [key]: amount});
    };
}

Root.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const c = connect()(withStyles(styles, {withTheme: true})(Root));
export {c as Root};