document.addEventListener('DOMContentLoaded', loadGallery);

async function loadGallery() {
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const galleryDiv = document.getElementById('gallery');
    
    try {
        const response = await fetch('/api');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const artItems = await response.json();

        loadingDiv.style.display = 'none';
        
        if (artItems.length === 0) {
            errorDiv.textContent = 'No art found in gallery. Create some art first!';
            return;
        }
        
        galleryDiv.style.display = 'grid';
        galleryDiv.innerHTML = '';
        
        artItems.forEach(item => {
            const artElement = createArtElement(item);
            galleryDiv.appendChild(artElement);
        });
        
    } catch (error) {
        console.error('Error loading gallery:', error);
        loadingDiv.style.display = 'none';
        errorDiv.textContent = 'Error loading gallery: ' + error.message;
        errorDiv.style.display = 'block';
    }
}

function createArtElement(artItem) {
    const div = document.createElement('div');
    div.className = 'art-item';
    
    div.innerHTML = `
        <img src="${artItem.imageurl}" alt="${artItem.prompt}" onerror="this.src='assets/placeholder.png'">
        <div class="art-description">${artItem.prompt}</div>
        <div class="art-style">Style: ${artItem.artstyle || 'No style specified'}</div>
        <small>Created: ${new Date(artItem.created_at).toLocaleDateString()}</small>
    `;
    
    return div;
}

function refreshGallery() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('error').style.display = 'none';
    document.getElementById('gallery').style.display = 'none';
    loadGallery();
}