/*
    Name: Prasiddhi Gyawali
    Assignment: PA 8
    Description: This javascript file sets up a server
    that will set up the chatty UI which allows for
    people to communicate with one another.
*/

// dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const host = '192.168.1.21';
const port = 3000;

// set up app & mongodb, establish connection
const app = express();
mongoose.set('strictQuery', false);
const mongoDBURL = "mongodb://127.0.0.1:27017/chats";
try{
  mongoose.connect(
      mongoDBURL,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => console.log("Connected"),
  );
} catch (e) {
  console.log("Connection failed");
}

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

// set up schema for data
var Schema = mongoose.Schema;
var ItemsSchema = new Schema({
  title: String,
  description: String,
  image: String,
  price: Number,
  status: String
});
var Items = mongoose.model('Items', ItemsSchema );

var UsersSchema = new Schema({
  username: String,
  password: String,
  listings: { type : Array , "default" : [] },
  purchases: { type : Array , "default" : [] }
});
var Users = mongoose.model('Users', UsersSchema );

app.use(express.static('public_html'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// upon get request format the data found in the schema
// to be able to display the information directly as the html
// calls for
app.get('/get/users/', (req, res) => {
  Users.find().exec((err, usrs) => {
    res.send(JSON.stringify(usrs));
  });
});

app.get('/get/items/', (req, res) => {
  Items.find().exec((err, items) => {
    res.send(JSON.stringify(items));
  });
});

app.get('/get/listings/:username', (req, res) => {
  var otpt = [];
  var prom = [];
  Users.findOne({username: req.params.username})
    .then((usrs) => {
      for(i in usrs.listings) {
        prom.push(Items.findOne({_id:usrs.listings[i]})
                    .then((item) => {
                      otpt.push(item);
                    })
        )
      }
    })
    .then((ret) => {
      const resProm = Promise.all(prom);
      resProm.then(() => {
        res.send(JSON.stringify(otpt));
      })
    });
});

app.get('/get/purchases/:username', (req, res) => {
  var otpt = [];
  var prom = [];
  Users.findOne({username: req.params.username})
    .then((usrs) => {
      for(i in usrs.purchases) {
        prom.push(Items.findOne({_id:usrs.purchases[i]})
                    .then((item) => {
                      otpt.push(item);
                    })
        )
      }
    })
    .then((ret) => {
      const resProm = Promise.all(prom);
      resProm.then(() => {
        res.send(JSON.stringify(otpt));
      })
    });
});

app.get('/search/users/:keyword', (req, res) => {
  Users.find({username: {$regex: req.params.keyword}}).
  exec((err, usrs) => {
    res.send(JSON.stringify(usrs));
  });
});

app.get('/search/items/:keyword', (req, res) => {
  Items.find({description: {$regex: req.params.keyword}}).
  exec((err, items) => {
    res.send(JSON.stringify(items));
  });
});

// upon post request, save an instance of the schema to
// hold the proper information
app.post('/add/user/', (req, res) => {
    console.log(req.body);
    info = req.body;
    usr = new Users({
      username: info.user, 
      password: info.pass
    });
    usr.save((err) => {
        if (err) {
          console.log("ERRROR");
          res.end('ERROR?');
        } else {
          console.log("SAVED");
          res.end('SAVED');
        }
    });
});

app.post('/add/item/:username', (req, res) => {
  info = req.body;
  Users.findOne({username:req.params.username}).exec(function(err,res){
    item = new Items({
      title: info.title,
      description: info.desc,
      image: info.image,
      price: info.price,
      status: info.stat
    });
    res.listings.push(item._id);
    res.save();
    item.save((err) => {
      if (err) {
        console.log('err')
      } else {
        console.log('wordks')
      }
    });
  })
});

app.listen(port, () =>
 console.log(`App listening at http://${host}:${port}`));