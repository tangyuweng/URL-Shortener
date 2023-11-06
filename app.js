const express = require('express')
const { engine } = require('express-handlebars')
const fs = require('fs')

const app = express()
const port = 3000

const dataFilePath = './data.json'

let urlData = {}

// 檢查data.json檔是否存在，若存在但內容為空回傳 {}
if (fs.existsSync(dataFilePath)) {
  try {
    const dataFileContent = fs.readFileSync(dataFilePath, 'utf8')
    urlData = dataFileContent.length > 0 ? JSON.parse(dataFileContent) : {}
  } catch (error) {
    console.error('Error parsing data.json:', error)
  }
}

app.use(express.static('public'))
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.get('/', (req, res) => {
  res.render('index')
})

// 生成短網址，並存入data.json
app.get('/shorten_url', (req, res) => {
  const originalURL = req.query.url
  if (!originalURL.length) {
    return res.render('index')
  }
  const randomURL = generateShortURL()
  urlData[randomURL] = originalURL
  fs.writeFile(dataFilePath, JSON.stringify(urlData, null, 2), (err) => {
    if (err) {
      console.error('Error writing to data.json:', err)
    }
  })
  const shortURL = `http://localhost:3000/${randomURL}`
  res.render('index', { shortURL })
})

// 根據短網址重定向到相對應原始網址
app.get('/:shortUrl', (req, res) => {
  const { shortUrl } = req.params
  const originalUrl = urlData[shortUrl]
  if (originalUrl) {
    res.redirect(originalUrl)
  } else {
    res.render('error.hbs')
  }
})

// 隨機產生5碼短網址
function generateShortURL() {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let shortURL = ''
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    shortURL += characters[randomIndex]
  }
  return shortURL
}

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})
