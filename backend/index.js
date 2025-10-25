import express from "express";
import path from "path";
import dotenv from "dotenv";
import { Client } from "pg";
import { createClient } from '@supabase/supabase-js';
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.API_TOKEN;

//setup necessary to save generated images to storage to get a permanent link for db
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const client = new Client({
    connectionString: process.env.PGURI,
    ssl: {
        rejectUnauthorized: false
    }
})

client.connect();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(path.resolve(), "../frontend")))

app.get('/api', async (_request, response) => {
    try {
        const result = await client.query('SELECT * FROM savedart ORDER BY created_at DESC');
        response.json(result.rows);
    } catch (error) {
        console.error('Database error:', error);
        response.status(500).json({
            error: 'Failed to fetch gallery',
            message: error.message
        });
    }
});

app.post('/api', async (request, response) => {
    try {
        const { description, style, imageUrl } = request.body;

        const text = `INSERT INTO savedart(prompt, artstyle, imageurl, created_at)
            VALUES ($1, $2, $3, NOW())`;
        const values = [description, style, imageUrl];

        const result = await client.query(text, values);

        response.json({
            success: true,
            message: 'Art saved successfully',
        });
    } catch (error) {
        console.error('Database error:', error);
        response.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

app.post('/api/generate-image', async (request, response) => {
    try {
        const { prompt } = request.body;

        if (!prompt) {
            return response.status(400).json({ error: 'Prompt is required' });
        }

        const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                prompt: prompt,
                model: "dall-e-3",
                n: 1,
                size: "1024x1024",
                response_format: "url",
                style: "vivid"
            })
        });

        if (!openaiResponse.ok) {
            const error = await openaiResponse.json();
            return response.status(openaiResponse.status).json({
                error: error.error?.message || 'Failed to generate image'
            });
        }

        const result = await openaiResponse.json();
        const imageUrl = result.data[0].url;

        // Download and upload image to Supabase Storage
        try {
            const imageResponse = await fetch(imageUrl);

            if (!imageResponse.ok) {
                throw new Error(`Failed to download image: ${imageResponse.status}`);
            }

            const imageBlob = await imageResponse.blob();
            console.log('Image downloaded, size:', imageBlob.size, 'bytes');

            const fileName = `art_${Date.now()}_${Math.random().toString(36).substring(7)}.png`;
            console.log('Uploading to Supabase as:', fileName);

            const { data, error } = await supabase.storage
                .from('art-images')
                .upload(fileName, imageBlob, {
                    contentType: 'image/png',
                    upsert: true
                });

            if (error) {
                console.error('Supabase upload error:', error);
                throw error;
            }

            console.log('Upload successful:', data);

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('art-images')
                .getPublicUrl(fileName);

            console.log('Public URL:', publicUrl);

            response.json({
                success: true,
                imageUrl: publicUrl,
                originalUrl: imageUrl
            });

        } catch (storageError) {
            console.error('Storage error:', storageError);
            response.status(500).json({
                error: 'Storage upload failed',
                storageError: storageError.message
            });
        }

    } catch (error) {
        console.error('Error generating image:', error);
        response.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Backend är redo på http://localhost:${port}/`)
})