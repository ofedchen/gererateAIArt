CREATE TABLE IF NOT EXISTS savedart (
    id SERIAL PRIMARY KEY,
    prompt TEXT NOT NULL,
    artstyle TEXT,
    imageurl TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
