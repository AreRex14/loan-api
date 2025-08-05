// 1. Import Express
const express = require('express');

// import Moogoose to connect to MongoDB
const mongoose = require('mongoose');

// 2. Initialize the Express app
const app = express();
const PORT = 3000; // run server on port 3000

// 3. Add Middleware
// Adds a middleware that parses incoming requests with JSON payloads.
// Allows to read the data sent in a POST request from `req.body`.
app.use(express.json());

// Connect to MongoDB
// assumes MongoDB running locally on the default port 27017.
mongoose.connect('mongodb://localhost:27017/loanapi');

// Define valid statuses globally
const VALID_STATUSES = ['Pending', 'Approved', 'Rejected'];

// Define the LoanApplication schema
const loanApplicationSchema = new mongoose.Schema({
    applicantName: { type: String, required: true },
    email: { type: String, required: true },
    loanAmount: { type: Number, required: true },
    loanPurpose: { type: String, required: true },
    status: { type: String, enum: VALID_STATUSES, default: VALID_STATUSES[0] }, // Default to 'Pending'
    submittedAt: { type: Date, default: Date.now }
});

// Create the model
const LoanApplication = mongoose.model('LoanApplication', loanApplicationSchema);

// --- API Endpoints ---

/**
 * @route   POST /api/applications
 * @desc    Submit a new loan application
 * @access  Public
 */
app.post('/api/applications', async (req, res) => {
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

    try {
        const newApplication = new LoanApplication({
            applicantName,
            email,
            loanAmount,
            loanPurpose
        });
        await newApplication.save();
        res.status(201).json(newApplication);
    } catch (err) {
        res.status(500).json({ message: 'Error saving application.' });
    }
});

/**
 * @route   GET /api/applications
 * @desc    Get all loan applications
 * @access  Public
 */
app.get('/api/applications', async (req, res) => {
    try {
        const applications = await LoanApplication.find();
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching applications.' });
    }
});


/**
 * @route   GET /api/applications/:id
 * @desc    Get a loan application by its ID
 * @access  Public
 */
app.get('/api/applications/:id', async (req, res) => {
    const applicationId = req.params.id;

    try {
        const application = await LoanApplication.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found.' });
        }
        res.json(application);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching application.' });
    }
});

/**
 * @route   PUT /api/applications/:id
 * @desc    Update the status of a loan application
 * @access  Public
 */
app.put('/api/applications/:id', async (req, res) => {
    const applicationId = req.params.id;
    const { status } = req.body;

    // Validate the status
    if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ message: 'Invalid status.' });
    }

    try {
        const updatedApplication = await LoanApplication.findByIdAndUpdate(
            applicationId,
            { status },
            { new: true }
        );
        if (!updatedApplication) {
            return res.status(404).json({ message: 'Application not found.' });
        }
        res.json({ message: 'Application status updated successfully.', application: updatedApplication });
    } catch (err) {
        res.status(500).json({ message: 'Error updating application.' });
    }
});


// 5. Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});