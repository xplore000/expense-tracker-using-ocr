const AWS = require('aws-sdk');

// Set up AWS S3
const s3 = new AWS.S3({
    accessKeyId:"*******************",
    secretAccessKey:"**********************",
    region:"ap-south-1"
});

// Function to fetch the latest uploaded filename from S3 bucket
const getLatestFileNameFromS3 = (bucketName) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: bucketName
        };

        // List objects in the bucket
        s3.listObjectsV2(params, (err, data) => {
            if (err) {
                console.error('Error listing objects:', err);
                reject(err);
            } else {
                // Sort the objects by last modified timestamp in descending order
                const sortedObjects = data.Contents.sort((a, b) => b.LastModified - a.LastModified);
                
                // Get the latest uploaded filename
                const latestFileName = sortedObjects[0].Key;
                resolve(latestFileName);
            }
        });
    });
};

// Function to get the latest filename from S3 and send it as JSON response
const getFileName = async (req, res) => {
    try {
        const bucketName = 'ocrtestcek';
        const latestFileName = await getLatestFileNameFromS3(bucketName);
        res.json({ latestFileName });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Failed to fetch latest filename from S3' });
    }
};


// Route to fetch the latest uploaded filename from S3 bucket


module.exports = {getFileName}
