const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const Building = require('./models/building');
const Element = require('./models/element');
const Lock = require('./models/lock');
const { MongoClient } = require('mongodb');



// express app
const app = express();

// listen for requests
app.listen(3000);

app.use(bodyParser.json());

// connect to the database
mongoose.connect('mongodb://127.0.0.1:27017/EmissionsCalculatorDB', { useNewUrlParser: true });

var conn = mongoose.connection;

conn.on('connected', function () {
  console.log('database is connected successfully');
});
conn.on('disconnected', function () {
  console.log('database is disconnected successfully');
})

conn.on('error', console.error.bind(console, 'connection error:'));

module.exports = conn;


// register view engine
app.set('view engine', 'ejs');

app.get('/', (req, res) => {

  Building.find({}).then(result => {

    res.render('index', { title: 'Carbon Emission Calculator', buildings: result });
  })
    .catch(err => {
      console.log(err);
    });

});

app.use('/style', express.static(__dirname + '/style'));
app.use('/embedDemo', express.static(__dirname + '/embedDemo'));
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/CityGML', express.static(__dirname + '/CityGML'));

app.post('/update_entry', bodyParser.text({ limit: '50mb' }), (req, res) => {

  const reqJSON = JSON.parse(req.body);

  //turn data into mongo db schema
  const building = new Building(reqJSON);

  //save to mongo db
  building.save()
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });

  res.sendStatus(200);
})

// delete building from db
app.post('/delete', bodyParser.text({ limit: '50mb' }), function (req, res) {
  const reqJSON = JSON.parse(req.body);
  var name = { "name": reqJSON.name };
  console.log(name);
  Building.deleteOne(name, function (err, result) {
    if (err) throw err;
    res.redirect('/');
  });
});


// gets the blueprint of the building as base64 encoded image and displays it in new webpage
app.get('/image/:name', (req, res) => {
  const name = req.params.name;
  console.log(name);
  Building.findOne({ name: name }).then(result => {
    const image = result.blueprint;
    res.render('image', { title: 'Image/' + name, image: image });
  })
    .catch(err => {
      console.log(err);
    });


})

// gets the information from one building with the corresponding name
app.get('/get_info/:name', (req, res) => {
  const name = req.params.name;
  console.log(name);
  Building.findOne({ name: name }).then(result => {
    res.send(result);
  })
    .catch(err => {
      console.log(err);
    });
})

// gets the gwp information from all elements
app.get('/get_gwp', (req, res) => {

  Element.find().then(result => {
    res.send(result);
  })
    .catch(err => {
      console.log(err);
    });
})

// pessimistic locking
// removes any entry from the lock collection if it is older than 1 minute (e.g. the user closes the tab without releasing the lock)).
// if there is an entry, someone is editing the database and noone else is able to update the db
// if there is no entry, the db is editable again
setInterval(function () {
  Lock.findOneAndDelete({
    updatedAt: {
      $lt: new Date(new Date().getTime() - 1000 * 60 * 1)
    }
  }).then(result => {
    if (result != null) {
      console.log("removed element " + result._id + " from " + result.createdAt);
    }
  })
}, 5000);


// checks whether en entry in the db exists, if not, a new entry gets created and the code 200 is returned. This means that the browser successfully got the lock and can now enable the from
// if there already is an entry, the code 400 returned and the form gets disabled (see scripts/lock.js)
app.get('/get_lock', (req, res) => {

  Lock.find().then(result => {
    if (result.length == 0) {
      new Lock().save().then(result => {
        res.sendStatus(200);
      })
        .catch(err => {
          console.log(err);
        });

    } else {
      res.sendStatus(400);
    }
  })
    .catch(err => {
      console.log(err);
    });
})


// removes the entry in the db and sends status 200 to the browser
app.get('/clear_lock', (req, res) => {

  Lock.findOneAndDelete().then(result => {
    if (result != null) {
      console.log("removed element " + result._id + " from " + result.createdAt);
    }
  })
  res.sendStatus(200);
});


// removes the entry in the db and creates a new one to update the timestamp and sends status 200 to the browser
app.get('/update_lock', (req, res) => {

  Lock.findOneAndDelete().then(result => {
    if (result != null) {
      console.log("removed element " + result._id + " from " + result.createdAt);
      new Lock().save().then(result => {
        res.sendStatus(200);
      })
        .catch(err => {
          console.log(err);
        });

    }
  })

});

app.get('/sensor', (req, res) => {

  res.render('sensor', {});

});

app.get('/api/sensordata', (req, res) => {

  MongoClient.connect("mongodb://127.0.0.1:27017/", function(err, db) {
    if (err) throw err;
    var dbo = db.db("sensor");

    dbo.collection("sensorcollection").find({}).sort({ _id: -1 }).limit(1).toArray(function(err, result) { 
        if (err) throw err;
        res.send({
            status: 0,
            message: "send data",
            data: result
        })
        db.close();
    });
});

});