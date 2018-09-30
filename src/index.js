import path from 'path'
import fs from 'fs'
import querystring from 'querystring'
import Koa from 'koa'
import mount from 'koa-mount'
import serve from 'koa-static'
import Router from 'koa-router'
import React from 'react'
import { renderToString } from 'react-dom/server'
import pify from 'pify'
import marked from 'marked'

import Config from '../config'
import App from './isomorphic/App'
import Post from './isomorphic/Post'

const app = new Koa()

app.use(mount('/dist', serve('./dist/')))

const router = new Router()
// 页面
router.get('/', async ctx => {
  const directoryData = await getDirectoryData(Config.postsDir)
  const content = renderToString(<App data={directoryData} />)

  ctx.body = `
    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <div id="root">${content}</div>
        <script src="/dist/directory.js"></script>
      </body>
    </html>
    `
})
  .get('/post/:path*', async ctx => {
    const postPath = path.join(Config.postsDir, ctx.params.path)
    try {
      const rawMd = await pify(fs.readFile)(postPath, { encoding: 'utf-8' })
      const md = resolveLink(rawMd, path.parse(ctx.params.path).dir)
      const html = marked(md)
      const content = renderToString(<Post content={html} />)

      ctx.body = `
    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <div id="root">${content}</div>
        <script src="/dist/post.js"></script>
      </body>
    </html>
    `
    } catch (err) {
      console.log(err)
    }
  })
// api
router.get('/api/directory', async ctx => {
  ctx.body = await getDirectoryData(Config.postsDir)
})
  .get('/api/post/:path*', async ctx => {
    const postPath = path.join(Config.postsDir, ctx.params.path)
    try {
      const rawMd = await pify(fs.readFile)(postPath, { encoding: 'utf-8' })
      const md = resolveLink(rawMd, path.parse(ctx.params.path).dir)
      const html = marked(md)
      ctx.body = html
    } catch (err) {
      console.log(err)
    }
  })
  .get('/api/asset/:path*', async ctx => {
    const assetPath = path.join(Config.postsDir, ctx.params.path)
    try {
      const buf = await pify(fs.readFile)(assetPath)
      ctx.body = buf
    } catch (err) {
      console.log(err)
    }
  })
app.use(router.routes())

app.listen(Config.port, () => console.log(`'my-blog' Listen on port: ${Config.port}`))


/**
* 递归遍历`dir`, 产生目录数据结构
* @see App.propTypes.data
*/
async function getDirectoryData(dir) {
  const data = []

  const subs = (await pify(fs.readdir)(dir) || [])
    .filter(Boolean)
  for (let i of subs) {
    const iPath = path.join(dir, i)
    const relPath = path.relative(Config.postsDir, iPath)
    const stats = await pify(fs.stat)(iPath)
    if (stats.isFile()) {
      const parsed = path.parse(i)
      data.push({
        title: parsed.name,
        time: ~~stats.birthtimeMs,
        path: relPath,
        type: parsed.ext.substring(1),
      })
    } else if (stats.isDirectory()) {
      if (i === 'assets') {
        continue
      }

      data.push({
        title: i,
        time: ~~stats.birthtimeMs,
        path: relPath,
        type: 'dir',
        sub: await getDirectoryData(iPath)
      })
    }
  }

  return data
}

/**
 * 
 */
function resolveLink(origin, dir) {
  return origin
    // ![desc](./assets/foo.png)
    .replace(/\[(.*?)\]\(([^)]*?(?:\.png|\.jpg|\.jpeg|\.svg|\.bmp))\)/ig, (match, desc, relLink, offset, whole) => {
      const assetPath = path.join(`/api/asset/`, dir, relLink).replace(/ /g, '%20')
      return `[${desc}](${Config.host}${assetPath})`
    })
    // <img src="./assets/foo.png" />
    .replace(/(<img[^>]*?)src="(.*?)"/ig, (match, before, relLink, offset, whole) => {
      const assetPath = path.join(`/api/asset/`, dir, relLink).replace(/ /g, '%20')
      return `${before}src="${Config.host}${assetPath}"`
    })
}