const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all categories
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM categories ORDER BY name');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single category with blog count
router.get('/:id', async (req, res) => {
    try {
        const [categoryRows] = await db.execute('SELECT * FROM categories WHERE id = ?', [req.params.id]);
        
        if (categoryRows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        const [countRows] = await db.execute('SELECT COUNT(*) as blog_count FROM blogs WHERE category_id = ?', [req.params.id]);
        
        const category = {
            ...categoryRows[0],
            blog_count: countRows[0].blog_count
        };
        
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new category
router.post('/', async (req, res) => {
    const { name, description } = req.body;
    
    if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
    }
    
    try {
        const [result] = await db.execute(
            'INSERT INTO categories (name, description) VALUES (?, ?)',
            [name, description]
        );
        
        const [newCategory] = await db.execute('SELECT * FROM categories WHERE id = ?', [result.insertId]);
        res.status(201).json(newCategory[0]);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Category name already exists' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Update category
router.put('/:id', async (req, res) => {
    const { name, description } = req.body;
    
    try {
        const [result] = await db.execute(
            'UPDATE categories SET name = ?, description = ? WHERE id = ?',
            [name, description, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        const [updatedCategory] = await db.execute('SELECT * FROM categories WHERE id = ?', [req.params.id]);
        res.json(updatedCategory[0]);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Category name already exists' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Delete category
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM categories WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            res.status(400).json({ error: 'Cannot delete category with existing blogs' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

module.exports = router;