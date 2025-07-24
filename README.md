# Role-Based Backend API

A secure backend built in Node.js + Express.js with MySQL, supporting role-based access for Admin and Users, including post & comment management.

---

## 🔧 Technologies Used
- Node.js + Express.js
- MySQL
- JWT Authentication
- Role-based Access Control
- REST APIs (Modular Structure)

---

## 🚀 Features
- User/Admin registration and login
- Admin can verify users
- Users can create/update/delete their own posts/comments
- Admin can manage all posts/comments
- Threaded comment system
- Post views and likes counter
- Post thumbnail image upload using Multer
---

## 🛠️ Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/role-based-api.git
   cd role-based-api

2. **Install dependencies**
    npm install

3. **Create .env File**
    PORT=3000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_mysql_password
    DB_NAME=rolebasedapi
    TOKEN_KEY=your_secret_key

4. **Import MySQL Schema**
    -- ADMINS TABLE
    CREATE TABLE admin_table (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    -- USERS TABLE
    CREATE TABLE users (
    userId INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    isVerified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    -- POSTS TABLE
    CREATE TABLE posts (
    postId INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    userId INT NOT NULL,
    thumbnail_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    views_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    );

    -- COMMENTS TABLE
    CREATE TABLE comments (
    commentId INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    userId INT NOT NULL,
    postId INT NOT NULL,
    parentCommentId INT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    );

5. **Run the Application**
    npm start
