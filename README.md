# Loan API

A simple Node.js/Express REST API for managing loan applications, using MongoDB for persistent storage.

## Tech Stack

- **Node.js** – JavaScript runtime for server-side development
- **Express** – Web framework for Node.js
- **MongoDB** – Document-based NoSQL database
- **Mongoose** – ODM (Object Data Modeling) library for MongoDB and Node.js

## Features

- Submit a new loan application
- List all loan applications
- Get a loan application by ID
- Update the status of a loan application (`Pending`, `Approved`, `Rejected`)
- Data persistence with MongoDB

## Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [MongoDB Community Edition](https://www.mongodb.com/try/download/community) (running locally)

## Setup

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd loan-api
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start MongoDB** (if not already running):
   ```sh
   sudo systemctl start mongod
   ```

4. **Start the server:**
   ```sh
   node server.js
   ```
   The API will be running at [http://localhost:3000](http://localhost:3000).

## API Endpoints

### Submit a new loan application

- **POST** `/api/applications`
- **Body:**
  ```json
  {
    "applicantName": "John Doe",
    "email": "john@example.com",
    "loanAmount": 10000,
    "loanPurpose": "Home Renovation"
  }
  ```

### Get all loan applications

- **GET** `/api/applications`

### Get a loan application by ID

- **GET** `/api/applications/:id`

### Update the status of a loan application

- **PUT** `/api/applications/:id`
- **Body:**
  ```json
  {
    "status": "Approved"
  }
  ```
  Valid statuses: `Pending`, `Approved`, `Rejected`

## Database

- Uses MongoDB database named `loanapi`
- Collection: `loanapplications`

## License

WTFPL License. See [LICENSE](LICENSE) for details.