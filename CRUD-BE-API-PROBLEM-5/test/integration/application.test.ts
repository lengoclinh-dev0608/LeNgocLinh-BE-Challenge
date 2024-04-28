import request from 'supertest';
import db from '../../src/database/db'; // Import your database instance
import { application, Shutdown } from '../../src/server';

describe('CRUD Operations', () => {
    // Clear the database before each test
    beforeEach((done) => {
        db.serialize(() => {
            db.run('DELETE FROM resources', () => {
                done();
            });
        });
    });

    afterAll((done) => {
        // Close the database connection and shut down the server after all tests
        db.close(() => {
            Shutdown(done);
        });
    });

    it('Creates a new resource', async () => {
        const newResource = { name: 'John Doe', email: 'john@example.com' };
        const response = await request(application)
            .post('/resource')
            .send(newResource);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(newResource.name);
        expect(response.body.email).toBe(newResource.email);
    });

    it('Gets all resources', async () => {
        // Add some resources to the database
        await db.run('INSERT INTO resources (name, email) VALUES (?, ?)', ['Alice', 'alice@example.com']);
        await db.run('INSERT INTO resources (name, email) VALUES (?, ?)', ['Bob', 'bob@example.com']);

        const response = await request(application).get('/resource');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2); // Assuming you added 2 resources
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0].name).toBe('Alice');
        expect(response.body[0].email).toBe('alice@example.com');
        // Similarly check for the second resource
    });

    it('Gets details of a resource', async () => {
        // Add a resource to the database
        await db.run('INSERT INTO resources (name, email) VALUES (?, ?)', ['Alice', 'alice@example.com']);
        const getRes: any = await new Promise((resolve, reject) => {
            db.get('SELECT last_insert_rowid() as id', [], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        const resourceId = getRes.id; // Retrieve the last inserted row ID

        const response = await request(application).get(`/resource/${resourceId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name', 'Alice');
        expect(response.body).toHaveProperty('email', 'alice@example.com');
    });


    it('Updates a resource', async () => {
        // Add a resource to the database
        await db.run('INSERT INTO resources (name, email) VALUES (?, ?)', ['Alice', 'alice@example.com']);
        const getRes: any = await new Promise((resolve, reject) => {
            db.get('SELECT last_insert_rowid() as id', [], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        const resourceId = getRes.id; // Retrieve the last inserted row ID
        console.log("🚀 ~ it ~ resourceId:", resourceId)

        const updatedResource = { name: 'Updated Name', email: 'updated@example.com' };
        const response = await request(application)
            .put(`/resource/${resourceId}`)
            .send(updatedResource);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(updatedResource);

        // Check if the resource is updated in the database
        const checkResponse: any = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM resources WHERE id = ?', [resourceId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
        console.log("🚀 ~ constcheckResponse:any=awaitnewPromise ~ checkResponse:", checkResponse)
        expect(checkResponse.name).toBe(updatedResource.name);
        expect(checkResponse.email).toBe(updatedResource.email);
    });

    it('Deletes a resource', async () => {
        // Add a resource to the database
        await db.run('INSERT INTO resources (name, email) VALUES (?, ?)', ['Alice', 'alice@example.com']);
        const getRes: any = await new Promise((resolve, reject) => {
            db.get('SELECT last_insert_rowid() as id', [], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        const resourceId = getRes.id; // Retrieve the last inserted row ID

        const response = await request(application).delete(`/resource/${resourceId}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Resource deleted successfully' });

        // Check if the resource is deleted from the database
        const checkResponse: any = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM resources WHERE id = ?', [resourceId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
        expect(checkResponse).toBeUndefined();
    });

});
