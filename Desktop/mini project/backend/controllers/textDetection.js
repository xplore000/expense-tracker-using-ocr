const { TextractClient, AnalyzeExpenseCommand } = require("@aws-sdk/client-textract");
const { fromIni } = require("@aws-sdk/credential-providers")
const axios = require("axios");

const REGION = "ap-south-1";
const bucket = 'ocrtestcek';
const profileName = "default";
const textractClient = new TextractClient({
    region: REGION,
    credentials: fromIni({ profile: profileName }),
});

const processTextDetection = async (req, res) => {
  try {
    // Fetch the filenames from the '/filename' endpoint
    const fileListResponse = await axios.get("http://localhost:3002/api/v1/filename");
    const filename = fileListResponse.data.latestFileName;

    const params = {
      Document: {
        S3Object: {
          Bucket: bucket,
          Name: filename
        }
      }
    };

    const analyzeExpenseCommand = new AnalyzeExpenseCommand(params);
    const response = await textractClient.send(analyzeExpenseCommand);
    const test1 = response.ExpenseDocuments.flatMap(doc =>
      doc.LineItemGroups.flatMap(items =>
          items.LineItems.flatMap(fields =>
              fields.LineItemExpenseFields.map(expenseFields =>
                  expenseFields
              )
          )
      )
  );
    // Process the response and send it back to the client
    res.json(test1);
  } catch (err) {
    console.error("Error processing text detection:", err);
    res.status(500).json({ error: "Error processing text detection" });
  }
};

module.exports = { processTextDetection };
