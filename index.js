const fs = require('fs');
const path = require('path');
const express = require('express');
const xlsx = require('xlsx');
const multer = require('multer');
const { parse } = require('json2csv');

const app = express();
const port = 4000;

app.use(express.static('public'));

const upload = multer({ dest: 'uploads/' });

class SecretSanta {
    constructor(employees, previousAssignments) {
        this.employees = employees;
        this.previousAssignments = new Map(previousAssignments.map(assign => [assign.Employee_EmailID, assign.Secret_Child_EmailID]));
    }

    assignSecretChildren() {
        let availableChildren = [...this.employees];
        let assignments = [];
    
        for (let employee of this.employees) {
            let possibleChildren = availableChildren.filter(child => 
                child.Employee_EmailID !== employee.Employee_EmailID &&
                this.previousAssignments.get(employee.Employee_EmailID) !== child.Employee_EmailID
            );
    
            if (possibleChildren.length === 0) {
                console.warn(`No valid child found for ${employee.Employee_Name}. Retrying without previous restrictions.`);
                possibleChildren = availableChildren.filter(child => child.Employee_EmailID !== employee.Employee_EmailID);
            }
    
            if (possibleChildren.length === 0) {
                throw new Error('No valid assignment possible. Try re-running.');
            }
    
            let chosenChild = possibleChildren[Math.floor(Math.random() * possibleChildren.length)];
            assignments.push({
                Employee_Name: employee.Employee_Name,
                Employee_EmailID: employee.Employee_EmailID,
                Secret_Child_Name: chosenChild.Employee_Name,
                Secret_Child_EmailID: chosenChild.Employee_EmailID
            });
    
            availableChildren = availableChildren.filter(child => child.Employee_EmailID !== chosenChild.Employee_EmailID);
        }
    
        return assignments;
    }
}

function parseExcel(filePath) {
    return new Promise((resolve, reject) => {
        try {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0]; 
            const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
}

let generatedAssignments = [];

app.post('/upload', upload.fields([{ name: 'employees' }, { name: 'previousAssignments' }]), async (req, res) => {
    try {
        const employees = await parseExcel(req.files['employees'][0].path);
        const previousAssignments = req.files['previousAssignments'] ? await parseExcel(req.files['previousAssignments'][0].path) : [];

        if (employees.length < 2) {
            throw new Error('Not enough employees for Secret Santa.');
        }

        const secretSanta = new SecretSanta(employees, previousAssignments);
        generatedAssignments = secretSanta.assignSecretChildren();

        res.json(generatedAssignments);
    } catch (error) {
        console.error("Assignment error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/download', (req, res) => {
    if (!generatedAssignments.length) {
        return res.status(400).json({ error: 'No assignments found. Generate assignments first.' });
    }

    const csv = parse(generatedAssignments, { fields: ["Employee_Name", "Employee_EmailID", "Secret_Child_Name", "Secret_Child_EmailID"] });
    const filePath = path.join(__dirname, 'secret_santa_assignments.csv');

    fs.writeFileSync(filePath, csv);
    res.download(filePath, 'secret_santa_assignments.csv', () => fs.unlinkSync(filePath));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

if (process.env.NODE_ENV === 'test') {
    module.exports = { SecretSanta };
}

