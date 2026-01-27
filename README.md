# iStayz
Hotel Booking Management System

# HRS – Hotel Reservation System

HRS (Hotel Reservation System) is a full-stack web application that allows users to browse hotels, check room availability, and make reservations through a secure and scalable web platform.

This project is built using the MERN stack and follows best practices for backend security, frontend structure, and version control.

---

## Features

User signup and login.
Search hotels by location, check-in,check-out and no.of adults and filter hotels by rating,reviews,max -price.
Add/remove hotels to wishlist.
Booking confirmation invoice and payment integration.
Admin dashboard for hotel ,booking and coupon management.
Users can search and apply coupons while booking.
Authorized users can review to the website and admin can manage the reviews.
Chatbot for any queries regarding payments,bookings and accounts.

---

## 🛠 Tech Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JWT Authentication

### Tools & Utilities
- Git & GitHub
- Postman (API testing)
- dotenv

---

## 📁 Project Structure

HRS/
│
├── frontend/
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── .gitignore
│
├── backend/
│ ├── src/
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ ├── package.json
│ └── .gitignore
│
├── .gitignore
└── README.md


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/HRS.git
cd HRS
2️⃣ Backend Setup
cd backend
npm install

Start the backend server:

npm start
3️⃣ Frontend Setup
cd ../frontend
npm install
npm start
The frontend will run on:

http://localhost:3000
🔐 Environment Variables
This project uses environment variables to protect sensitive data.

 Future Enhancements
Payment gateway integration

Booking history and invoices

Email notifications

Cloud deployment
