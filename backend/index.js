import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { Client } from "pg";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const uploadsDir = path.join(path.resolve(), "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const client = new Client({
    connectionString: process.env.PGURI,
    ...(process.env.PGSSL === "true" && { ssl: { rejectUnauthorized: false } }),
})

client.connect();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(path.resolve(), "../frontend")))
app.use("/uploads", express.static(uploadsDir));

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

        const result = await ai.models.generateContent({
            model: "gemini-3.1-flash-image-preview",
            contents: prompt,
            config: {
                thinkingConfig: {
                    thinkingLevel: "low",
                },
                imageConfig: {
                    aspectRatio: "1:1",
                    imageSize: "1K"
                }
            },
        });

        const imagePart = result.candidates?.[0]?.content?.parts?.find(
            (p) => p.inlineData
        );

        if (!imagePart) {
            return response.status(500).json({
                error: "No image was generated. The model may have refused the prompt."
            });
        }

        const randomId = typeof crypto?.randomUUID === "function"
            ? crypto.randomUUID().slice(0, 7)
            : Math.random().toString(36).substring(7);
        const fileName = `art_${Date.now()}_${randomId}.png`;
        const filePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(filePath, Buffer.from(imagePart.inlineData.data, "base64"));

        response.json({
            success: true,
            imageUrl: `/uploads/${fileName}`,
        });

    } catch (error) {
        console.error('Error generating image:', error);
        response.status(500).json({
            error: 'Failed to generate image',
            message: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Backend är redo på http://localhost:${port}/`)
})