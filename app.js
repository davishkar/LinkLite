// Initialize localStorage if not already set
if (!localStorage.getItem('urlMappings')) {
    localStorage.setItem('urlMappings', JSON.stringify({}));
}

// Function to get URL mappings from localStorage
function getUrlMappings() {
    return JSON.parse(localStorage.getItem('urlMappings') || '{}');
}

// Function to save URL mappings to localStorage
function saveUrlMappings(mappings) {
    localStorage.setItem('urlMappings', JSON.stringify(mappings));
}

// Initialize particles.js
document.addEventListener('DOMContentLoaded', function() {
    particlesJS('particles', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#8b5cf6"
            },
            shape: {
                type: "circle",
                stroke: {
                    width: 0,
                    color: "#000000"
                },
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#3b82f6",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "bubble"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                bubble: {
                    distance: 200,
                    size: 5,
                    duration: 2,
                    opacity: 0.8,
                    speed: 3
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
});

// Initialize typed.js
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('typed-text')) {
        new Typed('#typed-text', {
            strings: ['seconds.', 'one click.', 'no time.'],
            typeSpeed: 60,
            backSpeed: 40,
            backDelay: 1500,
            startDelay: 500,
            loop: true
        });
    }
});

// Function to generate a short unique ID
function generateShortId(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Function to validate URL
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

// Function to shorten URL
function shortenUrl(longUrl) {
    const urlMappings = getUrlMappings();
    
    // Check if URL already exists in our mappings
    for (const shortId in urlMappings) {
        if (urlMappings[shortId].url === longUrl) {
            return shortId;
        }
    }
    
    // Generate new short ID
    let shortId = generateShortId();
    
    // Make sure it's unique
    while (urlMappings[shortId]) {
        shortId = generateShortId();
    }
    
    // Store the mapping with timestamp
    urlMappings[shortId] = {
        url: longUrl,
        createdAt: new Date().toISOString(),
        clicks: 0
    };
    saveUrlMappings(urlMappings);
    
    return shortId;
}

// Function to delete a shortened URL
function deleteUrl(shortId) {
    const urlMappings = getUrlMappings();
    
    if (urlMappings[shortId]) {
        delete urlMappings[shortId];
        saveUrlMappings(urlMappings);
        return true;
    }
    
    return false;
}

// Function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

// Function to display the shortened URL
function displayShortUrl(shortId, urlData, number = null) {
    const shortUrl = `${window.location.origin}${window.location.pathname}#${shortId}`;
    const resultsContainer = document.getElementById('results-container');
    const longUrl = urlData.url;
    
    // Create result item
    const resultItem = document.createElement('div');
    resultItem.className = 'result-item';
    resultItem.dataset.shortId = shortId;
    
    // URL info container
    const urlInfo = document.createElement('div');
    urlInfo.className = 'url-info';
    
    // Add number badge if provided
    if (number !== null) {
        const numberBadge = document.createElement('div');
        numberBadge.className = 'number-badge';
        numberBadge.textContent = number;
        urlInfo.appendChild(numberBadge);
    }
    
    // URL details container
    const urlDetails = document.createElement('div');
    urlDetails.className = 'url-details';
    
    // Short URL
    const shortUrlElem = document.createElement('div');
    shortUrlElem.className = 'short-url';
    shortUrlElem.textContent = shortUrl;
    
    // Original URL
    const originalUrlElem = document.createElement('div');
    originalUrlElem.className = 'original-url';
    originalUrlElem.textContent = longUrl.length > 50 ? longUrl.substring(0, 50) + '...' : longUrl;
    originalUrlElem.title = longUrl; // Show full URL on hover
    
    // Creation date
    const dateElem = document.createElement('div');
    dateElem.className = 'url-date';
    dateElem.textContent = urlData.createdAt ? formatDate(urlData.createdAt) : 'Unknown date';
    
    // Click count
    const clicksElem = document.createElement('div');
    clicksElem.className = 'url-clicks';
    clicksElem.textContent = `Clicks: ${urlData.clicks || 0}`;
    
    // Add to URL details
    urlDetails.appendChild(shortUrlElem);
    urlDetails.appendChild(originalUrlElem);
    urlDetails.appendChild(dateElem);
    urlDetails.appendChild(clicksElem);
    
    // Add details to info container
    urlInfo.appendChild(urlDetails);
    
    // Button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    
    // Create copy button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(shortUrl)
            .then(() => {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                alert('Please copy the URL manually: ' + shortUrl);
            });
    });
    
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
    deleteBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this shortened URL?')) {
            if (deleteUrl(shortId)) {
                resultItem.remove();
                
                // Update remaining numbers
                const items = resultsContainer.querySelectorAll('.result-item');
                items.forEach((item, index) => {
                    const badge = item.querySelector('.number-badge');
                    if (badge) {
                        badge.textContent = index + 1;
                    }
                });
                
                // Hide container if no more items
                if (resultsContainer.querySelectorAll('.result-item').length === 0) {
                    resultsContainer.style.display = 'none';
                }
            }
        }
    });
    
    // Add buttons to container
    buttonContainer.appendChild(copyBtn);
    buttonContainer.appendChild(deleteBtn);
    
    // Add to result item
    resultItem.appendChild(urlInfo);
    resultItem.appendChild(buttonContainer);
    
    // Add to results container
    resultsContainer.insertBefore(resultItem, resultsContainer.firstChild);
    
    // Show results container
    resultsContainer.style.display = 'block';
}

// Function to load existing shortened URLs from localStorage
function loadExistingUrls() {
    const urlMappings = getUrlMappings();
    const resultsContainer = document.getElementById('results-container');
    
    // Clear existing content
    resultsContainer.innerHTML = '';
    
    // Create history header
    const historyHeader = document.createElement('div');
    historyHeader.className = 'history-header';
    
    const historyTitle = document.createElement('h3');
    historyTitle.textContent = 'Your Link History';
    
    const clearAllBtn = document.createElement('button');
    clearAllBtn.className = 'clear-all-btn';
    clearAllBtn.innerHTML = '<i class="fas fa-trash-alt"></i> Clear All';
    clearAllBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all your shortened URLs? This cannot be undone.')) {
            localStorage.setItem('urlMappings', JSON.stringify({}));
            resultsContainer.innerHTML = '';
            resultsContainer.style.display = 'none';
        }
    });
    
    historyHeader.appendChild(historyTitle);
    historyHeader.appendChild(clearAllBtn);
    
    resultsContainer.appendChild(historyHeader);
    
    // Prepare data for sorting
    const urlEntries = Object.entries(urlMappings).map(([shortId, data]) => ({
        shortId,
        data
    }));
    
    // Sort by creation date (newest first)
    urlEntries.sort((a, b) => {
        const dateA = a.data.createdAt ? new Date(a.data.createdAt) : new Date(0);
        const dateB = b.data.createdAt ? new Date(b.data.createdAt) : new Date(0);
        return dateB - dateA;
    });
    
    // Add counter for numbering
    let counter = 1;
    
    // Display each stored URL
    urlEntries.forEach(entry => {
        displayShortUrl(entry.shortId, entry.data, counter++);
    });
    
    // Show results container if there are items
    if (urlEntries.length > 0) {
        resultsContainer.style.display = 'block';
    }
}

// Toggle history visibility
function toggleHistory() {
    const resultsContainer = document.getElementById('results-container');
    
    if (resultsContainer.style.display === 'none') {
        loadExistingUrls();
    } else {
        resultsContainer.style.display = 'none';
    }
}

// Event listener for the shorten button
document.addEventListener('DOMContentLoaded', function() {
    const shortenButton = document.getElementById('shorten-button');
    
    if (shortenButton) {
        shortenButton.addEventListener('click', () => {
            const longUrlInput = document.getElementById('long-url-input');
            const longUrl = longUrlInput.value.trim();
            
            if (!isValidUrl(longUrl)) {
                alert('Please enter a valid URL, including http:// or https://');
                return;
            }
            
            const shortId = shortenUrl(longUrl);
            displayShortUrl(shortId, getUrlMappings()[shortId]);
            
            // Clear the input field
            longUrlInput.value = '';
        });
    }
    
    // Add event listener for the history button
    const historyButton = document.getElementById('history-button');
    if (historyButton) {
        historyButton.addEventListener('click', toggleHistory);
    }
    
    // Load existing URLs if history is visible by default
    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer && resultsContainer.style.display !== 'none') {
        loadExistingUrls();
    }
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});

// Check for hash in URL and redirect if needed
window.addEventListener('hashchange', checkHash);
window.addEventListener('load', checkHash);

function checkHash() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        const urlMappings = getUrlMappings();
        if (urlMappings[hash]) {
            // Increment click count
            urlMappings[hash].clicks = (urlMappings[hash].clicks || 0) + 1;
            saveUrlMappings(urlMappings);
            
            // Redirect
            window.location.href = urlMappings[hash].url;
        }
    }
}