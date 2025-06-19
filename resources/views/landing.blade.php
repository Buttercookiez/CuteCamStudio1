<!DOCTYPE html>
<html lang="en" class="light-mode">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CuteCam | Playful Photo Experiences</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Pacifico&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="assets/css/landing.css">
    <link rel="icon" href="assets/img/logo-icon.png" type="image/png">
</head>
<body>
    <!-- Animated Background Elements -->
    <div class="bg-elements">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
    </div>

    <!-- Header -->
    <header class="main-header">
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <img src="assets/img/logo-icon.png" alt="CuteCam Logo" class="logo-icon">
                    <span class="logo-text">CuteCam</span>
                </div>
                <nav class="main-nav">
                    <ul>
                        <li><a href="#features" class="nav-link">Features</a></li>
                        <li><a href="#how-it-works" class="nav-link">How It Works</a></li>
                        <li><a href="#testimonials" class="nav-link">Testimonials</a></li>
                        <li><a href="/photobooth" class="btn btn-small btn-primary">Try Now!</a></li>
                    </ul>
                </nav>
                <button class="mobile-menu-btn" id="mobile-menu-btn">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
    </header>

    <!-- Mobile Menu -->
    <div class="mobile-menu" id="mobile-menu">
        <nav>
            <ul>
                <li><a href="#features" class="nav-link">Features</a></li>
                <li><a href="#how-it-works" class="nav-link">How It Works</a></li>
                <li><a href="#testimonials" class="nav-link">Testimonials</a></li>
                <li><a href="/photobooth" class="btn btn-small btn-primary">Try Now!</a></li>
            </ul>
        </nav>
    </div>

 <!-- Hero Section -->
<section class="hero-section">
    <div class="container">
        <div class="hero-content">
            <div class="hero-text">
                <h1 class="hero-title">
                    <span class="title-line">Capture Life's</span>
                    <span class="title-line highlight">Cute Moments</span>
                </h1>
                <p class="hero-subtitle">Transform ordinary photos into playful memories with our magical photo booth experience</p>
                <div class="hero-cta">
                    <a href="/photobooth" class="btn btn-primary btn-large">
                        <span>Start Creating</span>
                        <i class="fas fa-arrow-right"></i>
                    </a>
                    <a href="#how-it-works" class="btn btn-link">
                        <i class="fas fa-play-circle"></i>
                        <span>See How It Works</span>
                    </a>
                </div>
            </div>
            <div class="hero-image">
                <div class="landscape-mockup">
                    <div class="mockup-screen">
                      
                        
                        <!-- Photo Stack Overlay -->
                        <div class="photo-stack-overlay">
                            <div class="photo photo-1" style="background-image: url('assets/img/bgphoto01.jpg')"></div>
                            <div class="photo photo-2" style="background-image: url('assets/img/bgphoto02.jpg')"></div>
                            <div class="photo photo-3" style="background-image: url('assets/img/bgphoto03.jpg')"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

    <!-- Clients Section -->
    <section class="clients-section">
        <div class="container">
            <p class="section-label">Trusted by amazing brands</p>
            <div class="clients-grid">
                <div class="client-logo">
                    <img src="assets/img/bg-cute.jpg" alt="Client logo">
                </div>
                <div class="client-logo">
                    <img src="https://via.placeholder.com/120x40?text=Brand+2" alt="Client logo">
                </div>
                <div class="client-logo">
                    <img src="https://via.placeholder.com/120x40?text=Brand+3" alt="Client logo">
                </div>
                <div class="client-logo">
                    <img src="https://via.placeholder.com/120x40?text=Brand+4" alt="Client logo">
                </div>
                <div class="client-logo">
                    <img src="https://via.placeholder.com/120x40?text=Brand+5" alt="Client logo">
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features-section" id="features">
        <div class="container">
            <div class="section-header">
                <p class="section-label">Features</p>
                <h2 class="section-title">Magical Photo Experiences</h2>
                <p class="section-subtitle">Everything you need to create stunning, share-worthy photos</p>
            </div>
            
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">
                        <div class="icon-circle"></div>
                        <i class="fas fa-sticky-note"></i>
                    </div>
                    <h3>100+ Cute Stickers</h3>
                    <p>Adorable stickers to personalize every photo with your unique style</p>
                    <div class="feature-preview">
                        <div class="sticker-preview">
                            <img src="https://via.placeholder.com/150x100?text=Stickers" alt="Stickers preview">
                        </div>
                    </div>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        <div class="icon-circle"></div>
                        <i class="fas fa-sliders-h"></i>
                    </div>
                    <h3>Pro Filters</h3>
                    <p>Beautiful filters designed by professional photographers</p>
                    <div class="feature-preview">
                        <div class="filters-preview">
                            <div class="filter-sample filter-1"></div>
                            <div class="filter-sample filter-2"></div>
                            <div class="filter-sample filter-3"></div>
                        </div>
                    </div>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        <div class="icon-circle"></div>
                        <i class="fas fa-cloud-upload-alt"></i>
                    </div>
                    <h3>Instant Sharing</h3>
                    <p>Share directly to all social platforms with one tap</p>
                    <div class="feature-preview">
                        <div class="social-icons">
                            <i class="fab fa-instagram"></i>
                            <i class="fab fa-tiktok"></i>
                            <i class="fab fa-twitter"></i>
                            <i class="fab fa-facebook-f"></i>
                        </div>
                    </div>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        <div class="icon-circle"></div>
                        <i class="fas fa-images"></i>
                    </div>
                    <h3>Photo Gallery</h3>
                    <p>All your captured memories organized in one beautiful place</p>
                    <div class="feature-preview">
                        <div class="gallery-preview">
                            <div class="gallery-item"></div>
                            <div class="gallery-item"></div>
                            <div class="gallery-item"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works-section" id="how-it-works">
        <div class="container">
            <div class="section-header">
                <p class="section-label">Process</p>
                <h2 class="section-title">How CuteCam Works</h2>
                <p class="section-subtitle">Creating magical photos has never been easier</p>
            </div>
            
            <div class="steps-container">
                <div class="step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h3>Launch the Photo Booth</h3>
                        <p>Click the "Start Creating" button to launch our magical photo booth experience</p>
                    </div>
                    <div class="step-image">
                        <div class="image-wrapper">
                            <img src="assets/img/process1.jpg" alt="Step 1">
                        </div>
                    </div>
                </div>
                
                <div class="step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h3>Customize Your Shot</h3>
                        <p>Add stickers, apply filters, and adjust lighting to create your perfect photo</p>
                    </div>
                    <div class="step-image">
                        <div class="image-wrapper">
                            <img src="assets/img/process2.jpg" alt="Step 2">
                        </div>
                    </div>
                </div>
                
                <div class="step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h3>Capture & Share</h3>
                        <p>Snap your photo and instantly share it with friends or save to your gallery</p>
                    </div>
                    <div class="step-image">
                        <div class="image-wrapper">
                            <img src="assets/img/process3.jpg" alt="Step 3">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section" id="testimonials">
        <div class="container">
            <div class="section-header">
                <p class="section-label">Love from Users</p>
                <h2 class="section-title">What People Are Saying</h2>
                <p class="section-subtitle">Don't just take our word for it</p>
            </div>
            
            <div class="testimonials-slider">
                <div class="testimonial active">
                    <div class="testimonial-content">
                        <div class="quote-icon">
                            <i class="fas fa-quote-left"></i>
                        </div>
                        <p class="testimonial-text">CuteCam made our wedding photo booth so special! Guests couldn't stop using it and we have the most amazing memories.</p>
                        <div class="testimonial-author">
                            <div class="author-avatar">
                                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sarah J.">
                            </div>
                            <div class="author-info">
                                <h4>Sarah J.</h4>
                                <p>Wedding Planner</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="testimonial">
                    <div class="testimonial-content">
                        <div class="quote-icon">
                            <i class="fas fa-quote-left"></i>
                        </div>
                        <p class="testimonial-text">As a social media manager, I'm always looking for fun ways to create content. CuteCam is my new secret weapon!</p>
                        <div class="testimonial-author">
                            <div class="author-avatar">
                                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Michael T.">
                            </div>
                            <div class="author-info">
                                <h4>Michael T.</h4>
                                <p>Social Media Manager</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="testimonial">
                    <div class="testimonial-content">
                        <div class="quote-icon">
                            <i class="fas fa-quote-left"></i>
                        </div>
                        <p class="testimonial-text">My kids are obsessed with the stickers and filters. It's the perfect way to capture family memories that actually look good!</p>
                        <div class="testimonial-author">
                            <div class="author-avatar">
                                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Jessica L.">
                            </div>
                            <div class="author-info">
                                <h4>Jessica L.</h4>
                                <p>Mom of Two</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="slider-controls">
                    <button class="slider-prev">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <div class="slider-dots">
                        <span class="dot active"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                    </div>
                    <button class="slider-next">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
        <div class="container">
            <div class="cta-card">
                <div class="cta-content">
                    <h2>Ready to Create Magic?</h2>
                    <p>Join thousands of happy users capturing their cutest moments</p>
                    <div class="cta-buttons">
                        <a href="/photobooth" class="btn btn-primary btn-large">
                            <span>Start Free Trial</span>
                            <i class="fas fa-arrow-right"></i>
                        </a>
                        <a href="#how-it-works" class="btn btn-outline btn-large">
                            <i class="fas fa-play-circle"></i>
                            <span>Watch Demo</span>
                        </a>
                    </div>
                </div>
                <div class="cta-image">
                    <img src="assets/img/bg-cute.jpg" alt="Happy users">
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="main-footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col footer-about">
                    <div class="logo">
                        <img src="assets/img/logo-icon.png" alt="CuteCam Logo" class="logo-icon">
                        <span class="logo-text">CuteCam</span>
                    </div>
                    <p class="footer-about-text">Making photo magic since 2023. Capturing life's cutest moments one snap at a time.</p>
                    <div class="social-links">
                        <a href="#" aria-label="Instagram">
                            <i class="fab fa-instagram"></i>
                        </a>
                        <a href="#" aria-label="Twitter">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="#" aria-label="TikTok">
                            <i class="fab fa-tiktok"></i>
                        </a>
                        <a href="#" aria-label="Facebook">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                    </div>
                </div>
                
                <div class="footer-col">
                    <h3 class="footer-title">Product</h3>
                    <ul class="footer-links">
                        <li><a href="/photobooth">Photo Booth</a></li>
                        <li><a href="#features">Features</a></li>
                        <li><a href="#how-it-works">How It Works</a></li>
                        <li><a href="#">Pricing</a></li>
                        <li><a href="#">Gallery</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h3 class="footer-title">Company</h3>
                    <ul class="footer-links">
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Press</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>
                
                <div class="footer-col">
                    <h3 class="footer-title">Resources</h3>
                    <ul class="footer-links">
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Tutorials</a></li>
                        <li><a href="#">Community</a></li>
                        <li><a href="#">Webinars</a></li>
                        <li><a href="#">API Docs</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <div class="footer-legal">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Cookie Policy</a>
                </div>
                <div class="footer-copyright">
                    <p>&copy; 2023 CuteCam. All rights reserved.</p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Back to Top Button -->
    <button class="back-to-top" id="back-to-top">
        <i class="fas fa-arrow-up"></i>
    </button>

    <!-- Theme Toggle -->
    <button class="theme-toggle" id="theme-toggle">
        <div class="sun-moon">
            <i class="fas fa-sun"></i>
        </div>
        <div class="theme-ball"></div>
    </button>

    <script src="assets/js/landing.js"></script>
</body>
</html>