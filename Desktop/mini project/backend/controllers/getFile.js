
const AWS = require('aws-sdk');


// AWS S3 configuration
const s3 = new AWS.S3({
    accessKeyId:"*******************",
    secretAccessKey:"**********************",
    region:"ap-south-1"
});
// Define a route to fetch the latest uploaded file
const getFile = async (req, res) => {
    try {
        const params = {
            Bucket: 'ocrtestcek',
            MaxKeys: 1,
            Prefix: '' // You can add a prefix if your files have a common prefix
        };

        const data = await s3.listObjectsV2(params).promise();

        if (data.Contents.length === 0) {
            return res.status(404).json({ message: 'No files found in the bucket' });
        }

        // Sort files by last modified time
        const latestFile = data.Contents.reduce((prev, current) => {
            return (prev.LastModified > current.LastModified) ? prev : current;
        });

        res.json({
            file: latestFile.Key,
            lastModified: latestFile.LastModified
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Failed to fetch latest file from S3' });
    }
};

module.exports = {getFile}