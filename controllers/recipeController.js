const Recipe = require('../models/recipe');
const fs = require('fs');

// Show all recipes
const showRecipes = (req, res) => {
    Recipe.find({})
        .then(recipes => {
            res.render('index', {
                recipes: recipes,
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error fetching recipes');
        });
};

// Show add recipe form
const showAddRecipe = (req, res) => {
    res.render('form');
};

// Add new recipe
const addRecipe = (req, res) => {
    const { title, content, updateId } = req.body;

    if (updateId) {
        if (req.file) {
            Recipe.findById(updateId).then((oldRecipe) => {
                if (oldRecipe && oldRecipe.image) {
                    try {
                        fs.unlinkSync(oldRecipe.image);
                    } catch (err) {
                        console.error('Error deleting old image:', err);
                    }
                }
                let image = req.file.path;
                Recipe.findByIdAndUpdate(updateId, {
                    title,
                    content,
                    image
                }).then(() => {
                    console.log("Recipe updated successfully");
                    return res.redirect('/recipes');
                }).catch(err => {
                    console.error(err);
                    res.status(500).send('Error updating recipe');
                });
            }).catch(err => {
                console.error(err);
                res.status(500).send('Error finding recipe');
            });
        } else {
            Recipe.findByIdAndUpdate(updateId, {
                title,
                content
            }).then(() => {
                console.log("Recipe updated successfully");
                return res.redirect('/recipes');
            }).catch(err => {
                console.error(err);
                res.status(500).send('Error updating recipe');
            });
        }
    } else {
        if (!req.file) {
            return res.status(400).send('Image is required for new recipes');
        }
        Recipe.create({
            title,
            content,
            image: req.file.path
        }).then(() => {
            console.log("Recipe added successfully");
            return res.redirect('/recipes');
        }).catch(err => {
            console.error(err);
            res.status(500).send('Error adding recipe');
        });
    }
};

// Show update recipe form
const showUpdateRecipe = (req, res) => {
    let updateId = req.query.updateId;
    if (!updateId) {
        return res.status(400).send('Update ID is required');
    }
    Recipe.findById(updateId)
        .then((recipe) => {
            if (!recipe) {
                return res.status(404).send('Recipe not found');
            }
            return res.render('update', { recipe });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error fetching recipe');
        });
};

// Delete recipe
const deleteRecipe = (req, res) => {
    let deleteId = req.params.id;
    if (!deleteId) {
        return res.status(400).send('Delete ID is required');
    }

    Recipe.findById(deleteId)
        .then((recipe) => {
            if (!recipe) {
                return res.status(404).send('recipe not found');
            }
            if (recipe.image) {
                try {
                    fs.unlinkSync(recipe.image);
                } catch (err) {
                    console.error('Error deleting image:', err);
                }
            }
            return Recipe.findByIdAndDelete(deleteId);
        })
        .then(() => {
            console.log("Recipe deleted successfully");
            return res.redirect('/recipes');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error deleting recipe');
        });
};

// Show single recipe
const showSingleRecipe = (req, res) => {
    Recipe.findById(req.params.id)
        .then(recipe => {
            if (!recipe) {
                return res.status(404).send('Recipe not found');
            }
            res.render('recipe', { recipe });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error fetching recipe');
        });
};

module.exports = {
    showRecipes,
    showAddRecipe,
    addRecipe,
    showUpdateRecipe,
    deleteRecipe,
    showSingleRecipe
}; 