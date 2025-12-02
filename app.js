document.addEventListener('DOMContentLoaded', function() {
    let siteData = {};

    async function init() {
        try {
            const response = await fetch('data.json');
            siteData = await response.json();
            renderProfessionalView(siteData);
            renderOSView(siteData);
            setupEventListeners();
        } catch (error) {
            console.error("Failed to load site data:", error);
        }
    }

    function renderProfessionalView(data) {
        const { profile, projects, experience, skills } = data;

        // Header
        document.getElementById('prof-pic').src = profile.picture;
        document.getElementById('prof-name').textContent = profile.name;
        document.getElementById('prof-bio').textContent = profile.bio;

        const socialLinks = document.getElementById('prof-social');
        socialLinks.innerHTML = `
            <a href="${profile.social.github}" target="_blank"><i class="fab fa-github"></i></a>
            <a href="${profile.social.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>
            <a href="${profile.social.cv}" target="_blank" title="Download CV"><i class="fas fa-file-pdf"></i></a>
        `;

        // Skills
        const skillsList = document.getElementById('skills-list');
        skillsList.innerHTML = skills.map(skill => `
            <span class="skill-tag">${skill}</span>
        `).join('');

        // Projects
        const projectsGrid = document.getElementById('prof-projects-grid');
        projectsGrid.innerHTML = projects.map(p => `
            <div class="project-card-prof visible">
                <div class="project-image-wrapper">
                    <img src="${p.image}" onerror="this.onerror=null;this.src=imageErrorURL" alt="${p.title}">
                </div>
                <h3>${p.title}</h3>
                <div class="project-tags">
                    ${p.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                <p>${p.description}</p>
                <div class="project-links">
                    ${p.siteUrl ? `<a href="${p.siteUrl}" target="_blank">View Site</a>` : ''}
                    ${p.codeUrl ? `<a href="${p.codeUrl}" target="_blank">View Code</a>` : ''}
                </div>
            </div>
        `).join('');

        // Experience
        const experienceGrid = document.getElementById('prof-experience-grid');
        experienceGrid.innerHTML = experience.map(exp => `
            <div class="experience-card">
                <h3>${exp.title}</h3>
                <p class="date">${exp.date}</p>
                <ul>
                    ${exp.duties.map(duty => `<li>${duty}</li>`).join('')}
                </ul>
            </div>
        `).join('');

        // Easter Egg
        const easterEgg = document.getElementById('easter-egg');
        if (easterEgg) {
            easterEgg.addEventListener('click', () => {
                document.getElementById('professional-view').style.display = 'none';
                document.getElementById('os-view').classList.remove('hidden');
                launchOS();
            });
        }
    }

    function renderOSView(data) {
        // About Window
        const aboutContent = document.getElementById('about-content');
        if (aboutContent) {
            aboutContent.innerHTML = `
                <h2 class="text-4xl mb-4" style="color: var(--header);">${data.profile.name}</h2>
                <p>${data.profile.bio}</p>
                <div class="mt-6 flex space-x-4">
                    <a href="${data.profile.social.github}" target="_blank" class="inline-block text-center" style="color: var(--header);"><i class="fab fa-github text-3xl"></i><p class="text-sm mt-1">GitHub</p></a>
                    <a href="${data.profile.social.linkedin}" target="_blank" class="inline-block text-center" style="color: var(--header);"><i class="fab fa-linkedin text-3xl"></i><p class="text-sm mt-1">LinkedIn</p></a>
                    <a href="${data.profile.social.cv}" target="_blank" class="inline-block text-center" style="color: var(--header);" title="Download CV"><i class="fas fa-file-pdf text-3xl"></i><p class="text-sm mt-1">My CV</p></a>
                </div>
            `;
        }

        // Projects Window
        const projectsContent = document.getElementById('projects-content');
        if (projectsContent) {
            projectsContent.innerHTML = data.projects.map(p => `
                <div class="border-2 p-2 flex flex-col" style="border-color: var(--border);">
                    <img src="${p.image}" onerror="this.onerror=null;this.src=imageErrorURL" alt="${p.title}" class="w-full h-32 object-cover mb-2 project-image cursor-pointer">
                    <h3 class="text-2xl" style="color: var(--header);">${p.title}</h3>
                    <p>${p.description}</p>
                    <div class="mt-auto pt-2">
                        ${p.siteUrl ? `<a href="${p.siteUrl}" target="_blank" class="hover:underline mt-2 block">View Site &rarr;</a>` : ''}
                        ${p.codeUrl ? `<a href="${p.codeUrl}" target="_blank" class="hover:underline mt-2 block">View Codebase &rarr;</a>` : ''}
                    </div>
                </div>
            `).join('');
        }

        // Skills Window
        const skillsContent = document.getElementById('skills-content');
        if (skillsContent) {
            skillsContent.innerHTML = `<p>> ${data.skills.join(', ')}</p>`;
        }

        // Experience Window
        const experienceContent = document.getElementById('experience-content');
        if (experienceContent) {
            experienceContent.innerHTML = data.experience.map(exp => `
                <div>
                    <h2 class="text-2xl mb-2" style="color: var(--header);">${exp.title}</h2>
                    <h3 class="text-lg mb-4" style="color: var(--header);">${exp.date}</h3>
                    <ul class="list-disc list-inside">
                        ${exp.duties.map(duty => `<li>${duty}</li>`).join('')}
                    </ul>
                </div>
            `).join('<hr class="my-4" style="border-color: var(--border);">');
        }
    }

    function setupEventListeners() {


        const projectArrow = document.getElementById('project-arrow');
        if (projectArrow) {
            projectArrow.addEventListener('click', () => {
                const projectCards = document.querySelectorAll('.project-card');
                const isExpanded = projectArrow.classList.contains('fa-chevron-up');

                projectCards.forEach((card, index) => {
                    if (index >= 2) {
                        card.style.display = isExpanded ? 'none' : 'flex';
                    }
                });

                projectArrow.classList.toggle('fa-chevron-down');
                projectArrow.classList.toggle('fa-chevron-up');
            });
        }
    }

    function launchOS() {
        // --- Boot Sequence ---
        const bootScreen = document.getElementById('boot-screen');
        const bootText = document.getElementById('boot-text');
        const progressBarContainer = document.getElementById('progress-bar-container');
        const progressBar = document.getElementById('progress-bar');
        const desktop = document.getElementById('desktop');
        const taskbar = document.getElementById('taskbar');
        const aboutWindow = document.getElementById('about-window');

        const bootLines = [
            "Loading MUSTAFA-OS...",
            "Mounting virtual desktop...",
            "Done."
        ];

        let lineIndex = 0;
        function runBootSequence() {
            if (lineIndex < bootLines.length) {
                bootText.innerHTML += bootLines[lineIndex] + '<br/>';
                lineIndex++;
                setTimeout(runBootSequence, 150);
            } else {
                progressBarContainer.classList.remove('hidden');
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 20;
                    progressBar.style.width = progress + '%';
                    if (progress >= 100) {
                        clearInterval(interval);
                        setTimeout(() => {
                            bootScreen.style.display = 'none';
                            if(desktop) desktop.classList.remove('hidden');
                            if(taskbar) taskbar.classList.remove('hidden');
                            if(aboutWindow) aboutWindow.style.display = 'flex';
                            bringToFront(aboutWindow);
                        }, 400);
                    }
                }, 80);
            }
        }
        runBootSequence();

        // --- Clock ---
        const clockElement = document.getElementById('clock');
        const mobileClockElement = document.getElementById('mobile-clock');
        function updateClock() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-GB');
            if (clockElement) clockElement.textContent = timeString;
            if (mobileClockElement) mobileClockElement.textContent = timeString;
        }
        setInterval(updateClock, 1000);
        updateClock();

        // --- Window Management ---
        const windows = document.querySelectorAll('.window');
        const openWindowIcons = document.querySelectorAll('[data-window]');
        const closeBtns = document.querySelectorAll('.close-btn');
        let zIndexCounter = 10;

        const imageViewerWindow = document.getElementById('image-viewer-window');
        const imageViewerImg = document.getElementById('image-viewer-img');
        const imageViewerTitle = document.getElementById('image-viewer-title');
        const taskbarImageViewerIcon = document.getElementById('taskbar-image-viewer-icon');

        function bringToFront(elmnt) {
            windows.forEach(win => {
                const currentZIndex = parseInt(win.style.zIndex);
                if (!isNaN(currentZIndex) && currentZIndex > 1) {
                    win.style.zIndex = currentZIndex - 1;
                } else if (isNaN(currentZIndex)) {
                    win.style.zIndex = 1;
                }
            });
            elmnt.style.zIndex = zIndexCounter;
        }

        function openWindow(icon) {
            const windowId = icon.getAttribute('data-window');
            const windowEl = document.getElementById(windowId);
            if (windowEl) {
                windowEl.style.display = 'flex';
                zIndexCounter++;
                bringToFront(windowEl);
            }
        }

        openWindowIcons.forEach(icon => {
            if (icon.tagName.toLowerCase() !== 'a') {
                icon.addEventListener('click', () => openWindow(icon));
            }
        });

        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const windowId = btn.getAttribute('data-window');
                const windowEl = document.getElementById(windowId);
                windowEl.style.display = 'none';

                if (windowId === 'image-viewer-window') {
                    if(taskbarImageViewerIcon) taskbarImageViewerIcon.classList.add('hidden');
                    const contentEl = windowEl.querySelector('.window-content');
                    if (contentEl) contentEl.style.aspectRatio = 'auto';
                }
            });
        });

        function openImageViewer(imgElement) {
            const imgSrc = imgElement.src;
            const imgTitle = imgElement.alt || 'Image Viewer';
            const contentEl = imageViewerWindow.querySelector('.window-content');

            if (!imageViewerWindow || !imageViewerImg || !imageViewerTitle || !contentEl) return;

            const tempImg = new Image();
            tempImg.onload = () => {
                const taskbarHeight = document.getElementById('taskbar').offsetHeight || 0;
                const availableWidth = window.innerWidth;
                const availableHeight = window.innerHeight - taskbarHeight;
                const imgRatio = tempImg.naturalWidth / tempImg.naturalHeight;
                let newWidth = availableWidth;
                let newHeight = newWidth / imgRatio;
                if (newHeight > availableHeight) {
                    newHeight = availableHeight;
                    newWidth = newHeight * imgRatio;
                }
                imageViewerWindow.style.width = newWidth + 'px';
                imageViewerWindow.style.height = newHeight + 'px';
                imageViewerWindow.style.top = '0px';
                imageViewerWindow.style.left = (availableWidth - newWidth) / 2 + 'px';
                contentEl.style.aspectRatio = imgRatio;
                imageViewerImg.src = imgSrc;
                imageViewerTitle.textContent = imgTitle;
                imageViewerWindow.style.display = 'block';
                zIndexCounter++;
                bringToFront(imageViewerWindow);
                if (taskbarImageViewerIcon) {
                    taskbarImageViewerIcon.classList.remove('hidden');
                }
            };
            tempImg.src = imgSrc;
        }

        // Add listener to dynamically created project images
        const projectImages = document.querySelectorAll('.project-image');
        projectImages.forEach(img => {
            img.addEventListener('click', () => openImageViewer(img));
        });

        if (window.innerWidth > 767) {
            windows.forEach(makeDraggable);
        }

        function makeDraggable(elmnt) {
            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            const header = elmnt.querySelector(".window-header");
            if (header) {
                header.onmousedown = dragMouseDown;
            }
            elmnt.onmousedown = () => {
                zIndexCounter++;
                bringToFront(elmnt);
            };

            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                let newTop = (elmnt.offsetTop - pos2);
                let newLeft = (elmnt.offsetLeft - pos1);
                const taskbarHeight = document.getElementById('taskbar').offsetHeight || 0;
                if (newLeft < 0) newLeft = 0;
                if (newTop < 0) newTop = 0;
                if (newLeft + elmnt.offsetWidth > window.innerWidth) {
                    newLeft = window.innerWidth - elmnt.offsetWidth;
                }
                if (newTop + elmnt.offsetHeight > window.innerHeight - taskbarHeight) {
                    newTop = window.innerHeight - elmnt.offsetHeight - taskbarHeight;
                }
                if (newLeft < 0) newLeft = 0;
                if (newTop < 0) newTop = 0;
                elmnt.style.top = newTop + "px";
                elmnt.style.left = newLeft + "px";
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }

        const powerBtn = document.getElementById('power-btn');
        if (powerBtn) {
            powerBtn.addEventListener('click', () => {
                document.getElementById('os-view').classList.add('hidden');
                document.getElementById('professional-view').style.display = 'flex';
            });
        }

        const themeToggle = document.getElementById('theme-toggle');
        const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
        function toggleTheme() {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        }
        if(themeToggle) themeToggle.addEventListener('click', toggleTheme);
        if(mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);

        if (window.ResizeObserver && window.innerWidth > 767) {
            const resizeObserver = new ResizeObserver(entries => {
                for (const entry of entries) {
                    const windowEl = entry.target;
                    const taskbarHeight = document.getElementById('taskbar').offsetHeight || 40;
                    if (windowEl.offsetLeft + windowEl.offsetWidth > window.innerWidth) {
                        windowEl.style.width = `${window.innerWidth - windowEl.offsetLeft - 4}px`;
                    }
                    if (windowEl.offsetTop + windowEl.offsetHeight > window.innerHeight - taskbarHeight) {
                        windowEl.style.height = `${window.innerHeight - windowEl.offsetTop - taskbarHeight - 4}px`;
                    }
                }
            });
            windows.forEach(win => {
                if(getComputedStyle(win).resize === 'both' || getComputedStyle(win).resize === 'horizontal') {
                    resizeObserver.observe(win);
                }
            });
        }

        const styleSheet = document.createElement("style");
        styleSheet.innerText = `#image-viewer-window .window-content { overflow: hidden; }`;
        document.head.appendChild(styleSheet);

        const canvas = document.getElementById('starfield-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let stars = [];
            const numStars = 250;
            function setCanvasSize() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            function createStars() {
                stars = [];
                for (let i = 0; i < numStars; i++) {
                    stars.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        size: Math.random() * 1.5 + 0.5,
                        speed: Math.random() * 0.4 + 0.1
                    });
                }
            }
            function drawStars() {
                if (!ctx) return;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const particleColor = getComputedStyle(document.documentElement).getPropertyValue('--particle-color').trim();
                ctx.fillStyle = particleColor || 'white';
                stars.forEach(star => {
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                    ctx.fill();
                });
            }
            function updateStars() {
                stars.forEach(star => {
                    star.y += star.speed;
                    if (star.y > canvas.height + star.size) {
                        star.y = 0 - star.size;
                        star.x = Math.random() * canvas.width;
                    }
                });
            }
            let animationFrameId;
            function animate() {
                updateStars();
                drawStars();
                animationFrameId = requestAnimationFrame(animate);
            }
            window.addEventListener('resize', () => {
                if(animationFrameId) cancelAnimationFrame(animationFrameId);
                setCanvasSize();
                createStars();
                animate();
            });
            setCanvasSize();
            createStars();
            animate();
        }
    }

    init();
})