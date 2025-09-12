-- Insert a default admin user for testing
INSERT INTO admin_users (email, name, password_hash, role) 
VALUES ('admin@cyprus-rentals.com', 'Admin User', '$2a$10$dummy.hash.for.demo', 'admin')
ON CONFLICT (email) DO NOTHING;