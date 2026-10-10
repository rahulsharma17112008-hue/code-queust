-- Create the quiz_results table
CREATE TABLE quiz_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  category text NOT NULL,
  score integer NOT NULL,
  total_questions integer NOT NULL,
  accuracy integer NOT NULL,
  completed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) to ensure data privacy
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Create policy allowing users to read ONLY their own results
CREATE POLICY "Users can view their own results"
  ON quiz_results FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy allowing users to insert ONLY their own results
CREATE POLICY "Users can insert their own results"
  ON quiz_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);
