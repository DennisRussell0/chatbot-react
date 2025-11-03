CREATE TABLE threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('user', 'bot')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX messages_thread_id_idx ON messages(thread_id);

CREATE INDEX threads_user_id_idx ON threads(user_id);