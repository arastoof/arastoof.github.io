document.addEventListener('DOMContentLoaded', function() {
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
                        desktop.classList.remove('hidden');
                        taskbar.classList.remove('hidden');
                        aboutWindow.style.display = 'block';
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
    const projectImages = document.querySelectorAll('.project-image');


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
            windowEl.style.display = 'block';
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
                // Reset aspect ratio when window is closed
                const contentEl = windowEl.querySelector('.window-content');
                if (contentEl) contentEl.style.aspectRatio = 'auto';
            }
        });
    });
    
    // --- Image Viewer logic with Aspect Ratio calculation ---
    function openImageViewer(imgElement) {
        const imgSrc = imgElement.src;
        const imgTitle = imgElement.alt || 'Image Viewer';
        const contentEl = imageViewerWindow.querySelector('.window-content');

        if (!imageViewerWindow || !imageViewerImg || !imageViewerTitle || !contentEl) return;
        
        // Use a temporary image object to get natural dimensions without affecting the DOM
        const tempImg = new Image();
        tempImg.onload = () => {
            // Calculate and set the aspect ratio on the content container
            const ratio = tempImg.naturalWidth / tempImg.naturalHeight;
            contentEl.style.aspectRatio = ratio;

            // Now that the ratio is set, update the real image and show the window
            imageViewerImg.src = imgSrc;
            imageViewerTitle.textContent = imgTitle;

            imageViewerWindow.style.display = 'block';
            zIndexCounter++;
            bringToFront(imageViewerWindow);

            if (taskbarImageViewerIcon) {
                taskbarImageViewerIcon.classList.remove('hidden');
            }
        };
        // Set the src to trigger the load event
        tempImg.src = imgSrc;
    }
    
    projectImages.forEach(img => {
        img.addEventListener('click', () => openImageViewer(img));
    });

    // Make windows draggable only on desktop
    if (window.innerWidth > 767) {
        windows.forEach(makeDraggable);
    }

    function makeDraggable(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = elmnt.querySelector(".window-header");
        
        elmnt.onmousedown = () => {
            zIndexCounter++;
            bringToFront(elmnt);
        };

        if (header) {
            header.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            zIndexCounter++;
            bringToFront(elmnt);

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

            if (newTop < 0) newTop = 0;
            if (newLeft < 0) newLeft = 0;
            
            // Constrain dragging to within the viewport
            const taskbarHeight = document.getElementById('taskbar').offsetHeight || 0;
            if (newLeft + elmnt.offsetWidth > window.innerWidth) {
                newLeft = window.innerWidth - elmnt.offsetWidth;
            }
            if (newTop + elmnt.offsetHeight > window.innerHeight - taskbarHeight) {
                newTop = window.innerHeight - elmnt.offsetHeight - taskbarHeight;
            }

            elmnt.style.top = newTop + "px";
            elmnt.style.left = newLeft + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    
    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');

    function toggleTheme() {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    }

    if(themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if(mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);
    
    // --- Constrain windows to the viewport ---
    if (window.ResizeObserver && window.innerWidth > 767) {
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                const windowEl = entry.target;
                const taskbarHeight = document.getElementById('taskbar').offsetHeight || 40;
                
                // Clamp width
                if (windowEl.offsetLeft + windowEl.offsetWidth > window.innerWidth) {
                    const newWidth = window.innerWidth - windowEl.offsetLeft - 4; 
                    windowEl.style.width = `${newWidth}px`;
                }

                // Clamp height
                if (windowEl.offsetTop + windowEl.offsetHeight > window.innerHeight - taskbarHeight) {
                    const newHeight = window.innerHeight - windowEl.offsetTop - taskbarHeight - 4; 
                    windowEl.style.height = `${newHeight}px`;
                }
            }
        });

        windows.forEach(win => {
            // Only apply this logic to resizable windows
            if(getComputedStyle(win).resize === 'both' || getComputedStyle(win).resize === 'horizontal') {
                resizeObserver.observe(win);
            }
        });
    }

    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        #image-viewer-window { resize: horizontal; }
        #image-viewer-window .window-content { overflow: hidden; }
    `;
    document.head.appendChild(styleSheet);
});