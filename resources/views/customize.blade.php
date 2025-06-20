<!DOCTYPE html>
<html lang="en" class="light-mode">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CuteCam | Customize</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Pacifico&family=Dancing+Script:wght@400;700&family=Indie+Flower&family=Amatic+SC:wght@400;700&family=Caveat:wght@400;700&family=Kalam:wght@300;400;700&family=Permanent+Marker&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/assets/css/customize.css">
    <link rel="icon" href="/assets/img/logo-icon.png" type="image/png">
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
    <header class="main-header">
        <div class="container">
            <div class="header-content">
                <a href="/" class="logo">
                    <img src="/assets/img/logo-icon.png" alt="CuteCam Logo" class="logo-icon">
                    <span class="logo-text">CuteCam</span>
                </a>
            </div>
        </div>
    </header>

    <main class="customize-container">
        <div class="container">
            <div class="editor-wrapper">
                <div class="photo-canvas-container">
                    @if(count($photoUrls) > 0)
                    <div class="photo-selection" style="{{ count($photoUrls) === 1 ? 'display: none;' : '' }}">
                        @foreach($photoUrls as $index => $url)
                        <div class="photo-option {{ $index === 0 ? 'active' : '' }}" data-index="{{ $index }}">
                            <img src="{{ $url }}" alt="Photo {{ $index + 1 }}">
                        </div>
                        @endforeach
                    </div>
                    @endif
                    
                    <div class="canvas-wrapper">
                        <canvas id="photo-canvas"></canvas>
                        <div id="canvas-overlay"></div>
                    </div>
                    
                    <div class="action-buttons">
                        <button id="undo-btn" class="btn btn-outline">
                            <i class="fas fa-undo"></i>
                            <span>Undo</span>
                        </button>
                        <button id="reset-btn" class="btn btn-outline">
                            <i class="fas fa-trash"></i>
                            <span>Reset</span>
                        </button>
                        <button id="download-btn" class="btn btn-primary">
                            <i class="fas fa-download"></i>
                            <span>Download</span>
                        </button>
                        <button id="share-btn" class="btn btn-primary">
                            <i class="fas fa-share-alt"></i>
                            <span>Share</span>
                        </button>
                    </div>
                </div>
                
                <div class="tool-panel">
                    <div class="tool-tabs">
                        <button class="tool-tab active" data-tab="stickers">
                            <i class="fas fa-sticky-note"></i>
                            <span>Stickers</span>
                        </button>
                        <button class="tool-tab" data-tab="text">
                            <i class="fas fa-font"></i>
                            <span>Text</span>
                        </button>
                    </div>
                    
                    <div class="tool-content">
                        <div class="tool-section active" id="stickers-section">
                            <div class="section-header">
                                <h3>Add Stickers</h3>
                                <div class="category-tabs">
                                    <button class="category-tab active" data-category="hearts">Hearts</button>
                                    <button class="category-tab" data-category="cats">Cats</button>
                                    <button class="category-tab" data-category="props">Props</button>
                                    <button class="category-tab" data-category="food">Food</button>
                                    <button class="category-tab" data-category="animals">Animals</button>
                                    <button class="category-tab" data-category="emoji">Emoji</button>
                                </div>
                            </div>
                            <div class="stickers-grid">
                                <!-- Stickers will be loaded here -->
                            </div>
                        </div>
                        
                        <div class="tool-section" id="text-section">
                            <div class="section-header">
                                <h3>Add Text</h3>
                            </div>
                            <div class="text-controls">
                                <input type="text" id="text-input" placeholder="Enter your text">
                                <div class="text-options">
                                    <select id="font-select">
                                        <option value="Arial">Arial</option>
                                        <option value="Comic Sans MS">Comic Sans</option>
                                        <option value="Pacifico" selected>Pacifico</option>
                                        <option value="Dancing Script">Dancing Script</option>
                                        <option value="Indie Flower">Indie Flower</option>
                                        <option value="Amatic SC">Amatic SC</option>
                                        <option value="Caveat">Caveat</option>
                                        <option value="Kalam">Kalam</option>
                                        <option value="Permanent Marker">Marker</option>
                                    </select>
                                    <input type="color" id="text-color" value="#FF6B9E">
                                    <input type="range" id="text-size" min="10" max="72" value="24">
                                    <button id="add-text-btn" class="btn btn-primary btn-small">
                                        <i class="fas fa-plus"></i>
                                        <span>Add Text</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Inside the combined-section div -->
<div class="frame-colors-section">
    <h4>Frame Colors</h4>
    <div class="frame-colors-grid">
        <div class="color-option" data-color="#FFFFFF" style="background-color: #FFFFFF;"></div>
        <div class="color-option" data-color="#FFF5F7" style="background-color: #FFF5F7;"></div>
        <div class="color-option" data-color="#FFF0F5" style="background-color: #FFF0F5;"></div>
        <div class="color-option" data-color="#F8F8FF" style="background-color: #F8F8FF;"></div>
        <div class="color-option" data-color="#F5F5F5" style="background-color: #F5F5F5;"></div>
        <div class="color-option" data-color="#FF6B9E" style="background-color: #FF6B9E;"></div>
        <div class="color-option" data-color="#FFA5C3" style="background-color: #FFA5C3;"></div>
        <div class="color-option" data-color="#FFD1DC" style="background-color: #FFD1DC;"></div>
        <div class="color-option" data-color="#6BD6D3" style="background-color: #6BD6D3;"></div>
        <div class="color-option" data-color="#A5E6E3" style="background-color: #A5E6E3;"></div>
        <div class="color-option" data-color="#FFD166" style="background-color: #FFD166;"></div>
        <div class="color-option" data-color="#FFECB3" style="background-color: #FFECB3;"></div>
        <div class="color-option" data-color="#E8F5E9" style="background-color: #E8F5E9;"></div>
        <div class="color-option" data-color="#C8E6C9" style="background-color: #C8E6C9;"></div>
        <div class="color-option" data-color="#F3E5F5" style="background-color: #F3E5F5;"></div>
        <div class="color-option" data-color="#E1BEE7" style="background-color: #E1BEE7;"></div>
        <div class="color-option" data-color="#D1C4E9" style="background-color: #D1C4E9;"></div>
        <div class="color-option" data-color="#BBDEFB" style="background-color: #BBDEFB;"></div>
        <div class="color-option" data-color="#B3E5FC" style="background-color: #B3E5FC;"></div>
        <div class="color-option" data-color="#B2EBF2" style="background-color: #B2EBF2;"></div>
        <div class="color-option" data-color="#B2DFDB" style="background-color: #B2DFDB;"></div>
        <div class="color-option" data-color="#DCEDC8" style="background-color: #DCEDC8;"></div>
        <div class="color-option" data-color="#F0F4C3" style="background-color: #F0F4C3;"></div>
        <div class="color-option" data-color="#FFECB3" style="background-color: #FFECB3;"></div>
    </div>
</div>
                            
                            <div class="filters-section">
                                <h4>Filters</h4>
                                <div class="filters-grid">
                                    <div class="filter-option" data-filter="normal">
                                        <div class="filter-preview">
                                            <img src="/assets/filters/normal.jpg" alt="Normal">
                                        </div>
                                        <span>Normal</span>
                                    </div>
                                    <div class="filter-option" data-filter="grayscale">
                                        <div class="filter-preview">
                                            <img src="/assets/filters/grayscale.jpg" alt="Grayscale">
                                        </div>
                                        <span>Grayscale</span>
                                    </div>
                                    <div class="filter-option" data-filter="sepia">
                                        <div class="filter-preview">
                                            <img src="/assets/filters/sepia.jpg" alt="Sepia">
                                        </div>
                                        <span>Sepia</span>
                                    </div>
                                    <div class="filter-option" data-filter="bright">
                                        <div class="filter-preview">
                                            <img src="/assets/filters/bright.jpg" alt="Bright">
                                        </div>
                                        <span>Bright</span>
                                    </div>
                                    <div class="filter-option" data-filter="cool">
                                        <div class="filter-preview">
                                            <img src="/assets/filters/cool.jpg" alt="Cool">
                                        </div>
                                        <span>Cool</span>
                                    </div>
                                    <div class="filter-option" data-filter="warm">
                                        <div class="filter-preview">
                                            <img src="/assets/filters/warm.jpg" alt="Warm">
                                        </div>
                                        <span>Warm</span>
                                    </div>
                                    <div class="filter-option" data-filter="sketch">
                                        <div class="filter-preview">
                                            <img src="/assets/filters/sketch.jpg" alt="Sketch">
                                        </div>
                                        <span>Sketch</span>
                                    </div>
                                    <div class="filter-option" data-filter="retro">
                                        <div class="filter-preview">
                                            <img src="/assets/filters/retro.jpg" alt="Retro">
                                        </div>
                                        <span>Retro</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Theme Toggle -->
    <button class="theme-toggle" id="theme-toggle">
        <div class="sun-moon">
            <i class="fas fa-sun"></i>
            <i class="fas fa-moon" style="display: none;"></i>
        </div>
    </button>

    <!-- Share Modal -->
    <div class="modal" id="share-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Share Your Photo</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="share-options">
                    <button class="share-option" data-platform="facebook">
                        <i class="fab fa-facebook"></i>
                        <span>Facebook</span>
                    </button>
                    <button class="share-option" data-platform="twitter">
                        <i class="fab fa-twitter"></i>
                        <span>Twitter</span>
                    </button>
                    <button class="share-option" data-platform="instagram">
                        <i class="fab fa-instagram"></i>
                        <span>Instagram</span>
                    </button>
                    <button class="share-option" id="copy-link-btn">
                        <i class="fas fa-link"></i>
                        <span>Copy Link</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal" id="preview-modal">
        <div class="modal-content" style="max-width: 90%; max-height: 90vh;">
            <div class="modal-header">
                <h3>Photo Preview</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body" style="text-align: center;">
                <img id="modal-preview-image" src="" style="max-width: 100%; max-height: 80vh; object-fit: contain;">
            </div>
        </div>
    </div>

    <script src="/assets/js/customize.js"></script>
</body>
</html>