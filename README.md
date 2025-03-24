# Real Estate Chatbot Backend

This is the backend for a **Real Estate Search Chatbot** built using **Node.js, Express, MongoDB, JWT Authentication, and Bcrypt**. It provides APIs for **user authentication, property search (via chatbot or filter form), and managing saved properties**.

## Features
- **User Authentication**: Register and login users using JWT and bcrypt.
- **Property Search**: Search properties using filters like budget, location, size, bedrooms, and amenities.
- **Property Management**: Save, view, and delete saved properties for authenticated users.
- **Retrieve Properties**: Fetch all properties or a single property by ID.

## Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB** (Mongoose ORM)
- **JWT Authentication** (JSON Web Tokens)
- **Bcrypt.js** (Password Hashing)

---

## Setup & Installation

### 1. Clone the Repository
```sh
git clone https://github.com/your-username/real-estate-chatbot-backend.git
cd real-estate-chatbot-backend
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Run the Server
```sh
npm start
```
Server will run on `http://localhost:5000`.

---

## API Endpoints

### **Authentication APIs**

#### **Register User**
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```

#### **Login User**
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```

#### **Get Current User** (Authenticated User)
- **GET** `/api/auth/me?id={userId}`

---

### **Property APIs**

#### **Get All Properties**
- **GET** `/api/properties`

#### **Search Properties (Filtered Properties)**
- **POST** `/api/properties/search`
- **Body:**
  ```json
  {
    "minPrice": 500000,
    "maxPrice": 800000,
    "location": "Boston",
    "bedrooms": 2,
    "bathrooms": 2,
    "size": 1500
  }
  ```

#### **Get Property by ID**
- **GET** `/api/properties?id={propertyId}`

---

### **User-Saved Properties APIs**

#### **Save Property** (Requires Authentication)
- **POST** `/api/users/properties`
- **Body:**
  ```json
  {
    "propertyId": "6"
  }
  ```

#### **Get Saved Properties**
- **GET** `/api/users/properties`

#### **Delete Saved Property**
- **DELETE** `/api/users/properties/{propertyId}`

---

```sh
vercel
```

---

