# MakeupCity — Full-Stack E-Commerce Website 💄

MakeupCity is a full-stack e-commerce website for a cosmetics and beauty store.  
The project provides a complete shopping experience for customers along with an admin panel for managing the store.

## ✨ Features

### Customer Side

- Browse makeup and beauty products
- View products by category
- View detailed product information
- Add products to cart
- Increase/decrease product quantities
- Remove products from cart
- Add products to favorites
- User signup and login
- Checkout system
- Multiple payment method options
- Order placement
- Order confirmation email
- Order status updates through email

### Admin Panel

- Admin login
- Admin dashboard
- Product management
- Add, edit and delete products
- View all customer orders
- View complete order details
- Update order status
- Automatic customer email notifications when order status changes
- View registered users
- View user details
- View user's order history
- View total orders and total amount spent by each user

## 🛠️ Technologies Used

### Frontend

- React.js
- Vite
- React Router
- Axios
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Nodemailer
- CORS

## 📁 Project Structure

```text
MakeupCity-Ecommerce/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── admin/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vercel.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md