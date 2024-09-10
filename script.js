document.addEventListener('DOMContentLoaded', () => {


    const burger = document.querySelector('.burger-menu');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burger.classList.toggle('active');
});

    // Typing effect for the main section
    const typingText = document.getElementById('typing-text');
    const phrases = [
        "const developer = 'Software Developer';", 
        "console.log('Hello, world!, I am Ahmad');", 
        "let skills = ['Web Development', 'AI development', 'Mobile App Development'];"
    ];
    let phraseIndex = 0;
    let letterIndex = 0;

    function type() {
        if (letterIndex < phrases[phraseIndex].length) {
            typingText.innerHTML += phrases[phraseIndex].charAt(letterIndex);
            letterIndex++;
            setTimeout(type, 100);
        } else {
            setTimeout(() => {
                typingText.innerHTML = "";
                letterIndex = 0;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                type();
            }, 2000);
        }
    }

    type();

    // Fade-in Animations for sections (About, Skills, Projects, Contact)
    const fadeInElements = document.querySelectorAll('.about-section, .skills-section, .projects-section, .contact-section');
    const fadeInOptions = {
        threshold: 0.2,  // Trigger animation when 20% of the element is visible
    };

    const fadeInOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('fade-in-visible');  // Add the class when element is in view
            observer.unobserve(entry.target);  // Stop observing once the element has been animated
        });
    }, fadeInOptions);

    fadeInElements.forEach(element => {
        element.classList.add('fade-in');  // Initial fade-out state
        fadeInOnScroll.observe(element);   // Start observing the element
    });

    // Project filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove 'active' class from all buttons
            filterBtns.forEach(button => button.classList.remove('active'));
            btn.classList.add('active');
    
            // Get filter value from clicked button
            const filter = btn.getAttribute('data-filter');
    
            projectItems.forEach(item => {
                // Show all items if filter is '*'
                if (filter === '*') {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 100);
                } else if (item.classList.contains(filter.replace('.', ''))) {
                    // Show only items matching the filter class
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 100);
                } else {
                    // Hide items that don't match
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });
    


    // Back to top button
    const backToTopBtn = document.getElementById('back-to-top');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const header = document.querySelector('header');
    
        if (scrollPosition > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Theme Toggle Functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    const body = document.body;

    // Check for saved theme preference and apply it
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme + '-theme');
        if (savedTheme === 'light') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }

    // Toggle theme on click
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        const isLightTheme = body.classList.contains('light-theme');

        // Toggle icons
        if (isLightTheme) {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
            localStorage.setItem('theme', 'light'); // Save light theme in local storage
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
            localStorage.setItem('theme', 'dark'); // Save dark theme in local storage
        }
    });

    // Select all slides
    const slides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;
    const totalSlides = slides.length;

    // Function to display the current slide
    const showSlide = (index) => {
        slides.forEach((slide, i) => {
            slide.classList.remove('active'); // Remove 'active' from all slides
            slide.style.opacity = '0';        // Set opacity to 0 for all slides
            slide.style.display = 'none';     // Hide all slides
        });

        slides[index].classList.add('active'); // Add 'active' class to the current slide
        slides[index].style.display = 'flex';  // Show the active slide
        slides[index].style.opacity = '1';     // Set opacity to 1 for the active slide
    };

    // Function to go to the next slide
    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % totalSlides; // Loop back to the first slide if needed
        showSlide(currentSlide);
    };

    // Automatically change slides every 3 seconds
    setInterval(nextSlide, 3000);

    // Show the first slide when the page loads
    showSlide(currentSlide);

    

   
    
    // Form Validation
    const form = document.querySelector('form');
    const nameInput = document.querySelector('input[name="name"]');
    const emailInput = document.querySelector('input[name="email"]');
    const messageInput = document.querySelector('textarea[name="message"]');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const submitButton = document.querySelector('button[type="submit"]');
        submitButton.classList.add('button-loading');  // Add a loading animation class
        
        setTimeout(() => {
            submitButton.classList.remove('button-loading');
            alert('Form Submitted!');
        }, 2000);
    });

    
    

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Custom Cursor
    const customCursor = document.createElement('div');
    customCursor.classList.add('custom-cursor');
    document.body.appendChild(customCursor);

    document.addEventListener('mousemove', (e) => {
        customCursor.style.left = `${e.pageX}px`;
        customCursor.style.top = `${e.pageY}px`;
    });

    document.querySelectorAll('a, button').forEach((element) => {
        element.addEventListener('mouseenter', () => customCursor.classList.add('active'));
        element.addEventListener('mouseleave', () => customCursor.classList.remove('active'));
    });

    // Interactive Background Elements (Particle.js or custom solution)
    const background = document.querySelector('.home-section');
    const particles = [];

    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        background.appendChild(particle);
        particles.push(particle);

        setTimeout(() => {
            particle.remove();
            particles.splice(particles.indexOf(particle), 1);
        }, 2000);
    }

    background.addEventListener('mousemove', (e) => {
        createParticle(e.clientX, e.clientY);
    });




    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Creating a 3D Cube (replace this with a 3D model)
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;



    const loader = new THREE.GLTFLoader();



    // Animation function for rotating the cube
    const animate = function () {
        requestAnimationFrame(animate);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
    };

    animate();

    // Adjust canvas on resize
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });


    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', (e.clientX - rect.left) / rect.width - 0.5);
            card.style.setProperty('--mouse-y', (e.clientY - rect.top) / rect.height - 0.5);
        });
    
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mouse-x', 0);
            card.style.setProperty('--mouse-y', 0);
        });
    });
    




    // Initialize Isotope for the project grid
var $grid = $('.project-grid').isotope({
    itemSelector: '.project-item',
    layoutMode: 'fitRows'
});

// Filter items on button click
$('.filter-btn').on('click', function() {
    var filterValue = $(this).attr('data-filter');
    $grid.isotope({ filter: filterValue });
    
    // Add 'active' class to the clicked button and remove from others
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');
});


// Lazy loading for images
const lazyImages = document.querySelectorAll('.lazy');

const lazyLoad = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
        }
    });
});

lazyImages.forEach(img => {
    lazyLoad.observe(img);
});




    









const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;

canvas.height = window.innerHeight;

// Handle resizing the canvas when the window is resized
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// Particle properties
const particlesArray = [];
const numParticles = 80;

class Particle {
    constructor(x, y, size, color, velocityX, velocityY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }
    
    // Draw particle on canvas
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    
    // Update particle position
    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Boundary conditions
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
            this.velocityX = -this.velocityX;
        }
        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
            this.velocityY = -this.velocityY;
        }

        // React to mouse movement
        if (Math.abs(this.x - mouse.x) < 100 && Math.abs(this.y - mouse.y) < 100) {
            this.velocityX += (mouse.x - this.x) * 0.001;
            this.velocityY += (mouse.y - this.y) * 0.001;
        }

        this.draw();
    }
}

// Initialize particles
function initParticles() {
    particlesArray.length = 0;

    for (let i = 0; i < numParticles; i++) {
        const size = Math.random() * 3 + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const color = 'rgba(255, 255, 255, 0.8)'; // White particles with transparency
        const velocityX = (Math.random() - 0.5) * 2;
        const velocityY = (Math.random() - 0.5) * 2;
        particlesArray.push(new Particle(x, y, size, color, velocityX, velocityY));
    }
}

// Animation loop
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particlesArray.forEach(particle => {
        particle.update();
    });
    
    requestAnimationFrame(animateParticles);
}

// Mouse interaction
const mouse = {
    x: null,
    y: null
};



// Initialize and animate
initParticles();
animateParticles();






















});