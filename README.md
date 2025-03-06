# Secret Santa Assignment

## Overview

This project automates the Secret Santa assignment process for employees in a company. Employees are assigned a Secret Child to whom they will give a gift anonymously, following a set of constraints to ensure fairness.

## Features

- Upload an Excel file with employee details.
- Upload a previous year's Secret Santa assignments to avoid repetition.
- Assign a Secret Child to each employee while following constraints.
- Download assignments as a CSV file.
- Error handling for invalid inputs.
- Unit tests for assignment logic.

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd secret-santa
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Running the Application

1. Start the server:
   ```sh
   npm start
   ```
2. Open [http://localhost:4000](http://localhost:4000) in your browser.

## API Endpoints

### Upload Employee and Previous Assignment Files

**POST /upload**

- **Input:** Form-data with `employees` (Excel file) and optionally `previousAssignments` (Excel file).
- **Response:** JSON with assigned Secret Santa pairs.

### Download Secret Santa Assignments

**GET /download**

- **Response:** CSV file containing Secret Santa assignments.

## Testing

Run unit tests using Jest:
```sh
npm test
```

## File Structure

```
secret-santa/
│-- public/                # Static frontend files (optional)
│-- uploads/               # Temporary file storage
│-- test/                  # Unit tests
│   ├── secretSanta.test.js # Tests for assignment logic
│-- index.js               # Main application logic
│-- package.json           # Dependencies and scripts
│-- README.md              # Project documentation
```

## Technologies Used

- **Node.js**
- **Express.js**
- **Multer** (for file uploads)
- **xlsx** (for Excel parsing)
- **json2csv** (for CSV generation)
- **Jest** (for unit testing)

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```sh
   git checkout -b feature-branch
   ```
3. Commit your changes and push:
   ```sh
   git commit -m "Add new feature"
   git push origin feature-branch
   ```
4. Open a pull request.

## License

This project is licensed under the MIT License.