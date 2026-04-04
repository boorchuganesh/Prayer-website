-- Drop existing tables if they exist
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS questions CASCADE;

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asker_name VARCHAR(255) NOT NULL,
  question TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create answers table
CREATE TABLE IF NOT EXISTS answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answered_by VARCHAR(100) NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Create policies for questions
CREATE POLICY "Allow all to read questions" ON questions
  FOR SELECT USING (true);

CREATE POLICY "Allow all to insert questions" ON questions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all to update questions" ON questions
  FOR UPDATE USING (true);

CREATE POLICY "Allow all to delete questions" ON questions
  FOR DELETE USING (true);

-- Create policies for answers
CREATE POLICY "Allow all to read answers" ON answers
  FOR SELECT USING (true);

CREATE POLICY "Allow all to insert answers" ON answers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all to update answers" ON answers
  FOR UPDATE USING (true);

CREATE POLICY "Allow all to delete answers" ON answers
  FOR DELETE USING (true);
