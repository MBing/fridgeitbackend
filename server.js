/*---------- DEPENDENCIES ----------*/
var express = require('express');
var app = express();

var mongoose = require('mongoose');
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
    console.log('___________request ', request.params.ingredient);
    var ingrtSplit = request.params.ingredient.split('|').join(' ');
    console.log('___________ingrtSplit', ingrtSplit);
    var recipeFlag = false;
    var result = {};
    result.recipeResults = [];
    // for (var i = 0; i < ingrtSplit.length; i++) {
        Recipe.find({
            $text : { 
                    $search: ingrtSplit 
                }
            }, {
                ingredients: {    
                    $meta: "textScore"
                
                }
            })
        // .toArray(function (error, items) {
        //         response.status(200).json(items);
        // })
        .exec(function (error, recipe) {
                if(error) return;
                console.log('-_-_-_-_-_ recipe', recipe );
                result.recipeResults.push(recipe);
        
            // return recipe;
        })
        .then(function () {
            return response.status(200).json(result);
        })
        // .catch(function(){
        //     return response.sendStatus(400);
        // });
        // console.log('-_-_-_-_-_ item', item );
        // item.then(function (data) {
        //     result.recipeResults.push(data);
        //     return response.status(200).json(result);
        // })
        // recipeResults.push(item);
        // recipeResults.push(ingrtRecipes);
        // recipeFlag = true;
    // }
    
        /* Recipe.find({ "ingredients": ingrtSplit[0] }).exec(function(error, recipeResults) {
        var ingrt1Recipes = recipeSchema.ingredients.indexOf(ingrtSplit[0]);
        //var ingrt2Recipes = Recipe.recipes.ingredients.indexOf(ingrtSplit[1]);*/
        // console.log('----------RecipeResult', recipeResults);
    // result.recipe = recipeResults;
    // if (recipeFlag) {
    //     return response.status(200).json(result);
    // }
        // response.sendStatus(404);
});
    

app.listen(process.env.PORT || 9000);

exports.app = app;