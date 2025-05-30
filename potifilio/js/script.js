document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            document.querySelector(anchor.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
        themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
    });
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        themeToggle.textContent = '☀️';
    }

    // Motion toggle
    const motionToggle = document.getElementById('motion-toggle');
    motionToggle.addEventListener('click', () => {
        document.body.classList.toggle('no-motion');
        localStorage.setItem('motion', document.body.classList.contains('no-motion') ? 'reduced' : 'full');
        motionToggle.textContent = document.body.classList.contains('no-motion') ? 'Enable Motion' : 'Reduce Motion';
    });
    if (localStorage.getItem('motion') === 'reduced') {
        document.body.classList.add('no-motion');
        motionToggle.textContent = 'Enable Motion';
    }

    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });

    // Slideshow
    const slides = document.querySelector('.slides');
    const slideElements = document.querySelectorAll('.slide');
    let currentSlide = 0;
    const totalSlides = slideElements.length;

    function showSlide(index) {
        slides.style.transform = `translateX(-${index * 100}%)`;
        slideElements.forEach((slide, i) => slide.classList.toggle('active', i === index));
    }

    document.querySelector('.next').addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    });
    document.querySelector('.prev').addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    });

    let autoSlide = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }, 5000);

    document.querySelector('.slideshow').addEventListener('mouseenter', () => clearInterval(autoSlide));
    document.querySelector('.slideshow').addEventListener('mouseleave', () => {
        autoSlide = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }, 5000);
    });

    // Touch swipe
    let touchStartX = 0;
    document.querySelector('.slideshow').addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    document.querySelector('.slideshow').addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        } else if (touchEndX - touchStartX > 50) {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
        }
    });

    // Project filters
    const filterButtons = document.querySelectorAll('.filter-buttons button');
    const projectCards = document.querySelectorAll('.project-card');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.getAttribute('data-filter');
            projectCards.forEach(card => {
                card.style.display = (filter === 'all' || card.getAttribute('data-category') === filter) ? 'block' : 'none';
            });
        });
    });

    // Modals
    const modals = document.querySelectorAll('.modal');
    document.querySelectorAll('.project-card, .slide-info a').forEach(trigger => {
        trigger.addEventListener('click', e => {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal') || trigger.getAttribute('href').substring(1);
            document.getElementById(modalId).style.display = 'block';
        });
    });
    document.querySelectorAll('.close').forEach(close => {
        close.addEventListener('click', () => {
            modals.forEach(modal => modal.style.display = 'none');
        });
    });
    window.addEventListener('click', e => {
        if (e.target.classList.contains('modal')) {
            modals.forEach(modal => modal.style.display = 'none');
        }
    });

    // Scroll animations
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });
    sections.forEach(section => observer.observe(section));

    // Back to top
    const backToTop = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('show', window.scrollY > 300);
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Three.js cube
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('three-canvas').appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0xF87171, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});