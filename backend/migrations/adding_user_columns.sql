-- Add user_id to bench_club_applications
ALTER TABLE bench_club_applications 
ADD COLUMN user_id INT,
ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Add user_id to bench_club_members
ALTER TABLE bench_club_members 
ADD COLUMN user_id INT,
ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

