document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const canvas = document.getElementById('photo-canvas');
    const ctx = canvas.getContext('2d');
    const canvasOverlay = document.getElementById('canvas-overlay');
    const photoOptions = document.querySelectorAll('.photo-option');
    const toolTabs = document.querySelectorAll('.tool-tab');
    const toolSections = document.querySelectorAll('.tool-section');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const stickersGrid = document.querySelector('.stickers-grid');
    const textInput = document.getElementById('text-input');
    const fontSelect = document.getElementById('font-select');
    const textColor = document.getElementById('text-color');
    const textSize = document.getElementById('text-size');
    const addTextBtn = document.getElementById('add-text-btn');
    const undoBtn = document.getElementById('undo-btn');
    const resetBtn = document.getElementById('reset-btn');
    const downloadBtn = document.getElementById('download-btn');
    const shareBtn = document.getElementById('share-btn');
    const shareModal = document.getElementById('share-modal');
    const modalClose = document.querySelector('.modal-close');
    const shareOptions = document.querySelectorAll('.share-option');
    const copyLinkBtn = document.getElementById('copy-link-btn');
    const colorOptions = document.querySelectorAll('.color-option');
    const filterOptions = document.querySelectorAll('.filter-option');
    const previewModal = document.getElementById('preview-modal');
    const modalPreviewImage = document.getElementById('modal-preview-image');
    const modalCloseButtons = document.querySelectorAll('.modal-close');

    // Constants
    const DESKTOP_CANVAS_PADDING = 10;
    const MOBILE_CANVAS_PADDING = 8;
    const PHOTO_SIZE = 300;
    const PHOTO_GAP = 30;
    const FRAME_PADDING = 40;
    const PROXY_URL = '';

    // State variables
    let capturedPhotos = [];
    let currentPhotoIndex = 0;
    let currentFilter = 'normal';
    let frameColor = '#FFFFFF';
    let activeElements = [];
    let actionHistory = [];
    let isDragging = false;
    let isResizing = false;
    let isRotating = false;
    let dragElement = null;
    let startX, startY, startWidth, startHeight, startAngle;
    let currentRotation = 0;

    // Initialize
    checkThemePreference();
    loadCapturedPhotos();
    loadStickers('hearts');
    initCanvas();
    setupEventListeners();

    // Functions
    function checkThemePreference() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark-mode');
            document.documentElement.classList.remove('light-mode');
            updateThemeIcons(true);
        } else {
            document.documentElement.classList.add('light-mode');
            document.documentElement.classList.remove('dark-mode');
            updateThemeIcons(false);
        }
    }

    function updateThemeIcons(isDark) {
        const sunIcon = themeToggle.querySelector('.fa-sun');
        const moonIcon = themeToggle.querySelector('.fa-moon');
        sunIcon.style.display = isDark ? 'none' : 'block';
        moonIcon.style.display = isDark ? 'block' : 'none';
    }

    function toggleTheme() {
        const isDark = document.documentElement.classList.toggle('dark-mode');
        document.documentElement.classList.toggle('light-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcons(isDark);
    }

    function initCanvas() {
        canvas.width = PHOTO_SIZE + (FRAME_PADDING * 2);
        drawFrame();
    }

    function calculateDimensions(photoCount) {
        const totalHeight = (PHOTO_SIZE * photoCount) + 
                          (PHOTO_GAP * (photoCount - 1)) + 
                          (FRAME_PADDING * 2);
        
        return {
            canvasHeight: totalHeight,
            photoSize: PHOTO_SIZE,
            photoGap: PHOTO_GAP
        };
    }

    async function loadImageSafe(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            
            img.onload = () => resolve(img);
            img.onerror = () => {
                fetch(url, { mode: 'cors' })
                    .then(response => {
                        if (!response.ok) throw new Error('Network response was not ok');
                        return response.blob();
                    })
                    .then(blob => {
                        const img = new Image();
                        img.src = URL.createObjectURL(blob);
                        img.onload = () => resolve(img);
                    })
                    .catch(() => resolve(null));
            };
            
            img.src = PROXY_URL ? PROXY_URL + encodeURIComponent(url) : url + '?t=' + Date.now();
        });
    }

    async function drawFrame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const photoCount = Math.min(4, capturedPhotos.length);
        const { canvasHeight, photoSize, photoGap } = calculateDimensions(photoCount);
        
        // Add paper allowance
        const paperAllowance = 100;
        canvas.height = canvasHeight + paperAllowance;

        // Draw frame background
        ctx.fillStyle = frameColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        let yPos = FRAME_PADDING;
        
        // Draw each photo slot with white border
        for (let i = 0; i < photoCount; i++) {
            // Draw white border background
            ctx.fillStyle = '#FFFFFF';
            const borderSize = 6;
            ctx.fillRect(
                FRAME_PADDING - borderSize, 
                yPos - borderSize, 
                photoSize + (borderSize * 2), 
                photoSize + (borderSize * 2)
            );
            
            // Draw the photo
            const img = await loadImageSafe(capturedPhotos[i]);
            if (img && img.complete && img.naturalHeight !== 0) {
                ctx.save();
                applyFilter();
                
                const imgAspect = img.width / img.height;
                let drawWidth, drawHeight, x, y;
                
                if (imgAspect > 1) {
                    drawWidth = photoSize;
                    drawHeight = drawWidth / imgAspect;
                    x = FRAME_PADDING;
                    y = yPos + (photoSize - drawHeight) / 2;
                } else {
                    drawHeight = photoSize;
                    drawWidth = drawHeight * imgAspect;
                    x = FRAME_PADDING + (photoSize - drawWidth) / 2;
                    y = yPos;
                }
                
                ctx.drawImage(img, x, y, drawWidth, drawHeight);
                ctx.restore();
            }
            
            yPos += photoSize + photoGap;
        }
        
        // Clear the overlay and redraw all active elements
        canvasOverlay.innerHTML = '';
        activeElements.forEach(element => createCanvasElement(element));
    }

   function applyFilter(context = ctx) {
    // Reset filter first
    context.filter = 'none';
    
    // Apply selected filter
    switch(currentFilter) {
        case 'normal': 
            context.filter = 'none'; 
            break;
        case 'grayscale': 
            context.filter = 'grayscale(100%)'; 
            break;
        case 'sepia': 
            context.filter = 'sepia(100%)'; 
            break;
        case 'bright': 
            context.filter = 'brightness(1.2) contrast(1.1)'; 
            break;
        case 'cool': 
            context.filter = 'brightness(1.1) hue-rotate(-20deg) saturate(1.5)'; 
            break;
        case 'warm': 
            context.filter = 'brightness(1.1) hue-rotate(180deg) saturate(1.5)'; 
            break;
        case 'sketch':
            context.filter = 'contrast(1.5) brightness(1.1) saturate(0)';
            break;
        case 'retro':
            context.filter = 'sepia(0.5) contrast(1.25) brightness(1.15) saturate(2)';
            break;
    }
}

    function loadCapturedPhotos() {
        capturedPhotos = Array.from(photoOptions).map(option => option.querySelector('img').src);
        
        photoOptions.forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.photo-option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                currentPhotoIndex = parseInt(option.dataset.index);
                drawFrame();
            });
        });
    }

    function loadStickers(category) {
        const stickers = {
            hearts: [
                '/assets/stickers/heart1.png', '/assets/stickers/heart2.png',
                '/assets/stickers/heart3.png', '/assets/stickers/heart4.png',
                '/assets/stickers/heart5.png', '/assets/stickers/heart6.png',
                '/assets/stickers/heart7.png', '/assets/stickers/heart8.png',
                '/assets/stickers/heart9.png', '/assets/stickers/heart10.png'
            ],
            cats: [
                '/assets/stickers/cat1.png', '/assets/stickers/cat2.png',
                '/assets/stickers/cat3.png', '/assets/stickers/cat4.png',
                '/assets/stickers/cat5.png', '/assets/stickers/cat6.png',
                '/assets/stickers/cat7.png', '/assets/stickers/cat8.png',
                '/assets/stickers/cat9.png', '/assets/stickers/cat10.png'
            ],
            props: [
                '/assets/stickers/prop1.png', '/assets/stickers/prop2.png',
                '/assets/stickers/prop3.png', '/assets/stickers/prop4.png',
                '/assets/stickers/prop5.png', '/assets/stickers/prop6.png',
                '/assets/stickers/prop7.png', '/assets/stickers/prop8.png',
                '/assets/stickers/prop9.png', '/assets/stickers/prop10.png'
            ],
            food: [
                '/assets/stickers/food1.png', '/assets/stickers/food2.png',
                '/assets/stickers/food3.png', '/assets/stickers/food4.png',
                '/assets/stickers/food5.png', '/assets/stickers/food6.png',
                '/assets/stickers/food7.png', '/assets/stickers/food8.png',
                '/assets/stickers/food9.png', '/assets/stickers/food10.png'
            ],
            animals: [
                '/assets/stickers/animal1.png', '/assets/stickers/animal2.png',
                '/assets/stickers/animal3.png', '/assets/stickers/animal4.png',
                '/assets/stickers/animal5.png', '/assets/stickers/animal6.png',
                '/assets/stickers/animal7.png', '/assets/stickers/animal8.png',
                '/assets/stickers/animal9.png', '/assets/stickers/animal10.png'
            ],
            emoji: [
                '/assets/stickers/emoji1.png', '/assets/stickers/emoji2.png',
                '/assets/stickers/emoji3.png', '/assets/stickers/emoji4.png',
                '/assets/stickers/emoji5.png', '/assets/stickers/emoji6.png'
            ]
        };

        stickersGrid.innerHTML = '';
        
        stickers[category].forEach(sticker => {
            const stickerElement = document.createElement('div');
            stickerElement.className = 'sticker-option';
            
            const img = document.createElement('img');
            img.src = sticker;
            img.alt = 'Sticker';
            img.loading = 'lazy';
            
            stickerElement.appendChild(img);
            stickerElement.dataset.src = sticker;
            
            // Add smooth hover effect
            stickerElement.addEventListener('mouseenter', () => {
                stickerElement.style.transform = 'scale(1.1)';
                stickerElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            });
            
            stickerElement.addEventListener('mouseleave', () => {
                stickerElement.style.transform = 'scale(1)';
                stickerElement.style.boxShadow = 'none';
            });
            
            stickerElement.addEventListener('click', () => {
                addStickerToCanvas(sticker);
            });
            
            stickersGrid.appendChild(stickerElement);
        });
    }

    function addStickerToCanvas(src) {
        const sticker = {
            type: 'sticker',
            src: src,
            x: canvas.width / 2 - 50,
            y: canvas.height / 2 - 50,
            width: 100,
            height: 100,
            rotation: 0,
            id: Date.now()
        };
        
        activeElements.push(sticker);
        saveToHistory();
        createCanvasElement(sticker);
    }

    function addTextToCanvas() {
        if (!textInput.value.trim()) {
            textInput.focus();
            return;
        }
        
        const text = {
            type: 'text',
            content: textInput.value,
            font: fontSelect.value,
            color: textColor.value,
            size: parseInt(textSize.value),
            x: canvas.width / 2,
            y: canvas.height / 2,
            width: 150,
            height: 50,
            rotation: 0,
            id: Date.now()
        };
        
        activeElements.push(text);
        saveToHistory();
        createCanvasElement(text);
        
        textInput.value = '';
        textInput.focus();
    }

    function createCanvasElement(element) {
    const elementDiv = document.createElement('div');
    elementDiv.className = 'canvas-element';
    elementDiv.dataset.id = element.id;
    
    // Adjust position calculation to account for border offsets
    elementDiv.style.left = `${element.x}px`;
    elementDiv.style.top = `${element.y}px`;
    elementDiv.style.width = `${element.width}px`;
    elementDiv.style.height = `${element.height}px`;
    elementDiv.style.transform = `rotate(${element.rotation}deg)`;
    
    if (element.type === 'sticker') {
        elementDiv.innerHTML = `
            <img src="${element.src}" style="width:100%; height:100%; object-fit:contain;">
            <div class="delete-btn">&times;</div>
            <div class="resize-handle"></div>
            <div class="rotate-handle"><i class="fas fa-sync-alt"></i></div>
        `;
    } else if (element.type === 'text') {
        elementDiv.innerHTML = `
            <div style="width:100%; height:100%; font-family:${element.font}; 
                color:${element.color}; font-size:${element.size}px; display:flex;
                align-items:center; justify-content:center; transform:rotate(${element.rotation}deg);">
                ${element.content}
            </div>
            <div class="delete-btn">&times;</div>
            <div class="resize-handle"></div>
            <div class="rotate-handle"><i class="fas fa-sync-alt"></i></div>
        `;
    }

    // Initially hide controls
    const deleteBtn = elementDiv.querySelector('.delete-btn');
    const resizeHandle = elementDiv.querySelector('.resize-handle');
    const rotateHandle = elementDiv.querySelector('.rotate-handle');
    
    deleteBtn.style.display = 'none';
    resizeHandle.style.display = 'none';
    rotateHandle.style.display = 'none';
    
    canvasOverlay.appendChild(elementDiv);
    setupElementInteractions(elementDiv, element);
}

    function setupElementInteractions(element, data) {
        const deleteBtn = element.querySelector('.delete-btn');
        const resizeHandle = element.querySelector('.resize-handle');
        const rotateHandle = element.querySelector('.rotate-handle');
        
        // Delete button event listeners
        deleteBtn.addEventListener('click', handleDelete);
        deleteBtn.addEventListener('touchend', handleDelete);
        
        function handleDelete(e) {
            e.stopPropagation();
            e.preventDefault();
            removeElement(data.id);
        }
        
        // Show controls when element is clicked/tapped
        element.addEventListener('click', handleElementClick);
        element.addEventListener('touchstart', handleElementClick, { passive: false });
        
        function handleElementClick(e) {
            if (e.type === 'touchstart') {
                e.preventDefault();
            }
            
            if (e.target !== deleteBtn && !e.target.closest('.delete-btn')) {
                document.querySelectorAll('.resize-handle, .rotate-handle').forEach(control => {
                    control.style.display = 'none';
                });
                document.querySelectorAll('.canvas-element').forEach(el => {
                    el.classList.remove('active');
                });
                
                resizeHandle.style.display = 'flex';
                rotateHandle.style.display = 'flex';
                element.classList.add('active');
                deleteBtn.style.display = 'flex';
            }
            e.stopPropagation();
        }
        
        // Hide controls when clicking/touching outside
        document.addEventListener('click', hideControls);
        document.addEventListener('touchstart', hideControls, { passive: false });
        
        function hideControls(e) {
            if (!element.contains(e.target)) {
                resizeHandle.style.display = 'none';
                rotateHandle.style.display = 'none';
                element.classList.remove('active');
                deleteBtn.style.display = 'none';
            }
        }
        
        // Resize handle interaction
        resizeHandle.addEventListener('mousedown', startResize);
        resizeHandle.addEventListener('touchstart', startResize, { passive: false });
        
        function startResize(e) {
            e.stopPropagation();
            e.preventDefault();
            isResizing = true;
            dragElement = element;
            
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            
            startX = clientX;
            startY = clientY;
            startWidth = parseInt(element.style.width, 10);
            startHeight = parseInt(element.style.height, 10);
        }
        
        // Rotate handle interaction
        rotateHandle.addEventListener('mousedown', startRotate);
        rotateHandle.addEventListener('touchstart', startRotate, { passive: false });
        
        function startRotate(e) {
            e.stopPropagation();
            e.preventDefault();
            isRotating = true;
            dragElement = element;
            
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            
            startAngle = Math.atan2(clientY - centerY, clientX - centerX) * 180 / Math.PI;
            
            const transform = element.style.transform;
            const match = transform.match(/rotate\(([-+]?\d*\.?\d+)deg\)/);
            startRotation = match ? parseFloat(match[1]) : 0;
            
            element.style.transition = 'transform 0.05s ease-out';
        }
        
        // Drag interaction
        element.addEventListener('mousedown', startDrag);
        element.addEventListener('touchstart', startDrag, { passive: false });
        
        function startDrag(e) {
            if (e.target === deleteBtn || e.target === resizeHandle || e.target === rotateHandle || 
                e.target.closest('.delete-btn') || e.target.closest('.resize-handle') || e.target.closest('.rotate-handle')) {
                return;
            }
            
            e.preventDefault();
            isDragging = true;
            dragElement = element;
            
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            
            startX = clientX - element.offsetLeft;
            startY = clientY - element.offsetTop;
            element.style.zIndex = 1000;
        }
    }

    function handleMouseMove(e) {
        if (!isDragging && !isResizing && !isRotating) return;
        
        if (e.type === 'touchmove') {
            e.preventDefault();
        }
        
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        if (!clientX || !clientY) return;
        
        if (isDragging && dragElement) {
            const x = clientX - startX;
            const y = clientY - startY;
            
            dragElement.style.left = `${x}px`;
            dragElement.style.top = `${y}px`;
            
            const id = parseInt(dragElement.dataset.id);
            const element = activeElements.find(el => el.id === id);
            if (element) {
                element.x = x;
                element.y = y;
            }
        }
        
        if (isResizing && dragElement) {
            const width = Math.max(30, startWidth + (clientX - startX));
            const height = Math.max(30, startHeight + (clientY - startY));
            
            dragElement.style.width = `${width}px`;
            dragElement.style.height = `${height}px`;
            
            const id = parseInt(dragElement.dataset.id);
            const element = activeElements.find(el => el.id === id);
            if (element) {
                element.width = width;
                element.height = height;
            }
        }
        
        if (isRotating && dragElement) {
            const rect = dragElement.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const angle = Math.atan2(clientY - centerY, clientX - centerX) * 180 / Math.PI;
            
            const rotation = startRotation + (angle - startAngle);
            currentRotation = rotation;
            
            dragElement.style.transform = `rotate(${rotation}deg)`;
            
            const id = parseInt(dragElement.dataset.id);
            const element = activeElements.find(el => el.id === id);
            if (element) {
                element.rotation = rotation;
            }
        }
    }

    function handleMouseUp() {
        if (isDragging || isResizing || isRotating) {
            if (dragElement) {
                dragElement.style.transition = 'none';
            }
            saveToHistory();
        }
        isDragging = false;
        isResizing = false;
        isRotating = false;
        dragElement = null;
    }

    function removeElement(id) {
        activeElements = activeElements.filter(el => el.id !== id);
        const element = document.querySelector(`.canvas-element[data-id="${id}"]`);
        if (element) {
            element.remove();
        }
        saveToHistory();
    }

    function saveToHistory() {
        actionHistory.push({
            elements: JSON.parse(JSON.stringify(activeElements)),
            frameColor: frameColor,
            filter: currentFilter
        });
    }

    function undoAction() {
        if (actionHistory.length > 0) {
            actionHistory.pop();
            if (actionHistory.length > 0) {
                const prevState = actionHistory[actionHistory.length - 1];
                activeElements = JSON.parse(JSON.stringify(prevState.elements));
                frameColor = prevState.frameColor;
                currentFilter = prevState.filter;
                updateColorSelection();
                updateFilterSelection();
            } else {
                activeElements = [];
                frameColor = '#FFFFFF';
                currentFilter = 'normal';
                updateColorSelection();
                updateFilterSelection();
            }
            
            canvasOverlay.innerHTML = '';
            activeElements.forEach(element => createCanvasElement(element));
            drawFrame();
        }
    }

    function updateColorSelection() {
        colorOptions.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.color === frameColor) {
                option.classList.add('active');
            }
        });
    }

    function updateFilterSelection() {
        filterOptions.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.filter === currentFilter) {
                option.classList.add('active');
            }
        });
    }

    function resetCanvas() {
        if (confirm('Are you sure you want to reset all changes?')) {
            activeElements = [];
            frameColor = '#FFFFFF';
            currentFilter = 'normal';
            canvasOverlay.innerHTML = '';
            actionHistory = [];
            updateColorSelection();
            updateFilterSelection();
            drawFrame();
        }
    }

    async function showPreviewModal() {
    const tempCanvas = document.createElement('canvas');
    const borderSize = 5;
    const photoBorderSize = 5;
    tempCanvas.width = canvas.width + (borderSize * 2);
    tempCanvas.height = canvas.height + (borderSize * 2);
    const tempCtx = tempCanvas.getContext('2d');
    
    tempCtx.fillStyle = '#FFFFFF';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    tempCtx.fillStyle = frameColor;
    tempCtx.fillRect(
        borderSize, 
        borderSize, 
        tempCanvas.width - (borderSize * 2), 
        tempCanvas.height - (borderSize * 2)
    );

    const photoCount = Math.min(4, capturedPhotos.length);
    const { photoSize, photoGap } = calculateDimensions(photoCount);
    let yPos = FRAME_PADDING + borderSize;

    for (let i = 0; i < photoCount; i++) {
        tempCtx.fillStyle = '#FFFFFF';
        tempCtx.fillRect(
            FRAME_PADDING + borderSize - photoBorderSize, 
            yPos - photoBorderSize, 
            photoSize + (photoBorderSize * 2), 
            photoSize + (photoBorderSize * 2)
        );
        
        const img = await loadImageSafe(capturedPhotos[i]);
        if (img && img.complete && img.naturalHeight !== 0) {
            tempCtx.save();
            applyFilter(tempCtx);
            
            const imgAspect = img.width / img.height;
            let drawWidth, drawHeight, x, y;
            
            if (imgAspect > 1) {
                drawWidth = photoSize;
                drawHeight = drawWidth / imgAspect;
                x = FRAME_PADDING + borderSize;
                y = yPos + (photoSize - drawHeight) / 2;
            } else {
                drawHeight = photoSize;
                drawWidth = drawHeight * imgAspect;
                x = FRAME_PADDING + borderSize + (photoSize - drawWidth) / 2;
                y = yPos;
            }
            
            tempCtx.drawImage(img, x, y, drawWidth, drawHeight);
            tempCtx.restore();
        }
        yPos += photoSize + photoGap;
    }
    
    // Draw all active elements
    for (const element of activeElements) {
        if (element.type === 'sticker') {
            const img = await loadImageSafe(element.src);
            if (img) {
                tempCtx.save();
                // Calculate the center point of the sticker
                const centerX = element.x + element.width/2 + borderSize;
                const centerY = element.y + element.height/2 + borderSize;
                
                tempCtx.translate(centerX, centerY);
                tempCtx.rotate(element.rotation * Math.PI / 180);
                
                // Maintain aspect ratio when drawing
                const stickerAspect = img.width / img.height;
                let drawWidth, drawHeight;
                
                if (stickerAspect > 1) {
                    drawWidth = element.width;
                    drawHeight = drawWidth / stickerAspect;
                } else {
                    drawHeight = element.height;
                    drawWidth = drawHeight * stickerAspect;
                }
                
                tempCtx.drawImage(
                    img, 
                    -drawWidth/2, 
                    -drawHeight/2, 
                    drawWidth, 
                    drawHeight
                );
                tempCtx.restore();
            }
        } else if (element.type === 'text') {
            tempCtx.save();
            tempCtx.translate(
                element.x + element.width/2 + borderSize, 
                element.y + element.height/2 + borderSize
            );
            tempCtx.rotate(element.rotation * Math.PI / 180);
            tempCtx.font = `${element.size}px ${element.font}`;
            tempCtx.fillStyle = element.color;
            tempCtx.textAlign = 'center';
            tempCtx.textBaseline = 'middle';
            tempCtx.fillText(element.content, 0, 0);
            tempCtx.restore();
        }
    }
    
    modalPreviewImage.src = tempCanvas.toDataURL('image/png');
    previewModal.classList.add('active');
}

    async function downloadCanvas() {
    try {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = '<div>Preparing download...</div>';
        document.body.appendChild(loadingOverlay);

        const tempCanvas = document.createElement('canvas');
        const borderSize = 5;
        const photoBorderSize = 5;
        tempCanvas.width = canvas.width + (borderSize * 2);
        tempCanvas.height = canvas.height + (borderSize * 2);
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCtx.fillStyle = '#FFFFFF';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        tempCtx.fillStyle = frameColor;
        tempCtx.fillRect(
            borderSize, 
            borderSize, 
            tempCanvas.width - (borderSize * 2), 
            tempCanvas.height - (borderSize * 2)
        );

        const photoCount = Math.min(4, capturedPhotos.length);
        const { photoSize, photoGap } = calculateDimensions(photoCount);
        let yPos = FRAME_PADDING + borderSize;

        for (let i = 0; i < photoCount; i++) {
            tempCtx.fillStyle = '#FFFFFF';
            tempCtx.fillRect(
                FRAME_PADDING + borderSize - photoBorderSize, 
                yPos - photoBorderSize, 
                photoSize + (photoBorderSize * 2), 
                photoSize + (photoBorderSize * 2)
            );
            
            const img = await loadImageSafe(capturedPhotos[i]);
            if (!img) continue;

            tempCtx.save();
            applyFilter(tempCtx);
            
            const imgAspect = img.width / img.height;
            let drawWidth, drawHeight, x, y;
            
            if (imgAspect > 1) {
                drawWidth = photoSize;
                drawHeight = drawWidth / imgAspect;
                x = FRAME_PADDING + borderSize;
                y = yPos + (photoSize - drawHeight) / 2;
            } else {
                drawHeight = photoSize;
                drawWidth = drawHeight * imgAspect;
                x = FRAME_PADDING + borderSize + (photoSize - drawWidth) / 2;
                y = yPos;
            }
            
            tempCtx.drawImage(img, x, y, drawWidth, drawHeight);
            tempCtx.restore();
            
            yPos += photoSize + photoGap;
        }

        // Draw all active elements
        for (const element of activeElements) {
            if (element.type === 'sticker') {
                const img = await loadImageSafe(element.src);
                if (img) {
                    tempCtx.save();
                    // Calculate the center point of the sticker
                    const centerX = element.x + element.width/2 + borderSize;
                    const centerY = element.y + element.height/2 + borderSize;
                    
                    tempCtx.translate(centerX, centerY);
                    tempCtx.rotate(element.rotation * Math.PI / 180);
                    
                    // Maintain aspect ratio when drawing
                    const stickerAspect = img.width / img.height;
                    let drawWidth, drawHeight;
                    
                    if (stickerAspect > 1) {
                        drawWidth = element.width;
                        drawHeight = drawWidth / stickerAspect;
                    } else {
                        drawHeight = element.height;
                        drawWidth = drawHeight * stickerAspect;
                    }
                    
                    tempCtx.drawImage(
                        img, 
                        -drawWidth/2, 
                        -drawHeight/2, 
                        drawWidth, 
                        drawHeight
                    );
                    tempCtx.restore();
                }
            } else if (element.type === 'text') {
                tempCtx.save();
                tempCtx.translate(
                    element.x + element.width/2 + borderSize, 
                    element.y + element.height/2 + borderSize
                );
                tempCtx.rotate(element.rotation * Math.PI / 180);
                tempCtx.font = `${element.size}px ${element.font}`;
                tempCtx.fillStyle = element.color;
                tempCtx.textAlign = 'center';
                tempCtx.textBaseline = 'middle';
                tempCtx.fillText(element.content, 0, 0);
                tempCtx.restore();
            }
        }

        const link = document.createElement('a');
        link.download = 'cute-cam-' + new Date().toISOString().slice(0, 10) + '.png';
        link.href = tempCanvas.toDataURL('image/png');
        link.click();

    } catch (error) {
        console.error('Download failed:', error);
        alert('Download failed. Please try again.');
    } finally {
        document.querySelector('.loading-overlay')?.remove();
    }
}

    function openShareModal() {
        shareModal.classList.add('active');
    }

    function closeShareModal() {
        shareModal.classList.remove('active');
    }

    function shareToPlatform(platform) {
        alert(`Sharing to ${platform} would be implemented here`);
        closeShareModal();
    }

    function copyShareLink() {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                const originalText = copyLinkBtn.querySelector('span').textContent;
                copyLinkBtn.querySelector('span').textContent = 'Copied!';
                setTimeout(() => {
                    copyLinkBtn.querySelector('span').textContent = originalText;
                }, 2000);
            })
            .catch(err => console.error('Could not copy link:', err));
    }

    function setupEventListeners() {
        themeToggle.addEventListener('click', toggleTheme);
        
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                frameColor = option.dataset.color;
                saveToHistory();
                updateColorSelection();
                drawFrame();
            });
        });
        
        filterOptions.forEach(option => {
            option.addEventListener('click', () => {
                currentFilter = option.dataset.filter;
                saveToHistory();
                updateFilterSelection();
                drawFrame();
            });
        });
        
        toolTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                toolTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                toolSections.forEach(section => section.classList.remove('active'));
                document.getElementById(`${tab.dataset.tab}-section`).classList.add('active');
            });
        });
        
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                categoryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                loadStickers(tab.dataset.category);
            });
        });
        
        addTextBtn.addEventListener('click', addTextToCanvas);
        
        textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTextToCanvas();
            }
        });
        
        undoBtn.addEventListener('click', undoAction);
        resetBtn.addEventListener('click', resetCanvas);
        downloadBtn.addEventListener('click', downloadCanvas);
        shareBtn.addEventListener('click', openShareModal);
        
        modalCloseButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                previewModal.classList.remove('active');
                shareModal.classList.remove('active');
            });
        });
        
        canvas.addEventListener('click', showPreviewModal);
        document.querySelector('.canvas-wrapper').addEventListener('click', showPreviewModal);
        
        window.addEventListener('click', (e) => {
            if (e.target === previewModal || e.target === shareModal) {
                previewModal.classList.remove('active');
                shareModal.classList.remove('active');
            }
        });
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchmove', handleMouseMove, { passive: false });
        
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchend', handleMouseUp);
        
        document.querySelectorAll('.canvas-element, .resize-handle, .rotate-handle').forEach(el => {
            el.addEventListener('touchmove', (e) => {
                if (isDragging || isResizing || isRotating) {
                    e.preventDefault();
                }
            }, { passive: false });
        });
    }
});