let express = require('express');
let config = require('./config/index');

let port = process.env.PORT || config.build.port;

let app = express();

let router = express.Router();

router.get('/', function (req, res, next) {
  req.url = '/index.html';
  next();
});

app.use(router);

/* 自定义接口数据 开始 */
let appData = require('./data.json');
let seller = appData.seller;
let goods = appData.goods;
let ratings = appData.ratings;

let apiRoutes = express.Router();
apiRoutes.get('/seller', function (req, res) {
  res.json({
    error: 0,
    data: seller
  })
});
apiRoutes.get('/goods', function (req, res) {
  res.json({
    error: 0,
    data: goods
  })
});
apiRoutes.get('/ratings', function (req, res) {
  res.json({
    error: 0,
    data: ratings
  })
});

app.use('/api', apiRoutes);
/* 自定义接口数据 结束 */

app.use(express.static('./dist'));

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:' + port);
});
