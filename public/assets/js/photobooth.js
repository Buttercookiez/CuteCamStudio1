document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const setupSection = document.getElementById('setup-section');
    const captureSection = document.getElementById('capture-section');
    const resultsSection = document.getElementById('results-section');
    const startCaptureBtn = document.getElementById('start-capture');
    const cancelCaptureBtn = document.getElementById('cancel-capture');
    const retakeLastBtn = document.getElementById('retake-last');
    const retakeAllBtn = document.getElementById('retake-all');
    const downloadAllBtn = document.getElementById('download-all');
    const proceedCustomizeBtn = document.getElementById('proceed-customize');
    const cameraFeed = document.getElementById('camera-feed');
    const countdownOverlay = document.getElementById('countdown-overlay');
    const flashEffect = document.getElementById('flash-effect');
    const statusIndicator = document.getElementById('status-indicator');
    const photoSlots = document.getElementById('photo-slots');
    const resultsGrid = document.getElementById('results-grid');
    const countdownBeep = document.getElementById('countdown-beep');
    const captureSound = document.getElementById('capture-sound');
    const countOptions = document.querySelectorAll('.count-option');
    const timerOptions = document.querySelectorAll('.timer-option');
    const previewSlots = document.querySelectorAll('.preview-slot');
    
    // State variables
    let stream = null;
    let selectedCount = 3;
    let selectedTimer = 3;
    let currentPhoto = 0;
    let capturedPhotos = [];
    let countdownInterval = null;
    let isCapturing = false;
    
    // Initialize
    checkThemePreference();
    setupEventListeners();
    updateLayoutPreview();
    
    function storageAvailable() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch(e) {
            return false;
        }
    }

    if (!storageAvailable()) {
        console.warn('Local storage not available - theme preferences won\'t persist');
    }
    
    // Functions
    function checkThemePreference() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark-mode');
            document.documentElement.classList.remove('light-mode');
        } else {
            document.documentElement.classList.add('light-mode');
            document.documentElement.classList.remove('dark-mode');
        }
    }
    
    function toggleTheme() {
        const isDark = document.documentElement.classList.toggle('dark-mode');
        document.documentElement.classList.toggle('light-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Toggle icons
        const sunIcon = themeToggle.querySelector('.fa-sun');
        const moonIcon = themeToggle.querySelector('.fa-moon');
        sunIcon.style.display = isDark ? 'none' : 'block';
        moonIcon.style.display = isDark ? 'block' : 'none';
    }
    
    function updateLayoutPreview() {
        // Hide all preview slots first
        previewSlots.forEach(slot => {
            slot.style.display = 'none';
        });
        
        // Show the selected number of slots
        for (let i = 0; i < selectedCount; i++) {
            if (previewSlots[i]) {
                previewSlots[i].style.display = 'block';
            }
        }
    }
    
    function setupEventListeners() {
        // Theme toggle
        themeToggle.addEventListener('click', toggleTheme);
        
        // Count options
        countOptions.forEach(option => {
            option.addEventListener('click', () => {
                countOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                selectedCount = parseInt(option.dataset.count);
                updateLayoutPreview();
            });
        });
        
        // Timer options
        timerOptions.forEach(option => {
            option.addEventListener('click', () => {
                timerOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                selectedTimer = parseInt(option.dataset.timer);
            });
        });
        
        // Start capture
        startCaptureBtn.addEventListener('click', startCaptureProcess);
        
        // Cancel capture
        cancelCaptureBtn.addEventListener('click', cancelCapture);
        
        // Retake buttons
        retakeLastBtn.addEventListener('click', retakeLastPhoto);
        retakeAllBtn.addEventListener('click', retakeAllPhotos);
        
        // Download all
        downloadAllBtn.addEventListener('click', downloadAllPhotos);
        
        // Proceed to customize
        proceedCustomizeBtn.addEventListener('click', proceedToCustomize);
    }
    
    async function startCaptureProcess() {
        try {
            // Initialize camera
            statusIndicator.textContent = 'Initializing camera...';
            setupSection.style.display = 'none';
            captureSection.style.display = 'block';
            
            // Create photo slots
            createPhotoSlots();
            
            // Start camera
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 1280 },
                    facingMode: 'user'
                },
                audio: false
            });
            
            cameraFeed.srcObject = stream;
            statusIndicator.textContent = 'Ready to capture';
            
            // Start the capture sequence
            startCaptureSequence();
        } catch (error) {
            console.error('Error accessing camera:', error);
            statusIndicator.textContent = 'Error accessing camera. Please check permissions.';
            
            // Show setup section again
            setupSection.style.display = 'block';
            captureSection.style.display = 'none';
        }
    }
    
    function createPhotoSlots() {
        photoSlots.innerHTML = '';
        
        for (let i = 0; i < selectedCount; i++) {
            const slot = document.createElement('div');
            slot.className = 'photo-slot';
            slot.dataset.index = i;
            photoSlots.appendChild(slot);
        }
    }
    
    function startCaptureSequence() {
        if (isCapturing) return;
        
        isCapturing = true;
        currentPhoto = 0;
        capturedPhotos = [];
        
        // Start with the first photo
        captureNextPhoto();
    }
    
    function captureNextPhoto() {
        if (currentPhoto >= selectedCount) {
            // All photos captured
            finishCapture();
            return;
        }
        
        statusIndicator.textContent = `Photo ${currentPhoto + 1} of ${selectedCount}`;
        
        if (selectedTimer > 0) {
            // Start countdown
            startCountdown();
        } else {
            // Capture immediately
            capturePhoto();
        }
    }
    
    function startCountdown() {
        let count = selectedTimer;
        countdownOverlay.textContent = count;
        countdownOverlay.style.opacity = '1';
        
        // Play initial beep
        if (countdownBeep) {
            countdownBeep.currentTime = 0;
            countdownBeep.play();
        }
        
        countdownInterval = setInterval(() => {
            count--;
            
            if (count > 0) {
                countdownOverlay.textContent = count;
                
                // Play beep sound
                if (countdownBeep) {
                    countdownBeep.currentTime = 0;
                    countdownBeep.play();
                }
            } else {
                // Countdown finished
                clearInterval(countdownInterval);
                countdownOverlay.style.opacity = '0';
                capturePhoto();
            }
        }, 1000);
    }
    
    function capturePhoto() {
        // Create canvas
        const canvas = document.createElement('canvas');
        const videoWidth = cameraFeed.videoWidth;
        const videoHeight = cameraFeed.videoHeight;
        
        // Make it square by using the smaller dimension
        const size = Math.min(videoWidth, videoHeight);
        canvas.width = size;
        canvas.height = size;
        
        // Draw video frame to canvas
        const ctx = canvas.getContext('2d');
        
        // Calculate offsets to center the square
        const offsetX = (videoWidth - size) / 2;
        const offsetY = (videoHeight - size) / 2;
        
        ctx.drawImage(cameraFeed, offsetX, offsetY, size, size, 0, 0, size, size);
        
        // Get image data URL
        const photoData = canvas.toDataURL('image/png');
        capturedPhotos.push(photoData);
        
        // Update photo slot
        updatePhotoSlot(currentPhoto, photoData);
        
        // Play capture sound
        if (captureSound) {
            captureSound.currentTime = 0;
            captureSound.play();
        }
        
        // Flash effect
        flashEffect.classList.add('flash');
        setTimeout(() => {
            flashEffect.classList.remove('flash');
        }, 300);
        
        // Move to next photo
        currentPhoto++;
        
        // Small delay before next capture
        setTimeout(() => {
            captureNextPhoto();
        }, 500);
    }
    
    function updatePhotoSlot(index, photoData) {
        const slot = document.querySelector(`.photo-slot[data-index="${index}"]`);
        if (slot) {
            slot.classList.add('filled');
            slot.innerHTML = `<img src="${photoData}" alt="Captured photo ${index + 1}">`;
        }
    }
    
    function finishCapture() {
        isCapturing = false;
        statusIndicator.textContent = 'Capture complete!';
        
        // Stop camera
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        
        // Show results
        captureSection.style.display = 'none';
        resultsSection.style.display = 'block';
        
        // Display results
        displayResults();
    }
    
    function displayResults() {
        resultsGrid.innerHTML = '';
        
        capturedPhotos.forEach((photo, index) => {
            const photoElement = document.createElement('div');
            photoElement.className = 'result-photo';
            photoElement.innerHTML = `<img src="${photo}" alt="Captured photo ${index + 1}">`;
            resultsGrid.appendChild(photoElement);
        });
    }
    
    function cancelCapture() {
        // Stop any ongoing countdown
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownOverlay.style.opacity = '0';
        }
        
        // Stop camera
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        
        // Reset state
        isCapturing = false;
        currentPhoto = 0;
        capturedPhotos = [];
        
        // Show setup section
        setupSection.style.display = 'block';
        captureSection.style.display = 'none';
    }
    
    function retakeLastPhoto() {
        if (capturedPhotos.length === 0) return;
        
        // Remove last photo
        capturedPhotos.pop();
        currentPhoto--;
        
        // Reset UI
        resultsSection.style.display = 'none';
        captureSection.style.display = 'block';
        
        // Clear the last slot
        const slots = document.querySelectorAll('.photo-slot');
        if (slots[currentPhoto]) {
            slots[currentPhoto].classList.remove('filled');
            slots[currentPhoto].innerHTML = '';
        }
        
        // Start camera again
        startCaptureProcess();
    }
    
    function retakeAllPhotos() {
        // Reset all state
        capturedPhotos = [];
        currentPhoto = 0;
        
        // Reset UI
        resultsSection.style.display = 'none';
        captureSection.style.display = 'block';
        
        // Clear all slots
        document.querySelectorAll('.photo-slot').forEach(slot => {
            slot.classList.remove('filled');
            slot.innerHTML = '';
        });
        
        // Start camera again
        startCaptureProcess();
    }
    
    function downloadAllPhotos() {
        capturedPhotos.forEach((photo, index) => {
            const link = document.createElement('a');
            link.href = photo;
            link.download = `cute-cam-photo-${index + 1}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
    
    function proceedToCustomize() {
        if (capturedPhotos.length === 0) {
            alert('No photos to customize!');
            return;
        }

        // Show loading state
        proceedCustomizeBtn.disabled = true;
        proceedCustomizeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        // Send all photos to the server
        const promises = capturedPhotos.map((photo, index) => {
            return fetch('/photobooth/capture', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    photo: photo,
                    photo_index: index,
                    photo_count: capturedPhotos.length
                })
            });
        });

        Promise.all(promises)
            .then(responses => Promise.all(responses.map(r => r.json())))
            .then(data => {
                if (data[0].success && data[0].customize_url) {
                    window.location.href = data[0].customize_url;
                } else {
                    throw new Error(data[0].message || 'Invalid response from server');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to proceed to customization: ' + error.message);
            })
            .finally(() => {
                proceedCustomizeBtn.disabled = false;
                proceedCustomizeBtn.innerHTML = '<i class="fas fa-magic"></i><span>Customize</span>';
            });
    }
});

