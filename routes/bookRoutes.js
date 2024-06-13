const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const {authMiddleware,authorize} = require('../middlewares/authMiddleware');

router.get('/get-books',authMiddleware, bookController.getBooks);
router.get('/get-book/:id',authMiddleware, bookController.getBook);
router.post('/create-book',authMiddleware, authorize(["admin"]), bookController.createBook);
router.put('/update-book/:id',authMiddleware, authorize(["admin"]), bookController.updateBook);
router.delete('/delete-book/:id' ,authMiddleware,authorize(["admin"]), bookController.deleteBook);
module.exports = router;