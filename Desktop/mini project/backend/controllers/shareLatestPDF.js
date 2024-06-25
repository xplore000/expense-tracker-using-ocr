const { sharePDF } = require('../controllers/pdfShare'); // Adjust the path as necessary

const shareLatestPDF = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send('Email is required');
    }

    try {
        const message = await sharePDF(email);
        res.status(200).send(message);
    } catch (error) {
        console.error('Error sharing PDF:', error);
        res.status(500).send(error.message);
    }
};

module.exports = { shareLatestPDF };
