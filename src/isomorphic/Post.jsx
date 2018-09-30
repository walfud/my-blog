import React from 'react'
import PropTypes from 'prop-types'

import LayoutView from './LayoutView'
import ContentView from './ContentView'

/**
 * 
 */
export default class Post extends React.Component {

    static propTypes = {
        content: PropTypes.string,       // html 内容
    }

    render() {
        return (
            <LayoutView>
                <ContentView html={this.props.content} />
            </LayoutView>
        )
    }
}