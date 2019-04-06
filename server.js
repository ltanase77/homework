const express = require("express");
const app = express();
const port = process.env.PORT || 6060;

// Setting the view engine to pug and the directory for serving view files
app.set('views', './templates');
app.set('view engine', 'pug');

app.get('/', function(req, res) {
    res.render('index', {
        days: ["luni", "marti", "miercuri", "joi", "vineri"],
    });
});


// Using the static files middleware
app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/node_modules'));
// app.use(express.static(__dirname + '/bower_components'));

app.listen(port, console.log(`Server has started on port: ${port}`));
