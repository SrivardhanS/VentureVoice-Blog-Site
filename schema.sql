-- Create database
CREATE DATABASE IF NOT EXISTS startup_blog;
USE startup_blog;

-- Categories table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blogs table
CREATE TABLE blogs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category_id INT,
    author VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES 
('Technology', 'Tech startups and innovations'),
('Funding', 'Startup funding and investment'),
('Marketing', 'Marketing strategies for startups'),
('Product', 'Product development and management'),
('Leadership', 'Startup leadership and management');

-- Insert sample blogs
INSERT INTO blogs (title, content, category_id, author) VALUES 
('Building Your First MVP', 'A comprehensive guide to building your minimum viable product...', 4, 'John Doe'),
('Raising Seed Funding', 'Essential tips for raising your first round of funding...', 2, 'Jane Smith'),
('Growth Hacking Strategies', 'Proven strategies to grow your startup quickly...', 3, 'Mike Johnson');