const AWS = require('aws-sdk');
const fs = require('fs');

// Set up AWS S3
const s3 = new AWS.S3({
    accessKeyId:"*******************",
    secretAccessKey:"**********************",
    region:"ap-south-1"
});

const uploadPDF = (req, res) => {
    console.log(req.file)
    // Check if file is present
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const file = req.file;

    // Read the file from local disk
    fs.readFile(file.path, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        // Upload the file to S3
        s3.upload({
            Bucket: 'pdfreport000',
            Key: file.originalname, // Use original file name as the key
            Body: data,
        }, (s3Err, s3Data) => {
            if (s3Err) {
                console.error('Error uploading to S3:', s3Err);
                return res.status(500).send('Error uploading to S3');
            }

            console.log('File uploaded to S3:', s3Data.Location);
            // Clean up local file
            fs.unlink(file.path, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Error deleting local file:', unlinkErr);
                }
                res.json({ filename: file.originalname, location: s3Data.Location });
            });
        });
    });
};

module.exports = { uploadPDF };
