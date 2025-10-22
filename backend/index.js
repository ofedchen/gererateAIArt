import express from "express";
import path from "path";
import dotenv from "dotenv";
import { Client } from "pg";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.API_TOKEN;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(path.resolve(), "../frontend")))

// const client = new Client({
//     connectionString: process.env.PGURI
// })

// client.connect()

// app.get('/api', async (_request, response) => {
//     const { rows } = await client.query(
//         'SELECT * FROM savedArt'
//     )

//     response.send(rows)
// })

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

        response.json({
            success: true,
            imageUrl: result.data[0].url
        });

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