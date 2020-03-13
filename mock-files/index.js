const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Headers','content-type,Content-Length, Authorization,Origin,Accept,X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
  res.header('Access-Control-Allow-Credentials',true);
  next();
});

app.get('/widgets', (req, res) => {
  fs.readdir(path.join(__dirname, 'lib'), (err, files) => {
    const jsFiles = files.filter(file => file.includes('umd.js') && !file.includes('.map'));
    const result = jsFiles.map(js => {
      const isComponent = js.includes('vue') ? 'vue' : js.includes('react') ? 'react' : false;
      if (!isComponent) return false;
      return {
        type: isComponent,
        name: js,
        url: `http:\/\/localhost:13190\/${js}`,
      }
    }).filter(item => item);
    res.json(result);
  });  
})

app.get('/have-new', (req, res) => {
  fs.readdir(path.join(__dirname, 'lib'), (err, files) => {
    const jsFiles = files.filter(file => file.includes('app.js') && !file.includes('.map'));
    const result = jsFiles.map((item) => ({
      name: item,
      url: `http:\/\/localhost:13190\/${item}`,
      defaultProps: { workspaceId: 1, prn: 'TaskController/PicoTraining-10001544-10001544-94f5cb.model' },
    }))
    res.json(result);
  });  
})

app.listen(33190, () => {
  console.log('正在监听33190端口的mock接口');
})
