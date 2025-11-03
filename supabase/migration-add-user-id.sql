ALTER TABLE threads 
ADD COLUMN user_id uuid;

UPDATE threads 
SET user_id = (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1)
WHERE user_id IS NULL;

ALTER TABLE threads 
ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE threads 
ADD CONSTRAINT threads_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS threads_user_id_idx ON threads(user_id);