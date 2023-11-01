# nodejs-login-api
A Node.js API for user registration, login, and authentication using email and phone, with password recovery and user management features.


# Node.js Login API System

This is a Node.js API system that provides user registration, login, and authentication functionality. It supports both email and phone number-based registration and login. Additionally, it includes features such as password recovery, user profile management, and more.

## Routes

- **POST /register**: Register a new user.
- **POST /login**: Login with email and password.
- **POST /loginphone**: Login with phone and password.
- **POST /verifyotp**: Verify OTP for phone-based login.
- **GET /logout**: Logout the user.
- **GET /me**: Get user profile (protected route).
- **PUT /updatedetails**: Update user profile (protected route).
- **PUT /updatepassword**: Update user password (protected route).
- **POST /forgotpassword**: Initiate the password reset process.
- **PUT /resetpassword/:resetToken**: Reset the user's password using a reset token.
- **GET /**: Get a list of users (supports pagination, filtering, and sorting).
- **GET /:id**: Get a single user by ID.
- **PUT /:id**: Update a user by ID.
- **DELETE /:id**: Delete a user by ID.
- **POST /**: Create a new user (admin route).

## Usage

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/nodejs-login-api.git
1) Install Dependencies
cd nodejs-login-api
npm install
2) Run the Application
npm start
3) Access the API at http://localhost:3000.

Contributing
Feel free to contribute to this project by submitting issues, feature requests, or pull requests.

License
This project is licensed under the MIT License - see the LICENSE file for details.

