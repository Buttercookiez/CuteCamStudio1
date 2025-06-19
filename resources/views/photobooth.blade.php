[file name]: photobooth.blade.php
[file content]
<!DOCTYPE html>
<html lang="en" class="light-mode">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>CuteCam | Photobooth</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Pacifico&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="assets/css/photobooth.css">
    <link rel="icon" href="assets/img/logo-icon.png" type="image/png">
</head>
<body>
    <!-- Header -->
    <header class="main-header">
        <div class="container">
            <div class="header-content">
                <a href="/" class="logo">
                    <img src="assets/img/logo-icon.png" alt="CuteCam Logo" class="logo-icon">
                    <span class="logo-text">CuteCam</span>
                </a>
            </div>
        </div>
    </header>

    <main class="photobooth-container">
        <div class="container">
            <!-- Setup Section -->
            <section class="setup-section" id="setup-section">
                <div class="section-header">
                    <h2>Create Your Photo Set</h2>
                    <p>Configure your photobooth experience</p>
                </div>
                
                <div class="setup-options">
                    <div class="option-group">
                        <h3>Number of Photos</h3>
                        <div class="photo-count-selector">
                            <button class="count-option" data-count="1">1</button>
                            <button class="count-option" data-count="2">2</button>
                            <button class="count-option active" data-count="3">3</button>
                            <button class="count-option" data-count="4">4</button>
                        </div>
                    </div>
                    
                    <div class="option-group">
                        <h3>Countdown Timer</h3>
                        <div class="timer-selector">
                            <button class="timer-option" data-timer="0">OFF</button>
                            <button class="timer-option active" data-timer="3">3</button>
                            <button class="timer-option" data-timer="5">5</button>
                            <button class="timer-option" data-timer="10">10</button>
                        </div>
                    </div>
                    
                    <div class="option-group">
                        <h3>Layout Preview</h3>
                        <div class="layout-preview">
                            <div class="preview-slot"></div>
                            <div class="preview-slot"></div>
                            <div class="preview-slot"></div>
                            <div class="preview-slot"></div>
                        </div>
                    </div>
                </div>
                
                <div class="start-capture-wrapper">
                    <button id="start-capture" class="btn btn-primary btn-large">
                        <i class="fas fa-camera"></i>
                        <span>Start Capture</span>
                    </button>
                </div>
            </section>
            
            <!-- Capture Section -->
            <section class="capture-section" id="capture-section" style="display: none;">
                <div class="camera-container">
                    <div class="video-wrapper">
                        <video id="camera-feed" autoplay playsinline></video>
                        <div class="countdown-overlay" id="countdown-overlay"></div>
                        <div class="flash-effect" id="flash-effect"></div>
                    </div>
                    
                    <div class="status-indicator" id="status-indicator">
                        Preparing camera...
                    </div>
                </div>
                
                <div class="photo-slots" id="photo-slots">
                    <!-- Slots will be added dynamically -->
                </div>
                
                <div class="capture-controls">
                    <button id="cancel-capture" class="btn btn-outline">
                        <i class="fas fa-times"></i>
                        <span>Cancel</span>
                    </button>
                </div>
            </section>
            
            <!-- Results Section -->
            <section class="results-section" id="results-section" style="display: none;">
                <div class="section-header">
                    <h2>Your Photos Are Ready!</h2>
                    <p>Review your captured moments</p>
                </div>
                
                <div class="results-grid" id="results-grid">
                    <!-- Captured photos will be added here -->
                </div>
                
                <div class="result-actions">
                    <button id="retake-last" class="btn btn-outline">
                        <i class="fas fa-undo"></i>
                        <span>Retake Last</span>
                    </button>
                    <button id="retake-all" class="btn btn-outline">
                        <i class="fas fa-sync-alt"></i>
                        <span>Retake All</span>
                    </button>
                    <button id="download-all" class="btn btn-primary">
                        <i class="fas fa-download"></i>
                        <span>Download</span>
                    </button>
                    <button id="proceed-customize" class="btn btn-primary">
                        <i class="fas fa-magic"></i>
                        <span>Customize</span>
                    </button>
                </div>
            </section>
        </div>
    </main>

    <!-- Theme Toggle -->
    <button class="theme-toggle" id="theme-toggle">
        <div class="sun-moon">
            <i class="fas fa-sun"></i>
            <i class="fas fa-moon" style="display: none;"></i>
        </div>
    </button>

    <!-- Audio Elements -->
    <audio id="countdown-beep" src="assets/sounds/beep.mp3" preload="auto"></audio>
    <audio id="capture-sound" src="assets/sounds/camera-shutter.mp3" preload="auto"></audio>

    <script src="assets/js/photobooth.js"></script>
</body>
</html>

<!-- Add this JavaScript at the bottom of your blade file -->
@section('scripts')
<script>
document.getElementById('proceed-customize').addEventListener('click', function() {
    // Get the photo data (adjust this based on how you're storing the photo)
    const photoData = document.getElementById('photo-canvas').toDataURL('image/png');
    
    // Send to server
    fetch('/photobooth/customize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': '{{ csrf_token() }}'
        },
        body: JSON.stringify({
            photo: photoData
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = data.redirect_url;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to proceed to customization');
    });
});
</script>
@endsection