// Theme Management
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');

function initTheme() {
    const savedTheme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', savedTheme);
    themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});

// Terminal Animation
const commands = [
    'whoami',
    'cat skills.json',
    'ls projects/',
    'git status',
    'npm run dev'
];

const responses = {
    'whoami': 'Reece Dantin\nAWS Solutions Architect | Georgia Tech CS \'20',
    'cat skills.json': `{
  "languages": ["Swift", "C#", "JavaScript", "Python", "PHP"],
  "cloud": ["AWS", "CDK", "CloudFormation", "Lambda", "CloudFront"],
  "mobile": ["iOS", "React Native", "Unity", "AR"],
  "specialties": ["AI/ML", "Computer Vision", "Migrations", "DR", "Robotics", "Serverless"]
}`,
    'ls projects/': 'aws-solutions-architect/\nradius-technologies-cto/\nverizon-internships/\nzombie-run-game/\nhome-automation/\ntiburon-hosting/',
    'git status': 'On branch main\nYour branch is up to date with \'origin/main\'.\nnothing to commit, working tree clean',
    'npm run dev': 'Starting development server...\n> Local: http://localhost:3000\n> Ready in 1.2s'
};

let currentCommandIndex = 0;
let currentCharIndex = 0;
let isTyping = false;

function typeCommand() {
    if (isTyping) return;

    isTyping = true;
    const command = commands[currentCommandIndex];
    const typingElement = document.getElementById('typing-text');
    const outputElement = document.getElementById('terminal-output');
    const terminalContent = document.querySelector('.terminal-content');

    function scrollToBottom() {
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }

    typingElement.textContent = '';

    function typeChar() {
        if (currentCharIndex < command.length) {
            typingElement.textContent += command[currentCharIndex];
            currentCharIndex++;
            scrollToBottom();
            setTimeout(typeChar, 100);
        } else {
            setTimeout(() => {
                outputElement.innerHTML += `<div class="output-line">
                    <span class="prompt">reece@dev:~$</span> ${command}
                </div>
                <div class="output-response">${responses[command]}</div>`;

                typingElement.textContent = '';
                currentCharIndex = 0;
                currentCommandIndex = (currentCommandIndex + 1) % commands.length;
                isTyping = false;

                scrollToBottom();
                setTimeout(typeCommand, 2000);
            }, 1000);
        }
    }

    typeChar();
}

// Particle System
function createParticles() {
    const hero = document.querySelector('.hero');
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';

    // Create matrix background
    const matrixBg = document.createElement('div');
    matrixBg.className = 'matrix-bg';
    particlesContainer.appendChild(matrixBg);

    // Create floating particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particlesContainer.appendChild(particle);
    }

    hero.appendChild(particlesContainer);
}

// GitHub Integration
async function fetchGitHubStats() {
    try {
        const response = await fetch('https://api.github.com/users/reecedantin');
        const data = await response.json();

        const reposResponse = await fetch('https://api.github.com/users/reecedantin/repos?sort=updated&per_page=100');
        const repos = await reposResponse.json();

        const stats = {
            publicRepos: data.public_repos,
            followers: data.followers,
            totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
            languages: getTopLanguages(repos)
        };

        renderGitHubStats(stats);
        updateProjectsWithRepoData(repos);
    } catch (error) {
        console.log('GitHub API rate limited or unavailable, using fallback data');
        renderGitHubStats({
            publicRepos: '25+',
            followers: '50+',
            totalStars: '100+',
            languages: ['JavaScript', 'Python', 'Java', 'C++']
        });
    }
}

function getTopLanguages(repos) {
    const languages = {};
    repos.forEach(repo => {
        if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
    });
    return Object.keys(languages)
        .sort((a, b) => languages[b] - languages[a])
        .slice(0, 6);
}

function renderGitHubStats(stats) {
    const aboutSection = document.getElementById('about');
    const githubSection = document.createElement('section');
    githubSection.className = 'section';
    githubSection.innerHTML = `
        <div class="container">
            <h2 class="section-title">
                <a href="https://github.com/reecedantin" target="_blank" style="color: inherit; text-decoration: none;">// GitHub Stats</a>
            </h2>
            <div class="github-stats fade-in">
                <div class="github-stat">
                    <div class="github-stat-number" data-target="${stats.publicRepos}">0</div>
                    <div class="github-stat-label">Public Repos</div>
                </div>
                <div class="github-stat">
                    <div class="github-stat-number" data-target="${stats.followers}">0</div>
                    <div class="github-stat-label">Followers</div>
                </div>
                <div class="github-stat">
                    <div class="github-stat-number" data-target="${stats.totalStars}">0</div>
                    <div class="github-stat-label">Total Stars</div>
                </div>
                <div class="github-stat">
                    <div class="github-stat-number" data-target="${stats.languages.length}">0</div>
                    <div class="github-stat-label">Languages</div>
                </div>
            </div>
            <div class="github-profile-card" style="margin-top: var(--space-xl); background: var(--bg-secondary); border-radius: 12px; padding: var(--space-xl); border: 1px solid var(--border); transition: all 0.3s ease; cursor: pointer;" onclick="window.open('https://github.com/reecedantin', '_blank')">
                <div style="display: flex; align-items: center; gap: var(--space-lg);">
                    <img src="https://avatars.githubusercontent.com/u/3465076?v=4" alt="Reece Dantin" style="width: 60px; height: 60px; border-radius: 50%; border: 2px solid var(--primary);">
                    <div style="flex: 1;">
                        <h3 style="margin: 0; color: var(--primary); font-family: var(--font-mono);">@reecedantin</h3>
                        <p style="margin: 0.5rem 0 0 0; color: var(--text-secondary);">Check out my repositories and contributions</p>
                    </div>
                    <div style="color: var(--text-secondary); font-size: 1.5rem;">→</div>
                </div>
            </div>
        </div>
    `;
    aboutSection.insertAdjacentElement('afterend', githubSection);

    // Add hover effect
    const profileCard = githubSection.querySelector('.github-profile-card');
    profileCard.addEventListener('mouseenter', () => {
        profileCard.style.transform = 'translateY(-4px)';
        profileCard.style.boxShadow = 'var(--shadow)';
        profileCard.style.borderColor = 'var(--primary)';
    });
    profileCard.addEventListener('mouseleave', () => {
        profileCard.style.transform = 'translateY(0)';
        profileCard.style.boxShadow = 'none';
        profileCard.style.borderColor = 'var(--border)';
    });
}

function animateCountUp(element, target) {
    const duration = 1000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

function updateProjectsWithRepoData(repos) {
    // Update projects with real GitHub data
    const projectRepoMap = {
        'Radius Analytics': 'radius',
        'Zombie Run Game': 'zombie-run',
        'Home Automation': 'home-automation',
        'MQTT Home': 'mqtt-home'
    };

    projects.forEach(project => {
        const repoName = projectRepoMap[project.title];
        const repo = repos.find(r => r.name.toLowerCase().includes(repoName?.toLowerCase()));
        if (repo) {
            project.github = repo.html_url;
            project.stars = repo.stargazers_count;
            project.language = repo.language;
            project.updated = new Date(repo.updated_at).toLocaleDateString();
        }
    });
}

// Projects Data
const projects = [
    {
        title: 'AWS Solutions Architect',
        description: '5 years helping SMB customers in Washington DC with cloud architecture and infrastructure solutions',
        tech: ['AWS', 'CDK', 'Migrations', 'DR', 'Robotics', 'Serverless', 'AI/ML'],
        image: 'img/portfolio/aws.png'
    },
    {
        title: 'Radius Technologies CTO',
        description: 'Building virtual ring sizing solutions on mobile devices',
        tech: ['iOS', 'Swift', 'Android', 'Computer Vision', 'AI/ML'],
        image: 'img/portfolio/radius.png',
        website: 'https://www.radiustechnologiesinc.com/'
    },
    {
        title: 'Verizon Internships',
        description: '3 years building AWS runbooks, React Native Apps, and AR Mixed Reality for Supply Chain optimization',
        tech: ['AWS', 'React Native', 'AR', 'Mixed Reality', 'Supply Chain'],
        image: 'img/portfolio/verizon.png'
    },
    {
        title: 'Zombie Run Game',
        description: 'Award-winning AR survival game that transforms your real environment into a zombie apocalypse. Winner of Georgia Tech Get A Move On Hackathon 2019',
        tech: ['Unity', 'C#', 'AR', 'iOS'],
        image: 'img/portfolio/zombierunsmall.png',
        github: 'https://github.com/reecedantin/ZombieRun',
        demo: 'https://devpost.com/software/zombierun'
    },
    {
        title: 'Home Automation',
        description: 'IoT system using Raspberry Pi for controlling lights, temperature, and security',
        tech: ['Raspberry Pi', 'IoT', 'Python'],
        image: 'img/portfolio/home.jpg',
        github: 'https://github.com/reecedantin'
    },
    {
        title: 'Tiburon Hosting',
        description: 'Hosting the Ponte Vedra High School Student Newspaper website since 2014',
        tech: ['AWS', 'CloudFront', 'PHP', 'WordPress'],
        image: 'img/portfolio/tiburon.png',
        website: 'https://pvhstiburon.com/'
    }
];

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    document.querySelectorAll('.section-title').forEach(el => {
        el.classList.add('animate');
        observer.observe(el);
    });

    document.querySelectorAll('.about-text, .about-profile').forEach(el => {
        el.classList.add('animate');
        observer.observe(el);
    });

    document.querySelectorAll('.project-card').forEach((el, index) => {
        el.classList.add('animate');
        el.classList.add('fade-in');
        observer.observe(el);
    });

    document.querySelectorAll('.tech-item').forEach(el => {
        el.classList.add('animate');
        observer.observe(el);
    });

    document.querySelectorAll('.github-stat').forEach(el => {
        el.classList.add('animate');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    const numberEl = entry.target.querySelector('.github-stat-number');
                    const target = parseInt(numberEl.dataset.target);
                    if (!numberEl.classList.contains('animated')) {
                        numberEl.classList.add('animated');
                        animateCountUp(numberEl, target);
                    }
                }
            });
        }, observerOptions);
        observer.observe(el);
    });
}

// Enhanced Project Rendering
function renderProjects() {
    const projectsGrid = document.getElementById('projects-grid');

    projects.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';

        // Generate performance metrics
        const metrics = generatePerformanceMetrics();

        projectCard.innerHTML = `
            <div class="project-image" style="height: 200px; overflow: hidden;">
                <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;">
            </div>
            <div class="project-content" style="padding: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                    <h3 style="margin: 0; color: var(--primary);">${project.title}</h3>
                    ${project.stars ? `<span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary);">⭐ ${project.stars}</span>` : ''}
                </div>
                <p style="color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.5;">${project.description}</p>
                <div class="project-tech" style="display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap;">
                    ${project.tech.map(tech => `<span style="background: var(--primary); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem;">${tech}</span>`).join('')}
                </div>

                <div class="project-links" style="display: flex; gap: 1rem; margin-top: 1rem;">
                    ${project.github ? `<a href="${project.github}" class="btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">GitHub</a>` : ''}
                    ${project.demo ? `<a href="${project.demo}" target="_blank" class="btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">DevPost</a>` : ''}
                    ${project.website ? `<a href="${project.website}" target="_blank" class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Website</a>` : ''}
                </div>
                ${project.updated ? `<div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.5rem;">Last updated: ${project.updated}</div>` : ''}
            </div>
        `;

        // Add hover effect for image
        const img = projectCard.querySelector('img');
        projectCard.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.05)';
        });
        projectCard.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
        });

        projectsGrid.appendChild(projectCard);
    });
}

function generatePerformanceMetrics() {
    return {
        speed: Math.floor(Math.random() * 500) + 200,
        security: Math.random() > 0.5 ? 'A+' : 'A',
        mobile: 100
    };
}

// Enhanced Command Palette
const commandPalette = document.getElementById('command-palette');
const paletteSearch = document.getElementById('palette-search');
const paletteResults = document.getElementById('palette-results');

const commands_palette = [
    { name: 'Go to About', action: () => document.getElementById('about').scrollIntoView(), icon: '👤' },
    { name: 'Go to Projects', action: () => document.getElementById('projects').scrollIntoView(), icon: '💼' },
    { name: 'Go to Contact', action: () => document.getElementById('contact').scrollIntoView(), icon: '📧' },
    { name: 'Toggle Theme', action: () => themeToggle.click(), icon: '🌙' },
    { name: 'View Resume', action: () => window.open('resume.pdf', '_blank'), icon: '📄' },
    { name: 'GitHub Profile', action: () => window.open('https://github.com/reecedantin', '_blank'), icon: '🐙' },
    { name: 'LinkedIn Profile', action: () => window.open('https://www.linkedin.com/in/reece-dantin/', '_blank'), icon: '💼' },
    { name: 'X Profile', action: () => window.open('https://x.com/notreece', '_blank'), icon: '𝕏' },
    { name: 'Show Console', action: () => console.log('🚀 Welcome to Reece\'s website! Check out the source code.'), icon: '🔧' },
    { name: 'Konami Code', action: () => activateKonamiCode(), icon: '🎮' },
    { name: 'Matrix Mode', action: () => toggleMatrixMode(), icon: '🔴' }
];

function showCommandPalette() {
    commandPalette.style.display = 'block';
    paletteSearch.focus();
    renderPaletteResults(commands_palette);
}

function hideCommandPalette() {
    commandPalette.style.display = 'none';
    paletteSearch.value = '';
    paletteResults.innerHTML = '';
}

function renderPaletteResults(commands) {
    paletteResults.innerHTML = commands.map((cmd, index) => `
        <div class="palette-result" data-index="${index}" style="padding: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; border-bottom: 1px solid var(--border);">
            <span style="font-size: 1.2rem;">${cmd.icon}</span>
            <span style="color: var(--text);">${cmd.name}</span>
        </div>
    `).join('');

    // Add click handlers
    document.querySelectorAll('.palette-result').forEach((el, index) => {
        el.addEventListener('click', () => {
            commands[index].action();
            hideCommandPalette();
        });

        el.addEventListener('mouseenter', () => {
            el.style.background = 'var(--bg-secondary)';
        });

        el.addEventListener('mouseleave', () => {
            el.style.background = 'transparent';
        });
    });
}

paletteSearch.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = commands_palette.filter(cmd =>
        cmd.name.toLowerCase().includes(query)
    );
    renderPaletteResults(filtered);
});

// Easter Eggs
function activateKonamiCode() {
    document.body.style.transform = 'rotate(360deg)';
    document.body.style.transition = 'transform 2s ease';
    setTimeout(() => {
        document.body.style.transform = '';
        document.body.style.transition = '';
    }, 2000);
    console.log('🎉 Konami Code activated!');
}

function toggleMatrixMode() {
    const particles = document.querySelector('.particles');
    if (particles.classList.contains('matrix-active')) {
        particles.classList.remove('matrix-active');
        particles.style.opacity = '1';
    } else {
        particles.classList.add('matrix-active');
        particles.style.opacity = '0.8';
        particles.style.filter = 'hue-rotate(120deg)';
    }
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        showCommandPalette();
    }

    if (e.key === 'Escape') {
        hideCommandPalette();
    }
});

// Smooth Scrolling for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    createParticles();
    setTimeout(typeCommand, 1000);
    renderProjects();
    renderContactForm();
    fetchGitHubStats();
    setTimeout(initScrollAnimations, 500);
});

// Contact Form Terminal Style
function renderContactForm() {
    const contactForm = document.getElementById('contact-form');
    contactForm.innerHTML = `
        <div style="padding: 1.5rem; font-family: var(--font-mono); background: var(--bg-secondary); color: var(--text); border: 2px solid var(--primary); border-radius: 8px;">
            <form id="contact-form-element" style="display: flex; flex-direction: column; gap: 1rem;">
                <div>
                    <label style="color: var(--primary); display: block; margin-bottom: 0.5rem; font-weight: 600;">Enter your name:</label>
                    <input type="text" name="from_name" required style="background: var(--bg); border: 2px solid var(--border); color: var(--text); padding: 0.5rem; border-radius: 4px; width: 100%; font-family: var(--font-mono); transition: border-color 0.3s ease; outline: none;" placeholder="John Doe">
                </div>
                <div>
                    <label style="color: var(--primary); display: block; margin-bottom: 0.5rem; font-weight: 600;">Enter your email:</label>
                    <input type="email" name="from_email" required style="background: var(--bg); border: 2px solid var(--border); color: var(--text); padding: 0.5rem; border-radius: 4px; width: 100%; font-family: var(--font-mono); transition: border-color 0.3s ease; outline: none;" placeholder="john@example.com">
                </div>
                <div>
                    <label style="color: var(--primary); display: block; margin-bottom: 0.5rem; font-weight: 600;">Enter your message:</label>
                    <textarea name="message" required style="background: var(--bg); border: 2px solid var(--border); color: var(--text); padding: 0.5rem; border-radius: 4px; width: 100%; font-family: var(--font-mono); min-height: 100px; transition: border-color 0.3s ease; outline: none;" placeholder="Hello Reece..."></textarea>
                </div>
                <button type="submit" class="btn-primary" style="align-self: flex-start;">Send Message</button>
            </form>
        </div>
    `;

    // Add focus effects
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.borderColor = 'var(--primary)';
        });
        input.addEventListener('blur', () => {
            input.style.borderColor = 'var(--border)';
        });
    });

    // Initialize EmailJS
    emailjs.init('fCqSgAxobHn4FDSk6');

    // Add form submission handler
    document.getElementById('contact-form-element').addEventListener('submit', function (e) {
        e.preventDefault();

        const btn = this.querySelector('button[type="submit"]');
        btn.textContent = 'Sending...';
        btn.disabled = true;

        emailjs.sendForm('service_ogfq10h', 'template_0wbj7oo', this)
            .then(() => {
                btn.textContent = 'Message Sent!';
                this.reset();
                setTimeout(() => {
                    btn.textContent = 'Send Message';
                    btn.disabled = false;
                }, 3000);
            })
            .catch(() => {
                btn.textContent = 'Error - Try Again';
                setTimeout(() => {
                    btn.textContent = 'Send Message';
                    btn.disabled = false;
                }, 3000);
            });
    });
}
