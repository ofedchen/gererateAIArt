# AI Art Generator

A web application that generates AI-powered artwork using Google's Gemini API, with image storage via Supabase and database management using PostgreSQL.

**Live Demo**: https://gererateaiart.olha.dev

## Features

- **AI Art Generation**: Create unique artwork using OpenAI's DALL-E 3 model
- **Style Selection**: Choose from 11 different art styles (Renaissance, Impressionism, Pop-art, etc.)
- **Persistent Storage**: Images saved to docker container on server for permanent links
- **Gallery View**: Browse all generated artwork with click-to-enlarge modal
- **Download Functionality**: Download generated images directly
- **Responsive Design**: Mobile-friendly interface
- **Database Integration**: PostgreSQL database for storing artwork metadata

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL 
- **AI Service**: Gemini 3.1 Flash Image
- **Deployment**: docker on VPS


## Usage

### Generating Art

1. Navigate to the main page
2. Enter a description of the artwork you want to create
3. Select one or more art styles
4. Click "Generate" and wait for the AI to create your artwork
5. Download or save the generated image

### Viewing Gallery

1. Click "view gallery" in the navigation
2. Browse all previously generated artwork

Features planned:
3. Click on any image to view it in full size
4. Download images directly from the modal

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database (Render or local)
- Paid Gemini API key

### 1. Clone and Install

```bash
git clone <repository-url>
cd labb1/backend
npm install
```

### 2. Environment Variables

Create a `.env` file in the `backend` directory:

```env
GEMINI_API_KEY=your_gemini_api_key
PGURI=your_postgresql_connection_string
```

### 3. Database Setup

Create the `savedart` table in your PostgreSQL database:

```sql
CREATE TABLE savedart (
    id SERIAL PRIMARY KEY,
    prompt TEXT NOT NULL,
    artstyle TEXT,
    imageurl TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Run the Application

```bash
cd backend
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

- `GET /api` - Fetch all saved artwork
- `POST /api` - Save new artwork to database
- `POST /api/generate-image` - Generate new AI artwork

## Dependencies

### Backend
- `express` - Web framework
- `pg` - PostgreSQL client
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables
- `ai` - GoogleGenAI

### Frontend
- Vanilla JavaScript (no framework dependencies)
- Font Awesome icons for UI elements

## Features in Detail

### Art Styles Available
- Renaissance
- Impressionism
- Primitivism
- Expressionism
- Futurism
- Pop-art
- Abstract
- Street-art
- Minimalism
- Photography
- Vaporwave

### Responsive Design
- Mobile-optimized layouts
- Touch-friendly interface
- Adaptive image gallery grid

### Error Handling
- Network error recovery
- Storage fallback mechanisms
- User-friendly error messages

## License

This project is for educational purposes. 