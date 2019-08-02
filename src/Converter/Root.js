import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import AsyncSelect from 'react-select/async';
import axios from "axios";

import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";

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

class Root extends React.Component {
    state = {
        fromInputValue: '',
        toInputValue: '',
        fromCurrency: 'GBP',
        toCurrency: 'USD',
        fromAmount: 0,
        toAmount: 0,
    };

    async componentDidMount() {
        let r = await axios.get('https://api.exchangeratesapi.io/latest?base=GBP&symbols=USD');
        console.log(r.data)
    }

    render() {
        const {classes} = this.props;
        const {
            fromAmount,
            toAmount,
        } = this.state;

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
        if (isNaN(event.target.value)) return;
        this.setState({[name]: event.target.value});
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