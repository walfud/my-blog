import React from 'react'
import PropTypes from 'prop-types'

import Config from '../../config'
import { PostDataTypes } from './Constants'
import LayoutView from './LayoutView'

export default class App extends React.Component {
    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.shape({
            ...PostDataTypes,
            sub: PropTypes.arrayOf(PropTypes.shape(PostDataTypes)),        // type === 'dir' 时目录下的子文章
        }))
    }

    _generateDirectoryView(data) {
        if (!data) {
            return null
        }

        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                {data.map(x => this._generateDirectoryItemView(x))}
            </div>
        )
    }
    _generateDirectoryItemView({ title, path, time, type, sub }) {
        if (type !== 'dir') {
            return (
                <section
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    onClick={() => window.open(`${Config.host}/post/${path}`)}
                    key={path}
                >
                    <h1>{title}</h1>
                </section>
            )
        } else {
            return (
                <section
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    key={path}
                >
                    <h1>{title}</h1>
                    <section style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginLeft: 20,
                    }}>
                        {sub.map(x => this._generateDirectoryItemView(x))}
                    </section>
                </section>
            )
        }
    }

    render() {
        return (
            <LayoutView>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    {this._generateDirectoryView(this.props.data)}
                </div>
            </LayoutView>
        )
    }
}