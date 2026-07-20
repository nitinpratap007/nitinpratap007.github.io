const GITHUB_USERNAME = 'nitinpratap007';

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTypingEffect();
    fetchGitHubStats();
    fetchProjects();
    initScrollAnimations();
    initSmoothNav();
});

// Particle Background
function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(108, 99, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        particles.forEach((a, i) => {
            particles.slice(i + 1).forEach(b => {
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(108, 99, 255, ${0.1 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// Typing Effect
function initTypingEffect() {
    const titles = [
        'Full Stack Developer',
        'UI/UX Enthusiast',
        'Open Source Contributor',
        'Problem Solver',
        'Tech Explorer'
    ];

    const typingEl = document.querySelector('.typing-text');
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = titles[titleIndex];

        if (isDeleting) {
            typingEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === current.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    type();
}

// GitHub Stats
async function fetchGitHubStats() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        const data = await response.json();

        let totalStars = 0;
        const reposResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`);
        const repos = await reposResponse.json();
        repos.forEach(repo => totalStars += repo.stargazers_count);

        animateNumber('repo-count', data.public_repos);
        animateNumber('follower-count', data.followers);
        animateNumber('star-count', totalStars);
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
    }
}

function animateNumber(elementId, target) {
    const element = document.getElementById(elementId);
    if (!element) return;
    let current = 0;
    const increment = Math.max(1, Math.ceil(target / 30));
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = current;
        }
    }, 40);
}

// Projects
async function fetchProjects() {
    const grid = document.getElementById('projects-grid');
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=9`);
        const repos = await response.json();

        grid.innerHTML = '';

        const filteredRepos = repos.filter(repo => !repo.fork).slice(0, 6);

        filteredRepos.forEach((repo, index) => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.style.animationDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || 'No description available.'}</p>
                <div class="project-meta">
                    ${repo.language ? `<span>&#9679; ${repo.language}</span>` : ''}
                    <span>&#9733; ${repo.stargazers_count}</span>
                    <span>&#9741; ${repo.forks_count}</span>
                </div>
                <a href="${repo.html_url}" target="_blank" class="project-link">
                    View Project
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M7 17L17 7M17 7H7M17 7v10"/>
                    </svg>
                </a>
            `;
            grid.appendChild(card);
        });

        if (filteredRepos.length === 0) {
            grid.innerHTML = '<div class="loading">No public repositories found.</div>';
        }
    } catch (error) {
        grid.innerHTML = '<div class="loading">Unable to load projects. Please try again later.</div>';
        console.error('Error fetching projects:', error);
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.skill-card, .project-card, .stat, .contact-link').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Smooth Nav
function initSmoothNav() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.borderBottomColor = 'var(--border)';
        } else {
            navbar.style.borderBottomColor = 'transparent';
        }
    });

    // Active nav link
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${current}`) {
                link.style.color = 'var(--accent)';
            }
        });
    });
}
