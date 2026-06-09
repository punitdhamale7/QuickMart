============================================
QuickMart Database Setup Instructions
============================================

STEP 1: Open MySQL
-------------------
Open your MySQL command line or MySQL Workbench

STEP 2: Run the Master SQL File
--------------------------------
Execute the following command:

    mysql -u root -p < quickmart_master.sql

Or if you're already in MySQL command line:

    SOURCE quickmart_master.sql;

Or in MySQL Workbench:
- Open the file: quickmart_master.sql
- Click "Execute" button (lightning icon)

STEP 3: Verify Database Created
--------------------------------
Run these commands to verify:

    SHOW DATABASES;
    USE quickmart;
    SHOW TABLES;
    DESCRIBE users;

STEP 4: Update .env File
-------------------------
Make sure your backend/.env file has correct credentials:

    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_mysql_password
    DB_NAME=quickmart

STEP 5: Start Backend Server
-----------------------------
    cd backend
    npm start

============================================
Database Structure
============================================

TABLE: users
------------
- id (Primary Key, Auto Increment)
- full_name (User's full name)
- email (Unique, used for login)
- phone (10 digit phone number)
- password (Hashed with bcrypt)
- role (customer or retailer)
- created_at (Timestamp)
- updated_at (Timestamp)

============================================
Troubleshooting
============================================

1. Access Denied Error:
   - Check your MySQL username and password
   - Update .env file with correct credentials

2. Database Already Exists:
   - Uncomment line 8 in quickmart_master.sql to drop existing database
   - Or manually drop: DROP DATABASE quickmart;

3. Connection Failed:
   - Ensure MySQL service is running
   - Check if port 3306 is not blocked

============================================
