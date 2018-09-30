import React from 'react'

/**
 * 
 */
export default class Layout extends React.Component {

    static propTypes = {
    }

    render() {
        return (
            <div style={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
            }}>
                <section style={{
                    display: 'flex',
                    flexDirection: 'row',
                    height: 60,
                }}>
                    <label>xxx</label>
                </section>
                <article>
                    {this.props.children}
                </article>
            </div>
        )
    }
}