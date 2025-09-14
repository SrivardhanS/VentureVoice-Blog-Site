const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all blogs with category information
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT b.*, c.name as category_name 
            FROM blogs b 
            LEFT JOIN categories c ON b.category_id = c.id 
            ORDER BY b.created_at DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single blog by id
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT b.*, c.name as category_name 
            FROM blogs b 
            LEFT JOIN categories c ON b.category_id = c.id 
            WHERE b.id = ?
        `, [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get blogs by category
router.get('/category/:categoryId', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT b.*, c.name as category_name 
            FROM blogs b 
            LEFT JOIN categories c ON b.category_id = c.id 
            WHERE b.category_id = ?
            ORDER BY b.created_at DESC
        `, [req.params.categoryId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new blog
router.post('/', async (req, res) => {
    const { title, content, category_id, author } = req.body;
    
    if (!title || !content || !author) {
        return res.status(400).json({ error: 'Title, content, and author are required' });
    }
    
    try {
        const [result] = await db.execute(
            'INSERT INTO blogs (title, content, category_id, author) VALUES (?, ?, ?, ?)',
            [title, content, category_id, author]
        );
        
        const [newBlog] = await db.execute(`
            SELECT b.*, c.name as category_name 
            FROM blogs b 
            LEFT JOIN categories c ON b.category_id = c.id 
            WHERE b.id = ?
        `, [result.insertId]);
        
        res.status(201).json(newBlog[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update blog
router.put('/:id', async (req, res) => {
    const { title, content, category_id } = req.body;
    
    try {
        const [result] = await db.execute(
            'UPDATE blogs SET title = ?, content = ?, category_id = ? WHERE id = ?',
            [title, content, category_id, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        
        const [updatedBlog] = await db.execute(`
            SELECT b.*, c.name as category_name 
            FROM blogs b 
            LEFT JOIN categories c ON b.category_id = c.id 
            WHERE b.id = ?
        `, [req.params.id]);
        
        res.json(updatedBlog[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete blog
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM blogs WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;