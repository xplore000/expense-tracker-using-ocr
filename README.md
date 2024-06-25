# Expense Tracker with OCR

This project is an Expense Tracker application that utilizes Optical Character Recognition (OCR) to extract text from receipts and invoices, allowing users to easily track their expenses.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Managing expenses can be a cumbersome task, especially when dealing with numerous receipts and invoices. This Expense Tracker application aims to simplify expense management by leveraging OCR technology to extract relevant information from receipts, such as date, amount, and merchant name. Users can then categorize and analyze their expenses conveniently within the application.

## Features

- **OCR Integration**: Utilizes OCR technology to extract text from images of receipts and invoices.
- **Expense Categorization**: Allows users to categorize expenses based on custom categories or predefined ones.
- **Expense Analysis**: Provides insights into spending habits through visualizations and reports.
- **User Authentication**: Enables secure access to the application with user authentication and authorization mechanisms.
- **Data Export**: Supports exporting expense data in various formats (e.g., CSV, PDF) for further analysis or record-keeping.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/xplore000/expense-tracker-using-ocr.git
    ```

2. Navigate to the project directory:

    ```bash
    cd 
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Set up environment variables:

    - Create a `.env` file in the root directory.
    - Add necessary environment variables (e.g., API keys, database connection strings).

5. Run the application:

    ```bash
    npm start
    ```

## Usage

1. Sign up or log in to the application.
2. Upload images of your receipts or invoices.
3. The OCR system will extract relevant text information.
4. Review and categorize the extracted expenses.
5. Explore expense analysis features such as charts and reports.

## Technologies Used

- **Frontend**:
  - React.js
  - Redux (or any state management library)
  - Material-UI (or any UI library)
- **Backend**:
  - Node.js
  - Express.js
  - MongoDB (or any database)
- **OCR**:
  - Textract

## Contributing

This project was developed by the following team members:
- Abel Alex Jacob: Full Stack Developer
- Disha M S: Frontend Developer

Contributions are welcome! If you'd like to contribute, please open an issue or submit a pull request with your ideas, suggestions, or bug fixes.

## License

This project is licensed under the [MIT License](LICENSE).
