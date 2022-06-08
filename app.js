const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const echarts = require('echarts');

const version = "1.0.0"

/*
  Load 'my_config.js' if it's available
*/
let config;

try {
  if (fs.existsSync('./my_config.js')) {
    config = require('./my_config')
  }else{
    config = require("./config")
  }
} catch(err) {
  console.error(err)
}

const app = express()
app.use(bodyParser.json());

/*
Structure of the request body:
{
  outputPath: "34/54",
  echartsOptions: {...}
  height: 300, //default is 300
  width: 500  // default is 500
}
*/

app.post('/svg', (req, res) => {
  const svgPath = req.body.outputPath + '/' + config.fileName

  const chart = echarts.init(null, null, {
    renderer: 'svg',
    ssr: true,
    width: req.body.width || 500,
    height: req.body.height || 300
  });

const echartsOptions = JSON.parse(req.body.echartsOptions)

  // remove any animations
  chart.setOption({...echartsOptions, animation: false});

  fs.writeFileSync(config.rootPath + svgPath, chart.renderToSVGString(), 'utf-8');

  res.type('text/plain')
  res.send(svgPath)
})

app.get('/version', (req, res) => {
    res.type('text/plain')
    res.send(version)
})

app.use((req, res) => {
    res.type('text/plain')
    res.status(404)
    res.send('404 Not found')
})

app.listen(config.port, () => console.log(`PAF analysis SVG is on Port ${config.port} Ctrl + C to Stop `))
