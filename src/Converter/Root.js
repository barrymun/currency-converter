import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import AsyncSelect from 'react-select/async';

import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";

import {ConverterAPI} from "../api/ConverterAPI";

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
    },
    select: {
        width: 100,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
});
let api = new ConverterAPI();

class Root extends React.Component {
    state = {
        fromInputValue: '',
        toInputValue: '',
        fromCurrency: 'GBP',
        toCurrency: 'USD',
        fromAmount: 1.0,
        toAmount: 1.0,
        exchangeRate: null,
    };

    async componentDidMount() {
        let r = await api.convert();
        let exchangeRate = r.data.rates[this.state.toCurrency];
        let toAmount = ConverterAPI.getGoingToAmount(exchangeRate, this.state.toAmount);
        this.setState({exchangeRate, toAmount});
    }

    render() {
        const {classes} = this.props;
        const {
            fromAmount,
            toAmount,
            exchangeRate,
        } = this.state;

        if (exchangeRate == null) return null;

        return (
            <div className={classes.container}>
                <Card className={classes.card}>
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
                    <div className={classes.select}>
                        <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={this.loadOptions}
                            placeholder=""
                        />
                    </div>
                </Card>

                <Card className={classes.card}>
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
                    <div className={classes.select}>
                        <AsyncSelect
                            cacheOptions
                            defaultOptions
                            loadOptions={this.loadOptions}
                            placeholder=""
                        />
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


    handleSelectChange = newValue => {
        const fromInputValue = newValue.replace(/\W/g, '');
        this.setState({fromInputValue});
        return fromInputValue;
    };


    loadOptions = fromInputValue =>
        new Promise(resolve => {
            setTimeout(() => {
                resolve(fromInputValue);
            }, 1000);
        });
}

Root.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const c = connect()(withStyles(styles, {withTheme: true})(Root));
export {c as Root};