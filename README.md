## Getting Started

### Installation

```
$ npm install
```

### Development

* `$ npm start`
* Point to http://localhost:3000/

### Production server

* `$ npm run production`

### Server params

PORT - port to listen, default 3000
JWT - jwt secret, default "matchmetrics"
DB - mongoDB connect uri, default: mongodb://localhost/matchmetrics


### Init data 

Run `node ./initTempData/index.js`