import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

import Config from '../../config'
import App from '../isomorphic/App'

import '@babel/polyfill'
(async () => {
    const directoryData = (await axios.get(`${Config.host}/api/directory`)).data
    ReactDOM.hydrate(<App data={directoryData} />, document.getElementById('root'));
})()
