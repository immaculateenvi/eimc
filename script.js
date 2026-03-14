document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing all components');
    
    // Initialize all components
    initMobileNavigation();
    initThemeDropdown();
    initDevLab();
    initThemeCustomization();
    initPortfolio();
    initNameArtGenerator();
    initCalculator();
    initFooter();
    initKeyboardShortcuts();
    initImageFallbacks();
    initLightbox();
    
    // Load saved settings
    loadSettings();
    
    // Add lazy loading for images
    initLazyLoading();
});

// ================ MOBILE NAVIGATION - COMPLETELY FIXED ================
function initMobileNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const dropdowns = document.querySelectorAll('.dropdown');
    const body = document.body;
    
    if (!mobileMenuBtn || !navLinks) {
        console.error('Mobile menu elements not found');
        return;
    }
    
    console.log('Mobile navigation initialized');
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = navLinks.classList.contains('active');
        
        if (!isActive) {
            // Open menu
            navLinks.classList.add('active');
            this.innerHTML = '<i class="fas fa-times"></i>';
            body.classList.add('menu-open');
            
            // Close all dropdowns when opening menu
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        } else {
            // Close menu
            navLinks.classList.remove('active');
            this.innerHTML = '<i class="fas fa-bars"></i>';
            body.classList.remove('menu-open');
        }
    });
    
    // Handle dropdown toggles in mobile
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Only handle in mobile view
            if (window.innerWidth < 768) {
                const dropdown = this.closest('.dropdown');
                if (dropdown) {
                    // Toggle this dropdown
                    dropdown.classList.toggle('active');
                    console.log('Dropdown toggled:', dropdown.classList.contains('active'));
                }
            }
        });
    });
    
    // Close menu when clicking on nav links (except dropdown toggles)
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.innerWidth < 768) {
                // Close mobile menu
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                body.classList.remove('menu-open');
                
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Handle dropdown items (they should close the menu)
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth < 768) {
                // Close mobile menu
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                body.classList.remove('menu-open');
                
                // Close all dropdowns
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isMenuOpen = navLinks.classList.contains('active');
        const isClickInsideMenu = navLinks.contains(event.target);
        const isClickOnMenuBtn = mobileMenuBtn.contains(event.target);
        
        if (isMenuOpen && !isClickInsideMenu && !isClickOnMenuBtn) {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            body.classList.remove('menu-open');
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            // Reset mobile menu state on desktop
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            body.classList.remove('menu-open');
            
            // Close all dropdowns on desktop
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    // Prevent scroll when menu is open on mobile
    navLinks.addEventListener('touchmove', function(e) {
        if (window.innerWidth < 768) {
            e.stopPropagation();
        }
    }, { passive: true });
}

// ================ THEME DROPDOWN ================
function initThemeDropdown() {
    const dropdownToggle = document.getElementById('themeDropdown');
    const dropdown = document.querySelector('.dropdown');
    const themePresets = document.querySelectorAll('.theme-preset');
    const resetAllBtn = document.getElementById('resetAllSettings');
    const openDevlabBtn = document.getElementById('openDevlab');
    
    if (!dropdownToggle || !dropdown) {
        console.error('Theme dropdown elements not found');
        return;
    }
    
    console.log('Theme dropdown initialized');
    
    // Toggle dropdown
    dropdownToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (window.innerWidth >= 768) {
            // On desktop, just toggle
            dropdown.classList.toggle('active');
        }
    });
    
    // Close dropdown when clicking outside on desktop
    document.addEventListener('click', (e) => {
        if (window.innerWidth >= 768 && !dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dropdown.classList.remove('active');
        }
    });
    
    // Theme preset clicks
    themePresets.forEach(preset => {
        preset.addEventListener('click', () => {
            const theme = preset.dataset.theme;
            applyQuickTheme(theme);
            dropdown.classList.remove('active');
            showNotification(`Theme applied: ${preset.querySelector('span:last-child')?.textContent || 'Theme'}`);
        });
    });
    
    // Reset all settings
    if (resetAllBtn) {
        resetAllBtn.addEventListener('click', () => {
            resetAllThemeSettings();
            dropdown.classList.remove('active');
            showNotification('All settings reset to default');
        });
    }
    
    // Open DevLab
    const devlabSidebar = document.getElementById('devlabSidebar');
    if (openDevlabBtn && devlabSidebar) {
        openDevlabBtn.addEventListener('click', () => {
            devlabSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
            dropdown.classList.remove('active');
            
            if (window.innerWidth < 768) {
                // Close mobile menu if open
                const navLinks = document.getElementById('navLinks');
                const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                if (navLinks) navLinks.classList.remove('active');
                if (mobileMenuBtn) mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.classList.remove('menu-open');
            }
        });
    }
}

// Quick theme application
function applyQuickTheme(theme) {
    const themes = {
        default: {
            primary: '#1a3b5d',
            secondary: '#2c4c6e',
            accent: '#d32f2f',
            gold: '#c6a43f',
            bgPrimary: '#f5f7fa'
        },
        dark: {
            primary: '#2d3436',
            secondary: '#636e72',
            accent: '#e17055',
            gold: '#fdcb6e',
            bgPrimary: '#1a1a2e'
        },
        ocean: {
            primary: '#0984e3',
            secondary: '#00cec9',
            accent: '#ff7675',
            gold: '#fdcb6e',
            bgPrimary: '#f5f7fa'
        },
        sunset: {
            primary: '#e17055',
            secondary: '#fdcb6e',
            accent: '#d63031',
            gold: '#f39c12',
            bgPrimary: '#fff9e6'
        },
        purple: {
            primary: '#6c5ce7',
            secondary: '#a29bfe',
            accent: '#fd79a8',
            gold: '#fdcb6e',
            bgPrimary: '#f5f7fa'
        },
        green: {
            primary: '#00b894',
            secondary: '#00cec9',
            accent: '#e84342',
            gold: '#fdcb6e',
            bgPrimary: '#f5f7fa'
        }
    };
    
    if (themes[theme]) {
        // Update CSS variables
        updateCSSVariable('--patriot-blue', themes[theme].primary);
        updateCSSVariable('--secondary', themes[theme].secondary);
        updateCSSVariable('--ambition-red', themes[theme].accent);
        updateCSSVariable('--stellar-gold', themes[theme].gold);
        updateCSSVariable('--bg-primary', themes[theme].bgPrimary);
        
        // Update color pickers if they exist
        const primaryColor = document.getElementById('primaryColor');
        const secondaryColor = document.getElementById('secondaryColor');
        const accentColor = document.getElementById('accentColor');
        const goldColor = document.getElementById('goldColor');
        const bgColor = document.getElementById('bgColor');
        
        if (primaryColor) primaryColor.value = themes[theme].primary;
        if (secondaryColor) secondaryColor.value = themes[theme].secondary;
        if (accentColor) accentColor.value = themes[theme].accent;
        if (goldColor) goldColor.value = themes[theme].gold;
        if (bgColor) bgColor.value = themes[theme].bgPrimary;
        
        // Update hex displays
        document.querySelectorAll('.color-hex').forEach(span => {
            const input = span.closest('.color-input-wrapper')?.querySelector('input[type="color"]');
            if (input) span.textContent = input.value;
        });
        
        // Update body class for dark theme
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }
}

// Reset all theme settings
function resetAllThemeSettings() {
    // Reset to default colors
    updateCSSVariable('--patriot-blue', '#1a3b5d');
    updateCSSVariable('--secondary', '#2c4c6e');
    updateCSSVariable('--ambition-red', '#d32f2f');
    updateCSSVariable('--stellar-gold', '#c6a43f');
    updateCSSVariable('--bg-primary', '#f5f7fa');
    updateCSSVariable('--bg-card', '#ffffff');
    
    // Reset fonts
    updateCSSVariable('--font-heading', 'Poppins, sans-serif');
    updateCSSVariable('--font-body', 'Inter, sans-serif');
    updateCSSVariable('--font-size-base', '16px');
    
    // Reset layout
    updateCSSVariable('--grid-columns', '3');
    
    // Update form elements
    const headingFont = document.getElementById('headingFont');
    const bodyFont = document.getElementById('bodyFont');
    const fontSize = document.getElementById('fontSize');
    const fontValue = document.getElementById('fontValue');
    
    if (headingFont) headingFont.value = 'Poppins';
    if (bodyFont) bodyFont.value = 'Inter';
    if (fontSize) {
        fontSize.value = '16';
        if (fontValue) fontValue.textContent = '16px';
    }
    
    // Update color pickers
    const primaryColor = document.getElementById('primaryColor');
    const secondaryColor = document.getElementById('secondaryColor');
    const accentColor = document.getElementById('accentColor');
    const goldColor = document.getElementById('goldColor');
    const bgColor = document.getElementById('bgColor');
    const cardBgColor = document.getElementById('cardBgColor');
    
    if (primaryColor) primaryColor.value = '#1a3b5d';
    if (secondaryColor) secondaryColor.value = '#2c4c6e';
    if (accentColor) accentColor.value = '#d32f2f';
    if (goldColor) goldColor.value = '#c6a43f';
    if (bgColor) bgColor.value = '#f5f7fa';
    if (cardBgColor) cardBgColor.value = '#ffffff';
    
    // Update hex displays
    document.querySelectorAll('.color-hex').forEach(span => {
        const input = span.closest('.color-input-wrapper')?.querySelector('input[type="color"]');
        if (input) span.textContent = input.value;
    });
    
    // Remove dark theme class
    document.body.classList.remove('dark-theme');
}

// ================ DEVLAB ================
function initDevLab() {
    const devlabSidebar = document.getElementById('devlabSidebar');
    const closeDevlab = document.getElementById('closeDevlab');
    const sidebarTabs = document.querySelectorAll('.sidebar-tab');
    const editorTabs = document.querySelectorAll('.editor-tab');
    const runCodeBtn = document.getElementById('runCodeBtn');
    const runCodeSidebar = document.getElementById('runCodeSidebar');
    const templateBtns = document.querySelectorAll('.template-btn');
    const clearCodeBtn = document.getElementById('clearCodeBtn');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const downloadCodeBtn = document.getElementById('downloadCodeBtn');
    const refreshPreview = document.getElementById('refreshPreview');
    const fullscreenPreview = document.getElementById('fullscreenPreview');
    
    // Sidebar tabs
    if (sidebarTabs.length) {
        sidebarTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                
                sidebarTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                document.querySelectorAll('.sidebar-panel').forEach(panel => {
                    panel.classList.remove('active');
                });
                
                const panel = document.getElementById(`${tabId}Panel`);
                if (panel) panel.classList.add('active');
            });
        });
    }
    
    // Close DevLab
    if (closeDevlab && devlabSidebar) {
        closeDevlab.addEventListener('click', () => {
            devlabSidebar.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && devlabSidebar?.classList.contains('active')) {
            devlabSidebar.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Editor tab switching
    editorTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const editorType = this.dataset.editor;
            
            editorTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.code-editor').forEach(editor => {
                editor.classList.remove('active');
            });
            
            const editorElement = document.getElementById(`${editorType}Editor`);
            if (editorElement) editorElement.classList.add('active');
        });
    });
    
    // Run code
    if (runCodeBtn) {
        runCodeBtn.addEventListener('click', runCodePreview);
    }
    
    if (runCodeSidebar) {
        runCodeSidebar.addEventListener('click', runCodePreview);
    }
    
    function runCodePreview() {
        const htmlCode = document.getElementById('htmlEditor')?.value || '';
        const cssCode = document.getElementById('cssEditor')?.value || '';
        const jsCode = document.getElementById('jsEditor')?.value || '';
        const preview = document.getElementById('codePreview');
        
        if (!preview) return;
        
        // Clear preview
        preview.innerHTML = '';
        
        // Create iframe for better isolation
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.background = 'white';
        
        preview.appendChild(iframe);
        
        // Write content to iframe
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>${cssCode}</style>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
            </head>
            <body style="font-family: 'Inter', sans-serif; margin: 0; padding: 16px;">
                ${htmlCode}
                <script>
                    try {
                        ${jsCode}
                    } catch (error) {
                        console.error('JavaScript Error:', error);
                        const errorDiv = document.createElement('div');
                        errorDiv.style.color = 'red';
                        errorDiv.style.padding = '8px';
                        errorDiv.style.margin = '8px';
                        errorDiv.style.background = '#ffeeee';
                        errorDiv.style.borderRadius = '4px';
                        errorDiv.textContent = 'Error: ' + error.message;
                        document.body.appendChild(errorDiv);
                    }
                <\/script>
            </body>
            </html>
        `);
        iframeDoc.close();
    }
    
    // Code templates
    const templates = {
        button: {
            html: `<button class="custom-btn">Click Me</button>`,
            css: `.custom-btn {
    background: #1a3b5d;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 16px;
}

.custom-btn:hover {
    background: #2c4c6e;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}`,
            js: `document.querySelector('.custom-btn').addEventListener('click', function() {
    alert('Button clicked!');
});`
        },
        card: {
            html: `<div class="custom-card">
    <h3>Beautiful Card</h3>
    <p>This is a custom card component with clean design.</p>
    <button class="custom-btn">Learn More</button>
</div>`,
            css: `.custom-card {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    max-width: 300px;
    margin: 0 auto;
    text-align: center;
    border: 1px solid #e1e5e9;
}

.custom-card h3 {
    color: #1a3b5d;
    margin-bottom: 12px;
    font-family: 'Poppins', sans-serif;
}

.custom-card p {
    color: #666;
    margin-bottom: 20px;
}

.custom-btn {
    background: #1a3b5d;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
}

.custom-btn:hover {
    background: #2c4c6e;
}`,
            js: `// Card interaction
document.querySelector('.custom-btn').addEventListener('click', function() {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = '';
    }, 200);
});`
        },
        navbar: {
            html: `<nav class="custom-nav">
    <div class="nav-logo">EIMC</div>
    <div class="nav-links">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Services</a>
        <a href="#">Contact</a>
    </div>
</nav>`,
            css: `.custom-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    border-radius: 8px;
}

.nav-logo {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a3b5d;
}

.nav-links {
    display: flex;
    gap: 24px;
}

.nav-links a {
    color: #333;
    text-decoration: none;
    font-weight: 500;
    padding: 8px 16px;
    border-radius: 6px;
    transition: all 0.3s;
}

.nav-links a:hover {
    background: #1a3b5d;
    color: white;
}`,
            js: `// Navbar interaction
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-links a').forEach(l => l.style.background = '');
        e.target.style.background = '#1a3b5d';
        e.target.style.color = 'white';
    });
});`
        },
        form: {
            html: `<form class="custom-form">
    <h3>Contact Us</h3>
    <div class="form-group">
        <input type="text" placeholder="Your Name" required>
    </div>
    <div class="form-group">
        <input type="email" placeholder="Your Email" required>
    </div>
    <div class="form-group">
        <textarea placeholder="Your Message" rows="4"></textarea>
    </div>
    <button type="submit">Send Message</button>
</form>`,
            css: `.custom-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 24px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.custom-form h3 {
    color: #1a3b5d;
    margin-bottom: 20px;
    text-align: center;
}

.form-group {
    margin-bottom: 16px;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #1a3b5d;
}

.custom-form button {
    width: 100%;
    padding: 12px;
    background: #1a3b5d;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s;
}

.custom-form button:hover {
    background: #2c4c6e;
}`,
            js: `document.querySelector('.custom-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Form submitted! (Demo)');
});`
        },
        grid: {
            html: `<div class="demo-grid">
    <div class="grid-item">1</div>
    <div class="grid-item">2</div>
    <div class="grid-item">3</div>
    <div class="grid-item">4</div>
    <div class="grid-item">5</div>
    <div class="grid-item">6</div>
</div>`,
            css: `.demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
    padding: 16px;
}

.grid-item {
    background: linear-gradient(135deg, #1a3b5d, #2c4c6e);
    color: white;
    padding: 40px 20px;
    text-align: center;
    border-radius: 8px;
    font-size: 24px;
    font-weight: bold;
    transition: transform 0.3s;
}

.grid-item:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}`,
            js: `// Grid interaction
document.querySelectorAll('.grid-item').forEach(item => {
    item.addEventListener('click', function() {
        this.style.background = '#d32f2f';
        setTimeout(() => {
            this.style.background = '';
        }, 500);
    });
});`
        },
        modal: {
            html: `<div class="demo-container">
    <button class="open-modal-btn">Open Modal</button>
    
    <div class="modal" id="demoModal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>Modal Title</h3>
            <p>This is a demo modal window. Click the close button or outside to close.</p>
            <button class="modal-close-btn">Close</button>
        </div>
    </div>
</div>`,
            css: `.demo-container {
    text-align: center;
    padding: 20px;
}

.open-modal-btn {
    background: #1a3b5d;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
}

.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal.show {
    display: flex;
}

.modal-content {
    background: white;
    padding: 30px;
    border-radius: 12px;
    max-width: 400px;
    width: 90%;
    position: relative;
    animation: slideDown 0.3s ease;
}

@keyframes slideDown {
    from {
        transform: translateY(-50px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.close-modal {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 24px;
    cursor: pointer;
    color: #666;
}

.close-modal:hover {
    color: #d32f2f;
}

.modal-close-btn {
    background: #1a3b5d;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 15px;
}`,
            js: `// Modal functionality
const modal = document.getElementById('demoModal');
const openBtn = document.querySelector('.open-modal-btn');
const closeBtn = document.querySelector('.close-modal');
const closeModalBtn = document.querySelector('.modal-close-btn');

function openModal() {
    modal.classList.add('show');
}

function closeModal() {
    modal.classList.remove('show');
}

openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
closeModalBtn.addEventListener('click', closeModal);

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});`
        },
        animation: {
            html: `<div class="animated-box">Hover Me</div>`,
            css: `.animated-box {
    width: 200px;
    height: 200px;
    background: linear-gradient(135deg, #1a3b5d, #c6a43f);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.2rem;
    font-weight: bold;
    margin: 0 auto;
    transition: all 0.5s ease;
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
}

.animated-box:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 20px 30px rgba(0,0,0,0.3);
}`,
            js: `// No JavaScript needed for this animation`
        },
        flex: {
            html: `<div class="flex-container">
    <div class="flex-item">1</div>
    <div class="flex-item">2</div>
    <div class="flex-item">3</div>
    <div class="flex-item">4</div>
</div>`,
            css: `.flex-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
    padding: 20px;
    background: #f0f0f0;
    border-radius: 12px;
}

.flex-item {
    flex: 1 1 200px;
    padding: 30px;
    background: linear-gradient(135deg, #1a3b5d, #2c4c6e);
    color: white;
    text-align: center;
    border-radius: 8px;
    font-size: 1.5rem;
    font-weight: bold;
    transition: all 0.3s ease;
}

.flex-item:hover {
    transform: scale(1.05);
    background: linear-gradient(135deg, #c6a43f, #d32f2f);
}`,
            js: `// Flexbox demo
document.querySelectorAll('.flex-item').forEach(item => {
    item.addEventListener('click', function() {
        this.style.order = Math.floor(Math.random() * 10);
    });
});`
        }
    };
    
    templateBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const templateName = this.dataset.template;
            if (templates[templateName]) {
                const htmlEditor = document.getElementById('htmlEditor');
                const cssEditor = document.getElementById('cssEditor');
                const jsEditor = document.getElementById('jsEditor');
                
                if (htmlEditor) htmlEditor.value = templates[templateName].html;
                if (cssEditor) cssEditor.value = templates[templateName].css;
                if (jsEditor) jsEditor.value = templates[templateName].js || '';
                
                // Switch to HTML tab
                editorTabs.forEach(t => t.classList.remove('active'));
                const htmlTab = document.querySelector('.editor-tab[data-editor="html"]');
                if (htmlTab) htmlTab.classList.add('active');
                
                document.querySelectorAll('.code-editor').forEach(editor => editor.classList.remove('active'));
                if (htmlEditor) htmlEditor.classList.add('active');
                
                // Auto-run the code
                if (runCodeBtn) runCodeBtn.click();
                
                showNotification(`Template loaded: ${templateName}`);
            }
        });
    });
    
    // Clear code
    if (clearCodeBtn) {
        clearCodeBtn.addEventListener('click', function() {
            const activeEditor = document.querySelector('.code-editor.active');
            if (activeEditor) {
                activeEditor.value = '';
                showNotification('Code cleared');
            }
        });
    }
    
    // Copy code
    if (copyCodeBtn) {
        copyCodeBtn.addEventListener('click', function() {
            const activeEditor = document.querySelector('.code-editor.active');
            if (activeEditor && activeEditor.value) {
                navigator.clipboard.writeText(activeEditor.value).then(() => {
                    showNotification('Code copied to clipboard!');
                }).catch(() => {
                    showNotification('Failed to copy code');
                });
            } else {
                showNotification('No code to copy');
            }
        });
    }
    
    // Download code
    if (downloadCodeBtn) {
        downloadCodeBtn.addEventListener('click', function() {
            const activeEditor = document.querySelector('.code-editor.active');
            if (activeEditor && activeEditor.value) {
                const blob = new Blob([activeEditor.value], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `code.${activeEditor.id.replace('Editor', '')}`;
                a.click();
                URL.revokeObjectURL(url);
                showNotification('Code downloaded!');
            } else {
                showNotification('No code to download');
            }
        });
    }
    
    // Refresh preview
    if (refreshPreview) {
        refreshPreview.addEventListener('click', runCodePreview);
    }
    
    // Fullscreen preview
    if (fullscreenPreview) {
        fullscreenPreview.addEventListener('click', function() {
            const preview = document.getElementById('codePreview');
            if (preview) {
                if (preview.requestFullscreen) {
                    preview.requestFullscreen();
                }
            }
        });
    }
}

// ================ THEME CUSTOMIZATION ================
function initThemeCustomization() {
    const colorInputs = document.querySelectorAll('.color-item input[type="color"]');
    const fontSelects = document.querySelectorAll('.font-select');
    const applyThemeBtn = document.getElementById('applyThemeBtn');
    const resetThemeBtn = document.getElementById('resetThemeBtn');
    const saveThemeBtn = document.getElementById('saveThemeBtn');
    const themeCards = document.querySelectorAll('.theme-card');
    const fontSize = document.getElementById('fontSize');
    const fontValue = document.getElementById('fontValue');
    
    // Theme presets
    themeCards.forEach(card => {
        card.addEventListener('click', function() {
            const theme = this.dataset.theme;
            applyQuickTheme(theme);
        });
    });
    
    // Color pickers
    colorInputs.forEach(input => {
        input.addEventListener('input', function() {
            const id = this.id;
            if (id === 'primaryColor') {
                updateCSSVariable('--patriot-blue', this.value);
                updateHexDisplay(this, this.value);
            } else if (id === 'secondaryColor') {
                updateCSSVariable('--secondary', this.value);
                updateHexDisplay(this, this.value);
            } else if (id === 'accentColor') {
                updateCSSVariable('--ambition-red', this.value);
                updateHexDisplay(this, this.value);
            } else if (id === 'goldColor') {
                updateCSSVariable('--stellar-gold', this.value);
                updateHexDisplay(this, this.value);
            } else if (id === 'bgColor') {
                updateCSSVariable('--bg-primary', this.value);
                updateHexDisplay(this, this.value);
            } else if (id === 'cardBgColor') {
                updateCSSVariable('--bg-card', this.value);
                updateHexDisplay(this, this.value);
            }
        });
    });
    
    function updateHexDisplay(input, value) {
        const hexSpan = input.closest('.color-input-wrapper')?.querySelector('.color-hex');
        if (hexSpan) hexSpan.textContent = value;
    }
    
    // Font selection
    fontSelects.forEach(select => {
        select.addEventListener('change', function() {
            const id = this.id;
            if (id === 'headingFont') {
                updateCSSVariable('--font-heading', this.value + ', sans-serif');
            } else if (id === 'bodyFont') {
                updateCSSVariable('--font-body', this.value + ', sans-serif');
            }
        });
    });
    
    // Font size range
    if (fontSize && fontValue) {
        fontSize.addEventListener('input', function() {
            const size = this.value + 'px';
            fontValue.textContent = size;
            updateCSSVariable('--font-size-base', size);
        });
    }
    
    // Apply theme button
    if (applyThemeBtn) {
        applyThemeBtn.addEventListener('click', function() {
            showNotification('Theme applied successfully!');
        });
    }
    
    // Reset theme button
    if (resetThemeBtn) {
        resetThemeBtn.addEventListener('click', function() {
            resetAllThemeSettings();
            showNotification('Theme reset to default');
        });
    }
    
    // Save theme button
    if (saveThemeBtn) {
        saveThemeBtn.addEventListener('click', function() {
            // Get current theme settings
            const themeSettings = {
                primary: document.getElementById('primaryColor')?.value || '#1a3b5d',
                secondary: document.getElementById('secondaryColor')?.value || '#2c4c6e',
                accent: document.getElementById('accentColor')?.value || '#d32f2f',
                gold: document.getElementById('goldColor')?.value || '#c6a43f',
                bgPrimary: document.getElementById('bgColor')?.value || '#f5f7fa',
                headingFont: document.getElementById('headingFont')?.value || 'Poppins',
                bodyFont: document.getElementById('bodyFont')?.value || 'Inter',
                fontSize: document.getElementById('fontSize')?.value || '16'
            };
            
            try {
                localStorage.setItem('savedTheme', JSON.stringify(themeSettings));
                showNotification('Theme saved successfully!');
            } catch (e) {
                showNotification('Failed to save theme');
            }
        });
    }
    
    // Load saved theme
    try {
        const savedTheme = localStorage.getItem('savedTheme');
        if (savedTheme) {
            const theme = JSON.parse(savedTheme);
            
            // Apply saved theme settings
            if (theme.primary) {
                const primaryInput = document.getElementById('primaryColor');
                if (primaryInput) {
                    primaryInput.value = theme.primary;
                    updateCSSVariable('--patriot-blue', theme.primary);
                }
            }
            if (theme.secondary) {
                const secondaryInput = document.getElementById('secondaryColor');
                if (secondaryInput) {
                    secondaryInput.value = theme.secondary;
                    updateCSSVariable('--secondary', theme.secondary);
                }
            }
            if (theme.accent) {
                const accentInput = document.getElementById('accentColor');
                if (accentInput) {
                    accentInput.value = theme.accent;
                    updateCSSVariable('--ambition-red', theme.accent);
                }
            }
            if (theme.gold) {
                const goldInput = document.getElementById('goldColor');
                if (goldInput) {
                    goldInput.value = theme.gold;
                    updateCSSVariable('--stellar-gold', theme.gold);
                }
            }
            if (theme.bgPrimary) {
                const bgInput = document.getElementById('bgColor');
                if (bgInput) {
                    bgInput.value = theme.bgPrimary;
                    updateCSSVariable('--bg-primary', theme.bgPrimary);
                }
            }
            
            // Update hex displays
            document.querySelectorAll('.color-hex').forEach(span => {
                const input = span.closest('.color-input-wrapper')?.querySelector('input[type="color"]');
                if (input) span.textContent = input.value;
            });
        }
    } catch (e) {
        console.warn('No saved theme found');
    }
}

// ================ PORTFOLIO WITH LOAD MORE AND LIGHTBOX ================
function initPortfolio() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const viewBtns = document.querySelectorAll('.view-btn');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const shownCount = document.getElementById('shownCount');
    const totalCount = document.getElementById('totalCount');
    
    if (!portfolioGrid) {
        console.error('Portfolio grid not found');
        return;
    }
    
    console.log('Portfolio initialized');
    
    let allProjects = [];
    let displayedProjects = [];
    let currentFilter = 'all';
    let currentView = 'grid';
    let itemsPerLoad = window.innerWidth < 768 ? 4 : 6;
    let currentIndex = 0;
    
    // Initialize portfolio
    loadPortfolio();
    
    // Filter projects
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentFilter = this.dataset.filter;
            currentIndex = 0;
            
            // Update active filter
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter and display projects
            filterAndDisplayProjects();
            
            // Save filter setting
            saveSetting('portfolioFilter', currentFilter);
        });
    });
    
    // Change view
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            currentView = this.dataset.view;
            
            // Update active view
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update grid class
            portfolioGrid.className = 'portfolio-grid ' + currentView;
            
            // Refresh display
            filterAndDisplayProjects();
            
            // Save view setting
            saveSetting('portfolioView', currentView);
        });
    });
    
    // Load more projects
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreProjects);
    }
    
    async function loadPortfolio() {
        // Show loading
        portfolioGrid.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading projects...</p>
            </div>
        `;
        
        // Generate projects data with placeholders
        allProjects = [];
        
        // Categories for projects
        const categories = ['design', 'web', 'branding'];
        const categoryNames = {
            design: 'Design Project',
            web: 'Web Project',
            branding: 'Branding Project'
        };
        
        // Tags for each category
        const categoryTags = {
            design: ['Design', 'Creative', 'UI/UX'],
            web: ['Web', 'Development', 'Responsive'],
            branding: ['Branding', 'Identity', 'Logo']
        };
        
        // Descriptions for each category
        const categoryDescriptions = {
            design: 'Creative design solution with modern aesthetics and professional approach.',
            web: 'Responsive web development with clean code and optimal performance.',
            branding: 'Complete brand identity development with strategic positioning.'
        };
        
        // Create 29 projects
        for (let i = 1; i <= 29; i++) {
            // Assign categories
            let category;
            if (i <= 10) category = 'design';
            else if (i <= 18) category = 'web';
            else if (i <= 24) category = 'branding';
            else category = categories[i % 3];
            
            const projectNumber = i.toString().padStart(2, '0');
            
            allProjects.push({
                id: i,
                src: `${i}.jpg`,
                fallback: `https://via.placeholder.com/400x300/1a3b5d/ffffff?text=EIMC+Project+${projectNumber}`,
                category: category,
                title: `${categoryNames[category]} ${projectNumber}`,
                description: categoryDescriptions[category],
                tags: categoryTags[category]
            });
        }
        
        // Update total count
        if (totalCount) {
            totalCount.textContent = allProjects.length;
        }
        
        // Initial display
        filterAndDisplayProjects();
    }
    
    function filterAndDisplayProjects() {
        // Clear current display
        portfolioGrid.innerHTML = '';
        displayedProjects = [];
        
        // Filter projects
        const filteredProjects = currentFilter === 'all' 
            ? allProjects 
            : allProjects.filter(project => project.category === currentFilter);
        
        // Reset index
        currentIndex = 0;
        
        // Display initial batch
        displayNextBatch(filteredProjects);
        
        // Update load more button visibility
        updateLoadMoreButton(filteredProjects);
    }
    
    function displayNextBatch(projects) {
        const endIndex = Math.min(currentIndex + itemsPerLoad, projects.length);
        const batch = projects.slice(currentIndex, endIndex);
        
        batch.forEach(project => {
            const projectElement = createProjectElement(project);
            portfolioGrid.appendChild(projectElement);
            displayedProjects.push(project);
        });
        
        currentIndex = endIndex;
        
        // Update shown count
        if (shownCount) {
            shownCount.textContent = displayedProjects.length;
        }
    }
    
    function createProjectElement(project) {
        const div = document.createElement('div');
        div.className = 'portfolio-item';
        div.dataset.category = project.category;
        
        div.innerHTML = `
            <div class="portfolio-image" onclick="handleImageClick(this)">
                <img src="${project.src}" alt="${project.title}" loading="lazy" onerror="this.src='${project.fallback}'">
            </div>
            <div class="portfolio-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="portfolio-tags">
                    ${project.tags.map(tag => `<span class="portfolio-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        return div;
    }
    
    function loadMoreProjects() {
        const filteredProjects = currentFilter === 'all' 
            ? allProjects 
            : allProjects.filter(project => project.category === currentFilter);
        
        displayNextBatch(filteredProjects);
        updateLoadMoreButton(filteredProjects);
    }
    
    function updateLoadMoreButton(filteredProjects) {
        if (loadMoreBtn) {
            if (currentIndex >= filteredProjects.length) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'flex';
                loadMoreBtn.innerHTML = `<i class="fas fa-plus"></i> Load More (${filteredProjects.length - currentIndex} remaining)`;
            }
        }
    }
}

// Global helper function for image clicks
window.handleImageClick = function(container) {
    const imgElement = container.querySelector('img');
    if (!imgElement) return;
    
    // Get all portfolio images for navigation
    const allPortfolioImages = [];
    document.querySelectorAll('.portfolio-item').forEach((item, index) => {
        const img = item.querySelector('img');
        const title = item.querySelector('h3')?.textContent || 'Portfolio Image';
        if (img) {
            allPortfolioImages.push({
                imgElement: img,
                caption: title
            });
        }
    });
    
    // Find current index
    const currentIndex = allPortfolioImages.findIndex(item => item.imgElement === imgElement);
    
    // Open lightbox
    if (typeof window.openLightbox === 'function') {
        window.openLightbox(imgElement, imgElement.alt, allPortfolioImages, currentIndex);
    }
};

// ================ LIGHTBOX FOR PORTFOLIO IMAGES ================
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    if (!lightbox || !lightboxImg) {
        console.error('Lightbox elements not found');
        return;
    }
    
    let currentImages = [];
    let currentIndex = 0;
    
    // Function to open lightbox
    window.openLightbox = function(imgElement, caption, allImages, index) {
        lightboxImg.src = imgElement.src;
        lightboxCaption.textContent = caption;
        currentImages = allImages;
        currentIndex = index;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Click outside to close
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Previous image
    lightboxPrev.addEventListener('click', function(e) {
        e.stopPropagation();
        if (currentImages.length > 0) {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            const prevImage = currentImages[currentIndex];
            lightboxImg.src = prevImage.imgElement.src;
            lightboxCaption.textContent = prevImage.caption;
        }
    });
    
    // Next image
    lightboxNext.addEventListener('click', function(e) {
        e.stopPropagation();
        if (currentImages.length > 0) {
            currentIndex = (currentIndex + 1) % currentImages.length;
            const nextImage = currentImages[currentIndex];
            lightboxImg.src = nextImage.imgElement.src;
            lightboxCaption.textContent = nextImage.caption;
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            lightboxPrev.click();
        } else if (e.key === 'ArrowRight') {
            lightboxNext.click();
        }
    });
    
    console.log('Lightbox initialized');
}

// ================ NAME ART GENERATOR ================
function initNameArtGenerator() {
    const nameInput = document.getElementById('nameInput');
    const styleOptions = document.querySelectorAll('.style-option');
    const generateBtn = document.getElementById('generateArtBtn');
    const downloadBtn = document.getElementById('downloadArtBtn');
    const shareBtn = document.getElementById('shareArtBtn');
    const previewArea = document.getElementById('previewArea');
    
    if (!nameInput || !previewArea) {
        console.error('Name art generator elements not found');
        return;
    }
    
    console.log('Name art generator initialized');
    
    let currentArt = null;
    let currentStyle = 'gradient';
    
    // Style selection
    styleOptions.forEach(option => {
        option.addEventListener('click', function() {
            styleOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            currentStyle = this.dataset.style;
        });
    });
    
    // Generate art
    if (generateBtn) {
        generateBtn.addEventListener('click', generateNameArt);
    }
    
    // Download art
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadNameArt);
    }
    
    // Share art
    if (shareBtn) {
        shareBtn.addEventListener('click', shareNameArt);
    }
    
    // Enter key to generate
    nameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateNameArt();
        }
    });
    
    function generateNameArt() {
        const name = nameInput.value.trim();
        
        if (!name) {
            showNotification('Please enter a name first!');
            nameInput.focus();
            return;
        }
        
        // Clear previous art
        previewArea.innerHTML = '';
        
        // Create art element
        const artElement = document.createElement('div');
        artElement.className = 'generated-art';
        artElement.textContent = name.toUpperCase();
        
        // Apply style
        applyArtStyle(artElement, currentStyle);
        
        previewArea.appendChild(artElement);
        currentArt = name.toUpperCase();
        
        // Enable download and share buttons
        if (downloadBtn) downloadBtn.disabled = false;
        if (shareBtn) shareBtn.disabled = false;
        
        showNotification('Name art generated successfully!');
    }
    
    function applyArtStyle(element, style) {
        // Base styles
        element.style.fontFamily = 'var(--font-heading)';
        element.style.fontWeight = '800';
        element.style.textAlign = 'center';
        element.style.display = 'flex';
        element.style.alignItems = 'center';
        element.style.justifyContent = 'center';
        element.style.width = '100%';
        element.style.height = '100%';
        element.style.padding = '2rem';
        element.style.borderRadius = '12px';
        
        // Get computed colors
        const primary = getComputedStyle(document.documentElement).getPropertyValue('--patriot-blue').trim() || '#1a3b5d';
        const secondary = getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim() || '#2c4c6e';
        const gold = getComputedStyle(document.documentElement).getPropertyValue('--stellar-gold').trim() || '#c6a43f';
        const accent = getComputedStyle(document.documentElement).getPropertyValue('--ambition-red').trim() || '#d32f2f';
        
        // Style variations
        switch(style) {
            case 'gradient':
                element.style.fontSize = window.innerWidth < 768 ? '2.5rem' : '3.5rem';
                element.style.letterSpacing = '2px';
                element.style.background = `linear-gradient(135deg, ${primary}, ${gold})`;
                element.style.webkitBackgroundClip = 'text';
                element.style.webkitTextFillColor = 'transparent';
                element.style.backgroundClip = 'text';
                break;
            case 'modern':
                element.style.fontSize = window.innerWidth < 768 ? '2rem' : '3rem';
                element.style.letterSpacing = '4px';
                element.style.fontWeight = '900';
                element.style.color = primary;
                element.style.border = `4px solid ${gold}`;
                element.style.textShadow = '2px 2px 4px rgba(0,0,0,0.1)';
                element.style.background = 'transparent';
                element.style.webkitTextFillColor = 'initial';
                break;
            case 'elegant':
                element.style.fontSize = window.innerWidth < 768 ? '2.8rem' : '3.8rem';
                element.style.fontWeight = '300';
                element.style.fontStyle = 'italic';
                element.style.letterSpacing = '3px';
                element.style.color = primary;
                element.style.textShadow = `2px 2px 0 ${gold}`;
                element.style.background = 'transparent';
                element.style.webkitTextFillColor = 'initial';
                break;
            case 'neon':
                element.style.fontSize = window.innerWidth < 768 ? '2.5rem' : '3.5rem';
                element.style.letterSpacing = '2px';
                element.style.color = accent;
                element.style.textShadow = `0 0 10px ${accent}, 0 0 20px ${accent}, 0 0 30px ${accent}`;
                element.style.background = 'transparent';
                element.style.webkitTextFillColor = 'initial';
                break;
            case '3d':
                element.style.fontSize = window.innerWidth < 768 ? '2.5rem' : '3.5rem';
                element.style.fontWeight = '900';
                element.style.color = primary;
                element.style.textShadow = `3px 3px 0 ${gold}, 6px 6px 0 rgba(0,0,0,0.2)`;
                element.style.background = 'transparent';
                element.style.webkitTextFillColor = 'initial';
                break;
            case 'outline':
                element.style.fontSize = window.innerWidth < 768 ? '2.5rem' : '3.5rem';
                element.style.fontWeight = '800';
                element.style.color = 'transparent';
                element.style.webkitTextStroke = `2px ${primary}`;
                element.style.textStroke = `2px ${primary}`;
                element.style.background = 'transparent';
                element.style.webkitTextFillColor = 'transparent';
                break;
        }
    }
    
    function downloadNameArt() {
        if (!currentArt || !previewArea.firstChild) return;
        
        // Create a canvas from the art element
        const artElement = previewArea.firstChild;
        
        // Use html2canvas if available, otherwise fallback
        if (typeof html2canvas !== 'undefined') {
            html2canvas(artElement, {
                scale: 2,
                backgroundColor: null,
                allowTaint: false,
                useCORS: true
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = `eimc-name-art-${currentArt.toLowerCase().replace(/\s+/g, '-')}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                showNotification('Art downloaded successfully!');
            }).catch(() => {
                fallbackDownload();
            });
        } else {
            fallbackDownload();
        }
        
        function fallbackDownload() {
            // Fallback: create a simple canvas
            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 400;
            const ctx = canvas.getContext('2d');
            
            // Get computed colors
            const primary = getComputedStyle(document.documentElement).getPropertyValue('--patriot-blue').trim() || '#1a3b5d';
            const gold = getComputedStyle(document.documentElement).getPropertyValue('--stellar-gold').trim() || '#c6a43f';
            
            // Create gradient background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, primary);
            gradient.addColorStop(1, gold);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add text
            ctx.font = 'bold 80px Poppins, sans-serif';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 20;
            ctx.fillText(currentArt, canvas.width / 2, canvas.height / 2);
            
            // Add watermark
            ctx.font = '20px Inter, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.shadowBlur = 0;
            ctx.fillText('Created with EIMC Name Art Generator', canvas.width / 2, canvas.height - 30);
            
            // Download
            const link = document.createElement('a');
            link.download = `eimc-name-art-${currentArt.toLowerCase().replace(/\s+/g, '-')}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            showNotification('Art downloaded successfully!');
        }
    }
    
    function shareNameArt() {
        if (!currentArt) return;
        
        const shareData = {
            title: 'My Name Art',
            text: `Check out my name art "${currentArt}" created with EIMC!`,
            url: window.location.href
        };
        
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            navigator.share(shareData).catch(() => {
                // User cancelled or sharing failed
            });
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(shareData.text).then(() => {
                showNotification('Link copied to clipboard!');
            }).catch(() => {
                showNotification('Press Ctrl+C to copy');
            });
        }
    }
}

// ================ CALCULATOR ================
function initCalculator() {
    const calculateBtn = document.getElementById('calculateBtn');
    const calcResult = document.getElementById('calcResult');
    const serviceType = document.getElementById('serviceType');
    const complexity = document.getElementById('complexity');
    const timeline = document.getElementById('timeline');
    const pages = document.getElementById('pages');
    
    if (!calculateBtn || !calcResult) {
        console.error('Calculator elements not found');
        return;
    }
    
    console.log('Calculator initialized');
    
    // Exchange rates
    const exchangeRates = {
        NGN: 1,
        USD: 0.00067,
        EUR: 0.00062
    };
    
    // Currency symbols
    const currencySymbols = {
        NGN: '₦',
        USD: '$',
        EUR: '€'
    };
    
    calculateBtn.addEventListener('click', calculateCost);
    
    // Auto-calculate on input change
    [serviceType, complexity, timeline, pages, document.getElementById('currencySelector')].forEach(input => {
        if (input) {
            input.addEventListener('change', calculateCost);
        }
    });
    
    function calculateCost() {
        const service = serviceType?.value;
        const complexityValue = complexity?.value;
        const timelineValue = timeline?.value;
        const pagesCount = parseInt(pages?.value) || 1;
        const currency = document.getElementById('currencySelector')?.value || 'NGN';
        
        // Validate inputs
        if (!service || !complexityValue || !timelineValue) {
            showNotification('Please fill all required fields');
            return;
        }
        
        // Base prices in Naira
        const basePrices = {
            graphics: 50000,
            web: 150000,
            internet: 75000,
            domain: 25000
        };
        
        // Complexity multipliers
        const complexityMultipliers = {
            simple: 0.8,
            medium: 1.0,
            complex: 1.5
        };
        
        // Timeline multipliers
        const timelineMultipliers = {
            standard: 1.0,
            fast: 1.3,
            urgent: 1.7
        };
        
        // Calculate cost in Naira
        let baseCost = basePrices[service] || 0;
        let complexityFactor = complexityMultipliers[complexityValue] || 1;
        let timelineFactor = timelineMultipliers[timelineValue] || 1;
        
        // Additional cost for web pages
        let additionalCost = 0;
        if (service === 'web') {
            additionalCost = (pagesCount - 1) * 10000;
        }
        
        let totalCostNGN = (baseCost * complexityFactor * timelineFactor) + additionalCost;
        
        // Convert to selected currency
        let totalCost = totalCostNGN * exchangeRates[currency];
        let baseCostConverted = baseCost * exchangeRates[currency];
        let additionalCostConverted = additionalCost * exchangeRates[currency];
        
        // Format amount based on currency
        const formatAmount = (amount, currency) => {
            const symbol = currencySymbols[currency];
            if (currency === 'NGN') {
                return symbol + Math.round(amount).toLocaleString('en-NG');
            } else {
                return symbol + amount.toFixed(2).toLocaleString('en-US');
            }
        };
        
        // Update display
        document.getElementById('basePrice').textContent = formatAmount(baseCostConverted, currency);
        document.getElementById('complexityFactor').textContent = `${complexityFactor.toFixed(1)}x`;
        document.getElementById('timelineFactor').textContent = `${timelineFactor.toFixed(1)}x`;
        document.getElementById('additionalCost').textContent = formatAmount(additionalCostConverted, currency);
        document.getElementById('totalCost').textContent = formatAmount(totalCost, currency);
        
        // Show result
        calcResult.classList.add('active');
    }
}

// ================ FOOTER ================
function initFooter() {
    // Set current year
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ================ KEYBOARD SHORTCUTS ================
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl+R for reset
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            resetAllThemeSettings();
            showNotification('Settings reset (Ctrl+R)');
        }
        
        // Ctrl+D for DevLab
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            const devlabSidebar = document.getElementById('devlabSidebar');
            if (devlabSidebar) {
                devlabSidebar.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
        
        // Escape to close DevLab, lightbox, and dropdowns
        if (e.key === 'Escape') {
            // Close lightbox if open
            const lightbox = document.getElementById('lightbox');
            if (lightbox?.classList.contains('active')) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            // Close DevLab
            const devlabSidebar = document.getElementById('devlabSidebar');
            if (devlabSidebar?.classList.contains('active')) {
                devlabSidebar.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            // Close dropdown
            const dropdown = document.querySelector('.dropdown');
            if (dropdown) dropdown.classList.remove('active');
            
            // Close mobile menu
            if (window.innerWidth < 768) {
                const navLinks = document.getElementById('navLinks');
                const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                if (navLinks?.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (mobileMenuBtn) mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    document.body.classList.remove('menu-open');
                }
            }
        }
    });
}

// ================ IMAGE FALLBACKS ================
function initImageFallbacks() {
    // Add fallback for all images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            if (!this.hasAttribute('data-fallback-attempted')) {
                this.setAttribute('data-fallback-attempted', 'true');
                this.src = 'https://via.placeholder.com/400x300/1a3b5d/ffffff?text=EIMC';
            }
        });
    });
}

// ================ LAZY LOADING ================
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// ================ UTILITY FUNCTIONS ================
function updateCSSVariable(name, value) {
    document.documentElement.style.setProperty(name, value);
}

function saveSetting(key, value) {
    try {
        const settings = JSON.parse(localStorage.getItem('eimcSettings') || '{}');
        settings[key] = value;
        localStorage.setItem('eimcSettings', JSON.stringify(settings));
    } catch (e) {
        console.warn('Error saving setting:', e);
    }
}

function loadSettings() {
    try {
        const settings = JSON.parse(localStorage.getItem('eimcSettings') || '{}');
        
        // Load portfolio filter
        if (settings.portfolioFilter) {
            const filterBtn = document.querySelector(`.filter-btn[data-filter="${settings.portfolioFilter}"]`);
            if (filterBtn) {
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                filterBtn.classList.add('active');
            }
        }
        
        // Load portfolio view
        if (settings.portfolioView) {
            const viewBtn = document.querySelector(`.view-btn[data-view="${settings.portfolioView}"]`);
            if (viewBtn) {
                document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
                viewBtn.classList.add('active');
                
                const portfolioGrid = document.getElementById('portfolioGrid');
                if (portfolioGrid) {
                    portfolioGrid.className = 'portfolio-grid ' + settings.portfolioView;
                }
            }
        }
        
        // Load saved theme
        const savedTheme = localStorage.getItem('savedTheme');
        if (savedTheme) {
            const theme = JSON.parse(savedTheme);
            
            // Apply saved colors
            if (theme.primary) {
                const primaryColor = document.getElementById('primaryColor');
                if (primaryColor) {
                    primaryColor.value = theme.primary;
                    updateCSSVariable('--patriot-blue', theme.primary);
                }
            }
            if (theme.secondary) {
                const secondaryColor = document.getElementById('secondaryColor');
                if (secondaryColor) {
                    secondaryColor.value = theme.secondary;
                    updateCSSVariable('--secondary', theme.secondary);
                }
            }
            if (theme.accent) {
                const accentColor = document.getElementById('accentColor');
                if (accentColor) {
                    accentColor.value = theme.accent;
                    updateCSSVariable('--ambition-red', theme.accent);
                }
            }
            if (theme.gold) {
                const goldColor = document.getElementById('goldColor');
                if (goldColor) {
                    goldColor.value = theme.gold;
                    updateCSSVariable('--stellar-gold', theme.gold);
                }
            }
            if (theme.bgPrimary) {
                const bgColor = document.getElementById('bgColor');
                if (bgColor) {
                    bgColor.value = theme.bgPrimary;
                    updateCSSVariable('--bg-primary', theme.bgPrimary);
                }
            }
            
            // Update hex displays
            document.querySelectorAll('.color-hex').forEach(span => {
                const input = span.closest('.color-input-wrapper')?.querySelector('input[type="color"]');
                if (input) span.textContent = input.value;
            });
        }
    } catch (e) {
        console.warn('Error loading settings:', e);
    }
}

function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Initialize on window load
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    console.log('Window loaded - all resources loaded');
});

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Update items per load based on screen size
        const portfolioGrid = document.getElementById('portfolioGrid');
        if (portfolioGrid && window.initPortfolio) {
            // You can trigger a refresh if needed
        }
    }, 250);
});