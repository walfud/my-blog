import url from 'url'

const hostUrl = 'http://localhost:27593'

export default {
    host: hostUrl,
    hostname: url.parse(hostUrl).hostname,
    port: url.parse(hostUrl).port,
    postsDir: './posts/',
}