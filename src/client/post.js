import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import marked from 'marked'

import Config from '../../config'
import Post from '../isomorphic/Post'

import '@babel/polyfill'
(async () => {
    const postPath = document.location.pathname.substring(1)
    const content = (await axios.get(`${Config.host}/api/${postPath}`)).data
    ReactDOM.hydrate(<Post content={content} />, document.getElementById('root'));
})()
