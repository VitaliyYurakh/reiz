-- Reset admin password to 'admin123' (bcrypt hash)
UPDATE "User"
SET pass = '$2b$12$J9eS8tRZSHlOVUvpBQP1wuw9KBqDRW3v5VqZQhiq9Xy4G23oKCsam'
WHERE email = 'admin@example.com';
