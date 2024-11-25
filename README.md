# Backend APIs for SkinOry

This is the backend application for the **SkinOry** project, which serves as an API for performing user authentication and user-related data management.

## Features

- **User Registration** - New users can register by submitting the required data (e.g. username, email, password).
- **User Login** - Users can login using valid credentials to obtain an authentication token.
- **Protected Endpoint** - Uses middleware to protect endpoints that require JWT token authentication.
- **Adding Product** - Endpoint to add products (not for users).
- **Skincare Routine Management** - Endpoint to retrieve, edit or delete user data.

## Technology in Use

- **Node.js** - JavaScript runtime for servers.
- **Express.js** - Framework for building web applications and APIs.
- **JWT (JSON Web Token)** - For authentication and authorization.
- **MySQL2** - Database for storing user data.
- **dotenv** - For storing sensitive environment variables (such as JWT keys, database configuration).
- **ESLint** - Linter to ensure consistent code quality.
- **cookie-parser** - to read, parse, and easily manage cookies sent by clients via HTTP headers.
- **morgan** - Simplify the management of HTTP request logs (GET, POST, etc.) to the server.
- **bcrypt** - Create a hash for the password so that it is not stored in plaintext in the database.

## Installations

### Prerequisites

Make sure you have **Node.js** and **npm** (Node Package Manager) installed on your system.

### Installation Steps

1. **Clone repository:**

   ```bash
   git clone https://github.com/Ar1veeee/Backend_SkinOry_CC.git
   ```

2. **Install dependencies:**
   Go into the project directory and run the following command to install all the required dependencies.

   ```bash
   cd Backend_SkinOry_CC
   npm install
   ```

3. **Environment variable configuration:**
   Create a `.env` file and customize the environment variable values according to your configuration.

   ```bash
   nano .env
   ```

   Inside `.env`, customize it with your database settings and JWT keys:

   ```ini
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=skinory
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. **Running the application:**
   Once the installation is complete and the configuration is set, run the application with the following command:

   ```bash
   npm start
   ```

   By default, the application will run on port 5000. You can access it via `http://localhost:5000`.

## Endpoints

### Middleware

**Error Active Token**:

```json
{
  "status": 401,
  "message": "Access Token Required"
}
```

**Error Expired Token**:

```json
{
  "status": 403,
  "message": "Invalid or Expired Token"
}
```

**Error Format Active Token**:

#### Authorization: Bearer <active_token>

```json
{
  "status": 401,
  "message": "Invalid Token Format"
}
```

### Authentication

### 1. **User Registration**

- **URL**: `/auth/register`
- **Metode**: `POST`
- **Body**:

  ```json
  {
    "username": "user_name",
    "email": "email@example.com",
    "password": "password123"
  }
  ```

- **Response**:

  ```json
  {
    "message": "Registrasi Successfully"
  }
  ```

  **Error Email Used**:

  ```json
  {
    "status": 400,
    "message": "Email Already Exist"
  }
  ```

  **Error Format Password**:

  ```json
  {
    "status": 400,
    "message": "Password must be at least 8 characters and begin with uppercase letters."
  }
  ```

  **Error Server**:

  ```json
  {
    "status": 500,
    "message": "An unexpected error occurred during registration."
  }
  ```

### 2. **Login Pengguna**

- **URL**: `/auth/login`
- **Metode**: `POST`
- **Body**:
  ```json
  {
    "email": "email@example.com",
    "password": "password123"
  }
  ```
- **Response**:

  ```json
  {
    "message": "Login Successfully",
    "loginResult": {
      "userID": "user.id",
      "username": "user.username",
      "active_token": "activeToken"
    }
  }
  ```

  ## **Cookies**

  ### Set-Cookie: refresh_token=<your_refresh_token>; HttpOnly; Path=/; Secure

  **Error User**:

  ```json
  {
    "status": 404,
    "message": "User Not Found"
  }
  ```

  **Error Password**:

  ```json
  {
    "status": 400,
    "message": "Incorrect Password"
  }
  ```

  **Error Server**:

  ```json
  {
    "status": 500,
    "message": "An unexpected error occurred during registration."
  }
  ```

## Endpoint yang Dilindungi

### 3. **Profile**

- **URL**: `/profile/:user_id`
- **Metode**: `GET`
- **Response**:

  ```json
  {
    "Profile": {
      "userID": 1,
      "username": "username",
      "skin_type": "user skin_type",
      "email": "user email"
    }
  }
  ```

  **Error Missing Required Fields**:

  ```json
  {
    "status": 404,
    "message": "User Not Found"
  }
  ```

  **Error Show Profile**:

  ```json
  {
    "status": 500,
    "message": "Error Show Profile",
    "error": "Detailed error message from the server"
  }
  ```
### 4. **Add Product**

- **URL**: `/product`
- **Metode**: `POST`
- **Body**:

  ```json
  [
    {
      "name_product": "Jaya Toner",
      "skin_type": "oily",
      "category": "toner",
      "usage_time": "night",
      "image_url": "link image",
      "price": 20000,
      "rating": 4.7
    },
    {
      "name_product": "Makmur Toner",
      "skin_type": "oily",
      "category": "toner",
      "usage_time": "night",
      "image_url": "link image",
      "price": 20000,
      "rating": 4.7
    }
  ]
  ```

- **Response**:

  ```json
  {
    "message": "Product Added Successfully"
  }
  ```

  **Error Missing Required Fields**:

  ```json
  {
    "status": 400,
    "message": "All fields are required: name_product, skin_type, category, usage_time, image_url, price, rating"
  }
  ```

  **Error Product Already Exists**:

  ```json
  {
    "status": 400,
    "message": "Product /name_product for skin type /skin_type already exists"
  }
  ```

  **Error Missing Required Fields**:

  ```json
  {
    "status": 500,
    "message": "Failed to add product",
    "error": "Detailed error message from the server"
  }
  ```

### 5. **Skincare Day Routine List**

- **URL**: `/routine/:user_id/day`
- **Metode**: `GET`
- **Response**:

  ```json
  {
    "routines": [
      {
        "id_product": 1,
        "name_product": "Jaya Toner",
        "skin_type": "dry",
        "category": "toner"
      }
    ]
  }
  ```

  **Error Bad Request**:

  ```json
  {
    "status": 400,
    "message": "User ID is required"
  }
  ```

  **Error Internal Server**:

  ```json
  {
    "status": 500,
    "message": "Error fetching user routines",
    "error": "Error message"
  }
  ```

### 6. **Skincare Night Routine List**

- **URL**: `/routine/:user_id/night`
- **Metode**: `GET`
- **Response**:

  ```json
  {
    "routines": [
      {
        "id_product": 1,
        "name_product": "Jaya Toner",
        "skin_type": "dry",
        "category": "toner"
      }
    ]
  }
  ```

  **Error Bad Request**:

  ```json
  {
    "status": 400,
    "message": "User ID is required"
  }
  ```

  **Error Internal Server**:

  ```json
  {
    "status": 500,
    "message": "Error fetching user routines",
    "error": "Error message"
  }
  ```
### 7. **Skincare Day Routine Delete**

- **URL**: `/routine/:user_id/day`
- **Metode**: `DELETE`
- **Response**:

  ```json
  {
    "status": 202,
    "message": "Day Routine Deleted Successfully"
  }
  ```

  **Error Bad Request**:

  ```json
  {
    "status": 404,
    "message": "User Not Found"
  }
  ```

  **Error Internal Server**:

  ```json
  {
    "status": 500,
    "message": "Error Deleting Dat Routines",    
  }
  ```
### 8. **Skincare Night Routine Delete**

- **URL**: `/routine/:user_id/night`
- **Metode**: `DELETE`
- **Response**:

  ```json
  {
    "status": 202,
    "message": "Night Routine Deleted Successfully"
  }
  ```

  **Error Bad Request**:

  ```json
  {
    "status": 404,
    "message": "User Not Found"
  }
  ```

  **Error Internal Server**:

  ```json
  {
    "status": 500,
    "message": "Error Deleting Dat Routines",    
  }
  ```

### 9. **Product Recommendation List**

- **URL**: `/routine/:user_id/:category`
- **Metode**: `GET`
- **Response**:

  ```json
  {
    "products": [
      {
        "id_product": 2,
        "name_product": "Jaya Toner",
        "skin_type": "dry",
        "category": "toner",
        "usage_time": "general",
        "image_url": "link image",
        "price": "20000.00",
        "rating": "4.70",
        "created_at": "2024-11-22T09:07:21.000Z"
      },
      {
        "id_product": 3,
        "name_product": "Skintific Toner",
        "skin_type": "dry",
        "category": "toner",
        "usage_time": "general",
        "image_url": "link image",
        "price": "20000.00",
        "rating": "4.70",
        "created_at": "2024-11-23T10:23:57.000Z"
      },
      {
        "id_product": 4,
        "name_product": "Alief Toner",
        "skin_type": "dry",
        "category": "toner",
        "usage_time": "general",
        "image_url": "link image",
        "price": "20000.00",
        "rating": "4.70",
        "created_at": "2024-11-23T10:24:10.000Z"
      }
    ]
  }
  ```

  **Error Bad Request**:

  ```json
  {
    "status": 400,
    "message": "User ID, and Category are required"
  }
  ```

  **Error Internal Server**:

  ```json
  {
    "status": 500,
    "message": "Error fetching recommended products",
    "error": "Error message"
  }
  ```

### 10. **Add Day Skincare Routine**

- **URL**: `/routine/:user_id/:category/day/:product_id`
- **Metode**: `POST`

- **Response**:

  ```json
  {
    "message": "Day Routine added successfully",
    "product": {
      "id_product": 2,
      "name_product": "Example Product",
      "skin_type": "oily",
      "category": "toner",
      "usage_time": "general",
      "image_url": "link image",
      "price": 20000,
      "rating": 4.7,
      "created_at": "2024-11-22T09:07:10.000Z"
    }
  }
  ```

  **Error Bad Request**:

  ```json
  {
    "status": 400,
    "message": "User ID, Product ID, and category are required"
  }
  ```

  ```json
  {
    "status": 400,
    "message": "User not found"
  }
  ```

  ```json
  {
    "status": 400,
    "message": "Product not found"
  }
  ```

  ```json
  {
    "status": 400,
    "message": "Skin type mismatch: Product skin type is 'oily' but user's skin type is 'dry'"
  }
  ```

  ```json
  {
    "status": 400,
    "message": "Product does not match the provided category 'facewash'"
  }
  ```

  ```json
  {
    "status": 400,
    "message": "Routine already exists"
  }
  ```

  **Error Internal Server**:

  ```json
  {
    "status": 500,
    "message": "Error adding routine",
    "error": "Error message"
  }
  ```

### 11. **Add Night Skincare Routine**

- **URL**: `/routine/:user_id/:category/night/:product_id`
- **Metode**: `POST`

- **Response**:

  ```json
  {
    "message": "Night Routine added successfully",
    "product": {
      "id_product": 2,
      "name_product": "Example Product",
      "skin_type": "oily",
      "category": "toner",
      "usage_time": "general",
      "image_url": "link image",
      "price": 20000,
      "rating": 4.7,
      "created_at": "2024-11-22T09:07:10.000Z"
    }
  }
  ```

  **Error Bad Request**:

  ```json
  {
    "status": 400,
    "message": "User ID, Product ID, and category are required"
  }
  ```

  ```json
  {
    "status": 400,
    "message": "User not found"
  }
  ```

  ```json
  {
    "status": 400,
    "message": "Product not found"
  }
  ```

  ```json
  {
    "status": 400,
    "message": "Skin type mismatch: Product skin type is 'oily' but user's skin type is 'dry'"
  }
  ```

  ```json
  {
    "status": 400,
    "message": "Product does not match the provided category 'facewash'"
  }
  ```

  ```json
  {
    "status": 400,
    "message": "Routine already exists"
  }
  ```

  **Error Internal Server**:

  ```json
  {
    "status": 500,
    "message": "Error adding routine",
    "error": "Error message"
  }
  ```

### 12. **Refresh Token**

- **URL**: `/refresh`
- **Metode**: `POST`
- **Body**:

  ```json
  {
    "newPassword": "Newpassword"
  }
  ```

- **Response**:

  ```json
  {
    "message": "Token Updated"
    "loginResult": {
        "userID": "user.id",
        "username": "user.username",
        "active_token": "activeToken"
      }
  }
  ```

  **Error User**:

  ```json
  {
    "status": 404,
    "message": "User Not Found"
  }
  ```

  **Error Invalid Token**:

  ```json
  {
    "status": 403,
    "message": "Invalid Refresh Token'"
  }
  ```

  **Error Expired Refresh Token**:

  ```json
  {
    "status": 500,
    "message": "Invalid or Expired Refresh Token"
  }
  ```

### 13. **Edit Password**

- **URL**: `/profile/:user`
- **Metode**: `POST`

- **Body**:

  ```json
  {
    "newPassword": "Cupangbb"
  }
  ```

- **Response**:

  ```json
  {
    "status": 201,
    "message": "Update Password Success"
  }
  ```

  **Error Not Inserted**:

  ```json
  {
    "status": 400,
    "message": "Password needs to be filled in"
  }
  ```

  **Error Format Password**:

  ```json
  {
    "status": 400,
    "message": "Password must be at least 8 characters and begin with uppercase letters."
  }
  ```

  **Error Expired Refresh Token**:

  ```json
  {
    "status": 500,
    "message": "Error Updating Password"
  }
  ```

### 14. **Add Best Product**

- **URL**: `/best`
- **Metode**: `POST`

- **Body**:

  ```json
  [
    {
      "name_product": "Facewash a",
      "skin_type": "dry",
      "category": "facewash",
      "image_url": "link image",
      "store_url": "link store",
      "price": 20000.0,
      "rating": 4.7
    },
    {
      "name_product": "Facewash b",
      "skin_type": "dry",
      "category": "facewash",
      "image_url": "link image",
      "store_url": "link store",
      "price": 20000.0,
      "rating": 4.7
    }
  ]
  ```

- **Response**:

  ```json
  {
    "message": "Product added successfully"
  }
  ```

  **Error Not Inserted**:

  ```json
  {
    "status": 400,
    "message": "Name Product, Category, Price, Rating, Image URL, Store URL are required"
  }
  ```

  **Error Expired Refresh Token**:

  ```json
  {
    "status": 500,
    "message": "Error Updating Password"
  }
  ```

##
