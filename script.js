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

// Projects - Add your live demo URLs here
const LIVE_DEMOS = {
    // 'repo-name': 'https://your-live-demo-url.com',
    // Example:
     'portfolio': 'https://nitinpratap007.github.io',
    'NitinChatBot': 'https://nitinchatbot-apk.netlify.app/',
    'system-scanner-': 'https://nitinpratap007.github.io/system-scanner-/',
    'doctor-appointment-booking-system-college-project-vercel': 'https://doctor-appointment-booking-system-c-flax.vercel.app/',
    'college-bus-tracking-system-': 'project link'
};

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
            const demoUrl = LIVE_DEMOS[repo.name] || null;
            card.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || 'No description available.'}</p>
                <div class="project-meta">
                    ${repo.language ? `<span>&#9679; ${repo.language}</span>` : ''}
                    <span>&#9733; ${repo.stargazers_count}</span>
                    <span>&#9741; ${repo.forks_count}</span>
                </div>
                <div class="project-buttons">
                    ${demoUrl ? `
                        <a href="${demoUrl}" target="_blank" class="project-btn demo-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                            </svg>
                            Live Demo
                        </a>
                    ` : ''}
                    <a href="${repo.html_url}" target="_blank" class="project-btn code-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        Code
                    </a>
                </div>
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
