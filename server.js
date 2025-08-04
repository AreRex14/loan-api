// 1. Import Express
const express = require('express');

// 2. Initialize the Express app
const app = express();
const PORT = 3000; // run server on port 3000

// 3. Add Middleware
// Adds a middleware that parses incoming requests with JSON payloads.
// Allows to read the data sent in a POST request from `req.body`.
app.use(express.json());

// 4. In-Memory "Database"
// Initially, use a simple array to store data.
// If the server restarts, this data will be lost.
let loanApplications = [];

// --- API Endpoints ---

/**
 * @route   POST /api/applications
 * @desc    Submit a new loan application
 * @access  Public
 */
app.post('/api/applications', (req, res) => {
    // Get the data from the request body
    const { applicantName, email, loanAmount, loanPurpose } = req.body;

    // Basic Validation: Check if required fields are present
    if (!applicantName || !email || !loanAmount || !loanPurpose) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }
    
    // Basic Validation: Check if loanAmount is a positive number
    if (typeof loanAmount !== 'number' || loanAmount <= 0) {
        return res.status(400).json({ message: 'Loan amount must be a positive number.' });
    }

    // Create a new application object
    const newApplication = {
        id: `APP-${Date.now()}`, // Create a simple unique ID
        applicantName: applicantName,
        email: email,
        loanAmount: loanAmount,
        loanPurpose: loanPurpose,
        status: 'Pending', // All new applications start as 'Pending'
        submittedAt: new Date().toISOString()
    };

    // Add the new application to our "database"
    loanApplications.push(newApplication);

    console.log('New application submitted:', newApplication);

    // Respond to the client with the new application data
    // A 201 status code means "Created"
    res.status(201).json(newApplication);
});


/**
 * @route   GET /api/applications/:id
 * @desc    Get a loan application by its ID
 * @access  Public
 */
app.get('/api/applications/:id', (req, res) => {
    // Get the ID from the URL parameters (e.g., /api/applications/APP-12345)
    const applicationId = req.params.id;

    // Find the application in our "database"
    const application = loanApplications.find(app => app.id === applicationId);

    // If the application is not found, return a 404 error
    if (!application) {
        return res.status(404).json({ message: 'Application not found.' });
    }

    // If found, return the application data
    res.json(application);
});


// 5. Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});