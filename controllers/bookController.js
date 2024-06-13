const Book = require('../models/Book');

const Cart = require('../models/Cart');



exports.getBooks = async (req, res) => {
  try {
    const { author, category, search } = req.query;
    let query = {};

    if (author) {
      query.author = { $regex: author, $options: 'i' }; // Case-insensitive search
    }
    if (category) {
      query.category = { $regex: category, $options: 'i' }; // Case-insensitive search
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    const books = await Book.find(query);
 // Extract unique authors and categories from the books array
 let authors = new Set();
 let categories = new Set();

 books.forEach(book => {
   authors.add(book.author);
   categories.add(book.category);
 });

 // Convert Set to Array
 authors = [...authors];
 categories = [...categories];
    return res.status(200).json({ success: true, data: books,authors,categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, msg: 'Book not found' });
    }

    // Fetch cart details for the authenticated user
    const cart = await Cart.findOne({ user: req.user.id });

    // Check if the book is in the user's cart and its checkout status
    let inCart = false;
    let checkoutStatus = false;
    if (cart) {
      const cartItem = cart.items.find(item => item.book.toString() === req.params.id);
      if (cartItem) {
        inCart = true;
        checkoutStatus = cartItem.status;
      }
    }

    // Return the book details along with cart info
    return res.status(200).json({
      success: true,
      msg: 'Book found',
      data: {
        book,
        inCart,
        checkoutStatus
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createBook = async (req, res) => {
  const { name, author,category, price} = req.body;
  try {
    const newBook = new Book({  name, author, category,price });
    const book = await newBook.save();
    return res.status(200).json({success: true,msg: 'Book created successfully',data:book });
  } catch (err) {
    res.status(500).json({ success: false,error: err.message });
  }
};

exports.updateBook = async (req, res) => {
  const {  name, author,category, price } = req.body;
  try {
    let book = await Book.findById(req.params.id);
    if (!book){
       return res.status(404).json({success: false, msg: 'Book not found' });
    }
    book.name = name;
    book.author = author;
    book.price = price;
    book.category = category;
    await book.save();
    return res.status(200).json({success: true,msg: 'Book updated successfully'});
  } catch (err) {
    res.status(500).json({ success: false,error: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false,msg: 'Book not found' });
    }
    await Book.deleteOne({ _id: req.params.id });

    return res.status(200).json({success: true,msg: 'Book removed successfully'});
  } catch (err) {
    res.status(500).json({ success: false,error: err.message });
  }
};