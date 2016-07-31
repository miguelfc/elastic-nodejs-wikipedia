// get walking directions from central park to the empire state building
var http = require("https");
var elasticsearch = require('elasticsearch');

//https://en.wikipedia.org/w/api.php?action=query&list=recentchanges&rclimit=500&rcnamespace=0&format=json&rcprop=user|title|ids|sizes|type|flags|tags|timestamp&rcstart=2016-05-28T20:23:09Z

//"http://maps.googleapis.com/maps/api/directions/json?origin=Central Park&destination=Empire State Building&sensor=false&mode=walking";

// get is a simple wrapper for request()
// which sets the http method to GET
var changes = {};
var changesIds = [];

var extract = function(loopCount, timestamp) {

  if (timestamp != null) {
    generalUrl = "https://en.wikipedia.org/w/api.php?action=query&list=recentchanges&rclimit=500&rcnamespace=0&format=json&rcprop=user|title|ids|sizes|type|flags|tags|timestamp&rcstart=" + timestamp;
  } else {
    generalUrl = "https://en.wikipedia.org/w/api.php?action=query&list=recentchanges&rclimit=500&rcnamespace=0&format=json&rcprop=user|title|ids|sizes|type|flags|tags|timestamp";
  }

  console.log("Extracting from: " + generalUrl);

  var request = http.get(generalUrl, function(response) {
    // data is streamed in chunks from the server
    // so we have to handle the "data" event
    var buffer = "",
      data;

    response.on("data", function(chunk) {
      buffer += chunk;
    });

    response.on("end", function(err) {
      // finished transferring data
      // dump the raw data
      //console.log(buffer);
      //console.log("\n");
      data = JSON.parse(buffer);
      recentChanges = data.query.recentchanges;

      var latestTimestamp;
      // extract the distance and time
      for (var i in recentChanges) {
        var change = {};
        change.title = recentChanges[i].title;
        change.pageid = recentChanges[i].pageid;
        change.revid = recentChanges[i].revid;
        change.user = recentChanges[i].user;
        change.newlen = recentChanges[i].newlen;
        change.oldlen = recentChanges[i].oldlen;
        change.sizechange = change.newlen - change.oldlen;
        change.timestamp = recentChanges[i].timestamp;
        change.revid = recentChanges[i].revid;
        changes[change.revid] = change;
        changesIds.push(change.revid);

        latestTimestamp = change.timestamp;

        console.log("Extracted change: " + change.revid);
        //console.log("Change: " + JSON.stringify(change));
      };
      loopCount--;
      if (loopCount > 0) {
        extract(loopCount, latestTimestamp);
      } else {
        insert();
      }
    });
  });

};

var insert = function() {

  var client = new elasticsearch.Client({
    host: 'localhost:9200'
  });

  for (id in changes) {

    var change = changes[id];
    var params = {
      index: 'recentchangesindex',
      type: 'change',
      id: id,
      body: {
        doc: change,
        doc_as_upsert: true
      }
    };

    console.log("Inserting change: " + id);
    client.update(params, function(err, results) {
      if (err != undefined) {
        console.error("Error found: " + (err));
      }
      else {
        console.log("Result: " + JSON.stringify(results));
      }
    })

  }
}
console.log("Extraction started.");
extract(1);
