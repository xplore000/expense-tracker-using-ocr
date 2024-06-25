const AWS = require('aws-sdk');
const fs = require('fs');

// Set up AWS S3
const s3 = new AWS.S3({
    accessKeyId:"AKIA4MTWH5YULQPPZPL5",
    secretAccessKey:"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",
    region:"ap-south-1"
});

const uploadFile = (req, res) => {
    const file = req.file;

    // Read the file from local disk
    fs.readFile(file.path, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        // Upload the file to S3
        s3.upload({
            Bucket: 'ocrtestcek',
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
                res.json({ filename: file.originalname });
            });
        });
    });
};

// Function to get the filename


module.exports = { uploadFile };
