const Cart = require('../models/Cart');
const Book = require('../models/Book');

exports.addToCart = async (req, res) => {
    try {
      const { quantity } = req.body;
const  bookId = req.params.bookId
const user = req.user.id;
      let cart = await Cart.findOne({ user });
  
      if (cart) {
        const itemIndex = cart.items.findIndex(item => item.book.toString() === bookId);
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += quantity;
        } else {
          cart.items.push({ book: bookId, quantity });
        }
      } else {
        cart = new Cart({ user, items: [{ book: bookId, quantity }] });
      }
  
      await cart.save();
      return res.status(200).json({ success: true,
        msg: 'Added to cart'
        });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  };
  
  // Remove a book from cart
  exports.removeFromCart = async (req, res) => {
    try {
      const  bookId = req.params.bookId
      const user = req.user.id;

      let cart = await Cart.findOne({ user });
  
      if (cart) {
        cart.items = cart.items.filter(item => item.book.toString() !== bookId);
        await cart.save();
      }
  
      return res.status(200).json({ success: true,
        msg: 'Remove from cart'});
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  };
  

  exports.checkout = async (req, res) => {
    try {
      const  bookId = req.params.bookId
      const user = req.user.id;
  
 
  
      let cart = await Cart.findOne({ user });
  
      if (!cart) {
        return res.status(404).json({ success: false,message: "Cart not found." });
      }
  
      // Find the item in the cart with the given bookId
      const itemIndex = cart.items.findIndex(item => item.book.toString() === bookId);
  
      // If item not found, return an error
      if (itemIndex === -1) {
        return res.status(404).json({ success: false,message: "Item not found in the cart." });
      }
  
      // Update the status of the item
      cart.items[itemIndex].status = true;
  
      // Save the updated cart
      await cart.save();
  
      return res.status(200).json({ success: true,
        msg: 'Add to checkout'});
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  };

  // Get cart items
  exports.getCart = async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.user.id });
  
      if (!cart) {
        return res.status(200).json({ success: true, msg: 'Cart not found', data: [] });
      }
  
      // Extract book IDs and quantities from the cart
      const cartItems = cart.items.map(item => ({ bookId: item.book, quantity: item.quantity,status:item.status }));
  
      // Fetch book details for each book ID
      const booksData = await Promise.all(cartItems.map(async (item) => {
        const book = await Book.findById(item.bookId);
        return {
          bookDetails: book,
          quantity: item.quantity,
          status: item.status
        };
      }));
  
      return res.status(200).json({ success: true, msg: 'Cart found', data: booksData });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  };
  

  exports.getCartAdmin = async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.params.userId });
      if (!cart) {
        return res.status(404).json({success: false, msg: 'Cart not found' });
      }
        // Extract book IDs and quantities from the cart
        const cartItems = cart.items.map(item => ({ bookId: item.book, quantity: item.quantity,status:item.status }));
  
        // Fetch book details for each book ID
        const booksData = await Promise.all(cartItems.map(async (item) => {
          const book = await Book.findById(item.bookId);
          return {
            bookDetails: book,
            quantity: item.quantity,
            status: item.status
          };
        }));
    
        return res.status(200).json({ success: true, msg: 'Cart found', data: booksData });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, error: err.message });
    }
  };

