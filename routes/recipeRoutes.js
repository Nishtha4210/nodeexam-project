const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isAuthenticated } = require('../middleware/auth');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// recipe routes - public access for viewing recipes
router.get('/', recipeController.showRecipes);
// Protected and static routes must come before dynamic :id route
router.get('/add', isAuthenticated, recipeController.showAddRecipe);
router.post('/add', isAuthenticated, upload.single('image'), recipeController.addRecipe);
router.get('/update', isAuthenticated, recipeController.showUpdateRecipe);
router.get('/delete/:id', isAuthenticated, recipeController.deleteRecipe);
// Dynamic route last
router.get('/:id', recipeController.showSingleRecipe);

module.exports = router; 