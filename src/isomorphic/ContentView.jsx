import React from 'react'
import PropTypes from 'prop-types'

/**
 * 
 */
export default class ContentView extends React.Component {

    static propTypes = {
        html: PropTypes.string,
    }

    render() {
        return (
            <div dangerouslySetInnerHTML={{__html: this.props.html}} />
        )
    }
}