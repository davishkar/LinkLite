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
        if (urlMappings[shortId] === longUrl) {
            return shortId;
        }
    }
    
    // Generate new short ID
    let shortId = generateShortId();
    
    // Make sure it's unique
    while (urlMappings[shortId]) {
        shortId = generateShortId();
    }
    
    // Store the mapping
    urlMappings[shortId] = longUrl;
    saveUrlMappings(urlMappings);
    
    return shortId;
}

// Function to display the shortened URL
function displayShortUrl(shortId, longUrl) {
    const shortUrl = `${window.location.origin}${window.location.pathname}#${shortId}`;
    const resultsContainer = document.getElementById('results-container');
    
    // Create result item
    const resultItem = document.createElement('div');
    resultItem.className = 'result-item';
    
    // URL info container
    const urlInfo = document.createElement('div');
    urlInfo.className = 'url-info';
    
    // Short URL
    const shortUrlElem = document.createElement('div');
    shortUrlElem.className = 'short-url';
    shortUrlElem.textContent = shortUrl;
    
    // Original URL
    const originalUrlElem = document.createElement('div');
    originalUrlElem.className = 'original-url';
    originalUrlElem.textContent = longUrl.length > 50 ? longUrl.substring(0, 50) + '...' : longUrl;
    
    // Add to URL info
    urlInfo.appendChild(shortUrlElem);
    urlInfo.appendChild(originalUrlElem);
    
    // Create copy button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(shortUrl)
            .then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                alert('Please copy the URL manually: ' + shortUrl);
            });
    });
    
    // Add to result item
    resultItem.appendChild(urlInfo);
    resultItem.appendChild(copyBtn);
    
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
    
    // Display each stored URL
    for (const shortId in urlMappings) {
        displayShortUrl(shortId, urlMappings[shortId]);
    }
    
    // Show results container if there are items
    if (Object.keys(urlMappings).length > 0) {
        resultsContainer.style.display = 'block';
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
            displayShortUrl(shortId, longUrl);
            
            // Clear the input field
            longUrlInput.value = '';
        });
    }
    
    // Load existing URLs
    loadExistingUrls();
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
            window.location.href = urlMappings[hash];
        }
    }
}