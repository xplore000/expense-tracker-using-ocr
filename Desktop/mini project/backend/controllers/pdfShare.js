const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Set up AWS S3
const s3 = new AWS.S3({
    accessKeyId:"*******************",
    secretAccessKey:"**********************",
    region:"ap-south-1"
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user:'expensetracker.ocr@gmail.com',
        pass: 'ggnh qcxs jknw gdnl',
    },
});

const getLatestUploadedFile = async () => {
    const params = {
        Bucket: 'pdfreport000',
        Prefix: '', // Adjust this based on your actual prefix if needed
        MaxKeys: 1,
        Delimiter: '/',
    };

    const data = await s3.listObjectsV2(params).promise();
    if (data.Contents.length === 0) {
        throw new Error('No files found in the bucket');
    }

    const latestFile = data.Contents.sort((a, b) => new Date(b.LastModified) - new Date(a.LastModified))[0];
    return latestFile.Key;
};

const getSignedUrl = async (fileKey) => {
    const params = {
        Bucket: 'pdfreport000',
        Key: fileKey,
        Expires: 60 * 5, // URL expires in 5 minutes
    };

    const url = await s3.getSignedUrlPromise('getObject', params);
    return url;
};

const sharePDF = async (email) => {
    try {
        const latestFileKey = await getLatestUploadedFile();
        const fileUrl = await getSignedUrl(latestFileKey);

        const mailOptions = {
            from: 'xploreabel@gmail.com',
            to: email,
            subject: 'Your Latest Expense Report',
            text: 'I hope this message finds you well. Attached, please find the Weekly Expense Report , detailing your financial activities for the past week. This report includes a breakdown of your expenses and incomes, helping you track your financial progress and make informed decisions.',
            attachments: [
                {
                    filename: latestFileKey.split('/').pop(),
                    path: fileUrl,
                },
            ],
        };

        await transporter.sendMail(mailOptions);
        return 'PDF shared successfully!';
    } catch (error) {
        console.error('Error sharing PDF:', error);
        throw new Error('Error sharing PDF');
    }
};

module.exports = { sharePDF };
