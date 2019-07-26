import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";

import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({});

class Root extends React.Component {
    state = {
        isPlaying: false,
        mp3PlayerInitialized: false,
        audio: null,
        src: '',
        srcInput: '',
    };

    render() {
        return (
            <div>
                DISPLAY
            </div>
        );
    }
}

Root.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const c = connect()(withStyles(styles, {withTheme: true})(Root));
export {c as Root};