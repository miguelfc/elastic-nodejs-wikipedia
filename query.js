var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

client.search({
  q: 'School'
}).then(function(body) {
  var hits = body.hits.hits;
}, function(error) {
  console.trace(error.message);
});
