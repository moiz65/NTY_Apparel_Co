-- Add user_id column to bench_club_applications
ALTER TABLE bench_club_applications 
ADD COLUMN user_id INT,
ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Update existing records to set user_id (if needed)
-- UPDATE bench_club_applications SET user_id = ... WHERE ...