const { SecretSanta } = require('../index');

describe('SecretSanta.assignSecretChildren', () => {
    test('assigns secret children correctly', () => {
        const employees = [
            { Employee_Name: 'Alice', Employee_EmailID: 'alice@example.com' },
            { Employee_Name: 'Bob', Employee_EmailID: 'bob@example.com' },
            { Employee_Name: 'Charlie', Employee_EmailID: 'charlie@example.com' }
        ];

        const previousAssignments = [];

        const secretSanta = new SecretSanta(employees, previousAssignments);
        const assignments = secretSanta.assignSecretChildren();

        expect(assignments.length).toBe(3);
        expect(new Set(assignments.map(a => a.Secret_Child_EmailID)).size).toBe(3);
    });

    test('throws error if only one employee exists', () => {
        const employees = [
            { Employee_Name: 'Alice', Employee_EmailID: 'alice@example.com' }
        ];

        const secretSanta = new SecretSanta(employees, []);

        expect(() => secretSanta.assignSecretChildren()).toThrow('Not enough employees for Secret Santa.');
    });

    test('avoids assigning previous secret child', () => {
        const employees = [
            { Employee_Name: 'Alice', Employee_EmailID: 'alice@example.com' },
            { Employee_Name: 'Bob', Employee_EmailID: 'bob@example.com' }
        ];

        const previousAssignments = [
            { Employee_EmailID: 'alice@example.com', Secret_Child_EmailID: 'bob@example.com' }
        ];

        const secretSanta = new SecretSanta(employees, previousAssignments);
        const assignments = secretSanta.assignSecretChildren();

        expect(assignments[0].Secret_Child_EmailID).not.toBe('bob@example.com');
    });
});
