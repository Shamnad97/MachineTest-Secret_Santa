document.getElementById('uploadButton').addEventListener('click', async () => {
    const employeesFile = document.getElementById('employeesFile').files[0];
    const previousAssignmentsFile = document.getElementById('previousAssignmentsFile').files[0];

    const formData = new FormData();
    formData.append('employees', employeesFile);
    if (previousAssignmentsFile) {
        formData.append('previousAssignments', previousAssignmentsFile);
    }

    const response = await fetch('/upload', { method: 'POST', body: formData });
    const data = await response.json();
    
    const tableBody = document.querySelector('#resultTable tbody');
    tableBody.innerHTML = '';
    data.forEach(row => {
        tableBody.innerHTML += `<tr><td>${row.Employee_Name}</td><td>${row.Employee_EmailID}</td><td>${row.Secret_Child_Name}</td><td>${row.Secret_Child_EmailID}</td></tr>`;
    });
});

document.getElementById('downloadButton').addEventListener('click', () => {
    window.location.href = '/download';
});
