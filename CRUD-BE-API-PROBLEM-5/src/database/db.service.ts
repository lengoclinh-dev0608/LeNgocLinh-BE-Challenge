// resourcesController.ts
import { Request, Response } from 'express';
import db from './db';

export const getResources = (req: Request, res: Response): void => {
    const { name } = req.query;
    let query = 'SELECT * FROM resources';
    let params: any[] = [];

    if (name) {
        query += ' WHERE name LIKE ?';
        params.push(`%${name}%`);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error getting resources', err);
            res.status(500).json({ message: 'Server error' });
            return;
        }
        res.json(rows);
    });
};

export const getResourceById = (req: Request, res: Response): void => {
    const resourceId = req.params.id;

    db.get('SELECT * FROM resources WHERE id = ?', [resourceId], (err, row) => {
        if (err) {
            console.error('Error retrieving resource by ID', err);
            res.status(500).json({ message: 'Server error' });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Resource not found' });
            return;
        }
        res.json(row);
    });
};


export const createResource = (req: Request, res: Response): void => {
    const { name, email } = req.body;
    db.run('INSERT INTO resources (name, email) VALUES (?, ?)', [name, email], function (err) {
        if (err) {
            console.error('Error creating resource', err);
            res.status(500).json({ message: 'Server error' });
            return;
        }
        res.json({ id: this.lastID, name, email });
    });
};

export const updateResource = (req: Request, res: Response): void => {
    const { id } = req.params;
    const { name, email } = req.body;

    // Build SET clause dynamically based on provided fields
    const updateFields: string[] = [];
    const params: any[] = [];
    if (name !== undefined) {
        updateFields.push('name = ?');
        params.push(name);
    }
    if (email !== undefined) {
        updateFields.push('email = ?');
        params.push(email);
    }

    // Check if any fields are provided for update
    if (updateFields.length === 0) {
        res.status(400).json({ message: 'No fields provided for update' });
        return;
    }

    const updateQuery = `UPDATE resources SET ${updateFields.join(', ')} WHERE id = ?`;
    params.push(id);

    db.run(updateQuery, params, function (err) {
        if (err) {
            console.error('Error updating resource', err);
            res.status(500).json({ message: 'Server error' });
            return;
        }
        res.json({ id: parseInt(id), name, email });
    });
};

export const deleteResource = (req: Request, res: Response): void => {
    const { id } = req.params;
    db.run('DELETE FROM resources WHERE id = ?', id, function (err) {
        if (err) {
            console.error('Error deleting resource', err);
            res.status(500).json({ message: 'Server error' });
            return;
        }
        res.json({ message: 'Resource deleted successfully' });
    });
};

// models.ts
interface Resource {
    id?: number;
    name: string;
    email: string;
}
