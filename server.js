/*---------- DEPENDENCIES ----------*/
var express = require('express');
var app = express();

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var _ = require('lodash');

var cors = require('cors');
app.use(cors());

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

/*---CONNECT TO mLAB WITH MONGOOSE----*/
var recipeSchema = mongoose.Schema({
       name: String,
       ingredients: String,
       url: String,
       image: String,
       cookTime: String,
       recipeYield: String,
       datePublished: Date,
       prepTime: String,
       description: String
   });

var Recipe = mongoose.model('Recipe', recipeSchema);
// Recipe.ensureIndex( {"name": 1, "ingredients": 1});

mongoose.connect('mongodb://chef:fridgeit@ds139645.mlab.com:39645/fridgeit-data');

mongoose.connection.on('error', function(err) {
    console.error('Could not connect.  Error:', err);
});

mongoose.connection.once('open', function() {

});

/*---------- GET REQUESTS ----------*/
/*app.get('/recipes/:ingredient', function(request, response) {
    // var test = _.filter(DATA, function(o) {
    //     var patt = new RegExp(request.params.ingredient, 'i');
    //     var res = patt.test(o.ingredients);
    //     return res;
    // });



    response.status(200).header("Access-Control-Allow-Origin", "*").json(test);
} );*/

app.get('/recipes', function(request, response) {
    Recipe.find().exec(function (error, data){
        response.send(data);
    })
});

app.get('/recipes/:ingredient', function(request, response) {
    var ingrtSplit = request.params.ingredient.split('|');
    ingrtSplit = new RegExp("("+ingrtSplit.join(")|(")+")", "im")
    console.log(ingrtSplit);
    Recipe.find({
        "ingredients" : {
            $regex : ingrtSplit 
        }
    })
    .then(function (resultData) {
        var filteredData = "";
        return response.status(200).json(resultData);
    })
    .catch(function(){
        return response.sendStatus(400);
    });
    
        /* Recipe.find({ "ingredients": ingrtSplit[0] }).exec(function(error, recipeResults) {
        var ingrt1Recipes = recipeSchema.ingredients.indexOf(ingrtSplit[0]);
        //var ingrt2Recipes = Recipe.recipes.ingredients.indexOf(ingrtSplit[1]);*/
        // console.log('----------RecipeResult', recipeResults);
});
    
app.listen(3000, 'localhost', function (err) {
    if (err) return console.log(err);
    console.log('listening on port: 3000');

});

exports.app = app;
