/**
 * ============================================
 * CYBER SCHOOL EXPERIENCE - MAIN JAVASCRIPT
 * ============================================
 * Core functionality used across all pages
 */

(function() {
    'use strict';

    function resolveSitePath(path) {
        if (!path || typeof path !== 'string') return path;

        const trimmedPath = path.trim();
        if (!trimmedPath) return trimmedPath;
        if (/^(https?:)?\/\//i.test(trimmedPath) || /^[a-zA-Z][a-zA-Z\d+\-.]*:/i.test(trimmedPath)) {
            return trimmedPath;
        }

        const base = window.location.href || `${window.location.origin}/`;

        try {
            if (trimmedPath.startsWith('/')) {
                return new URL(trimmedPath.replace(/^\/+/, ''), `${window.location.origin}/`).toString();
            }

            return new URL(trimmedPath, base).toString();
        } catch (error) {
            const safeBase = `${window.location.origin}/`;
            const normalizedPath = trimmedPath.replace(/\\/g, '/');
            const safePath = normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath;
            return new URL(safePath, safeBase).toString();
        }
    }

    function resolveSitePaths(root = document) {
        if (!root || typeof root.querySelectorAll !== 'function') return;

        const elements = root.querySelectorAll('a[href], img[src], link[href], script[src]');

        elements.forEach(element => {
            const attribute = element.tagName === 'IMG' ? 'src' : 'href';
            const value = element.getAttribute(attribute);

            if (!value) return;

            const trimmedValue = value.trim();
            if (!trimmedValue || /^(https?:)?\/\//i.test(trimmedValue) || /^mailto:/i.test(trimmedValue) || trimmedValue.startsWith('#') || trimmedValue.startsWith('javascript:')) {
                return;
            }

            if (trimmedValue.startsWith('/') || trimmedValue.startsWith('./') || trimmedValue.startsWith('../')) {
                element.setAttribute(attribute, resolveSitePath(trimmedValue));
            }
        });
    }

    window.CSE_Utils = { resolveSitePath, resolveSitePaths };

    function ensureMetaTag(name, content, attributes = {}) {
        if (!name || content === undefined || content === null) return null;

        const attributeKey = attributes.property ? 'property' : 'name';
        const attributeValue = attributes.property || attributes.name || name;
        const existing = document.querySelector(`meta[${attributeKey}="${attributeValue}"]`);
        if (existing) {
            existing.setAttribute('content', content);
            return existing;
        }

        const tag = document.createElement('meta');
        if (attributes.name) {
            tag.setAttribute('name', attributes.name);
        }
        if (attributes.property) {
            tag.setAttribute('property', attributes.property);
        } else if (!attributes.name) {
            tag.setAttribute('name', name);
        }
        tag.setAttribute('content', content);
        document.head.appendChild(tag);
        return tag;
    }

    function ensureLinkTag(rel, href, attributes = {}) {
        if (!rel || !href) return null;

        const selector = `link[rel="${rel}"]`;
        const existing = document.querySelector(selector);
        if (existing) {
            existing.setAttribute('href', href);
            Object.entries(attributes).forEach(([key, value]) => existing.setAttribute(key, value));
            return existing;
        }

        const tag = document.createElement('link');
        tag.setAttribute('rel', rel);
        tag.setAttribute('href', href);
        Object.entries(attributes).forEach(([key, value]) => tag.setAttribute(key, value));
        document.head.appendChild(tag);
        return tag;
    }

    function applySiteMetadata() {
        const title = document.title && document.title.trim() ? document.title : 'Cyber School Experience';
        const siteName = 'Cyber School Experience';
        const defaultDescription = 'Cyber School Experience is a vibrant learning community where students connect, share resources, and support each other academically.';
        const currentUrl = window.location.href;
        const currentPath = window.location.pathname || '/';
        const pageTitle = title.includes(siteName) ? title : `${title} - ${siteName}`;

        if (!document.title || !document.title.trim()) {
            document.title = pageTitle;
        }

        ensureLinkTag('icon', '/assets/images/logo/cyber-school-logo.svg', { type: 'image/svg+xml' });
        ensureLinkTag('canonical', currentUrl);
        ensureMetaTag('description', defaultDescription);
        ensureMetaTag('keywords', 'cyber school experience, student community, whatsapp groups, academic resources, study materials');
        ensureMetaTag('robots', 'index, follow');
        ensureMetaTag('og:title', pageTitle, { property: 'og:title' });
        ensureMetaTag('og:description', defaultDescription, { property: 'og:description' });
        ensureMetaTag('og:type', 'website', { property: 'og:type' });
        ensureMetaTag('og:url', currentUrl, { property: 'og:url' });
        ensureMetaTag('og:image', '/assets/images/logo/cyber-school-logo.svg', { property: 'og:image' });
        ensureMetaTag('twitter:card', 'summary_large_image', { name: 'twitter:card' });
        ensureMetaTag('twitter:title', pageTitle, { name: 'twitter:title' });
        ensureMetaTag('twitter:description', defaultDescription, { name: 'twitter:description' });
        ensureMetaTag('twitter:image', '/assets/images/logo/cyber-school-logo.svg', { name: 'twitter:image' });

        const ogTitleTag = document.querySelector('meta[property="og:title"]');
        const ogDescriptionTag = document.querySelector('meta[property="og:description"]');
        const ogUrlTag = document.querySelector('meta[property="og:url"]');
        const ogImageTag = document.querySelector('meta[property="og:image"]');
        const twitterTitleTag = document.querySelector('meta[name="twitter:title"]');
        const twitterDescriptionTag = document.querySelector('meta[name="twitter:description"]');
        const twitterImageTag = document.querySelector('meta[name="twitter:image"]');

        if (ogTitleTag) ogTitleTag.setAttribute('content', pageTitle);
        if (ogDescriptionTag) ogDescriptionTag.setAttribute('content', defaultDescription);
        if (ogUrlTag) ogUrlTag.setAttribute('content', currentUrl);
        if (ogImageTag) ogImageTag.setAttribute('content', '/assets/images/logo/cyber-school-logo.svg');
        if (twitterTitleTag) twitterTitleTag.setAttribute('content', pageTitle);
        if (twitterDescriptionTag) twitterDescriptionTag.setAttribute('content', defaultDescription);
        if (twitterImageTag) twitterImageTag.setAttribute('content', '/assets/images/logo/cyber-school-logo.svg');

        const titleTag = document.querySelector('meta[property="og:type"]');
        if (titleTag) titleTag.setAttribute('content', 'website');
    }

    function ensureCosmicBackground() {
        if (document.querySelector('.cosmic-bg')) return;

        const background = document.createElement('div');
        background.className = 'cosmic-bg';
        background.setAttribute('aria-hidden', 'true');
        background.innerHTML = `
            <div class="floating-orb orb-a"></div>
            <div class="floating-orb orb-b"></div>
            <div class="floating-orb orb-c"></div>
            <span class="ambient-orb orb-one"></span>
            <span class="ambient-orb orb-two"></span>
            <span class="ambient-orb orb-three"></span>
        `;

        if (document.body) {
            document.body.insertBefore(background, document.body.firstChild);
        }
    }

    function resolveDataUrl(filename) {
        if (!filename || typeof filename !== 'string') return filename;

        const baseUrl = window.location.href || `${window.location.origin}/`;
        const pathname = window.location.pathname || '/';
        const isNestedPage = pathname.includes('/pages/');
        const relativePath = isNestedPage ? `../../data/${filename}` : `data/${filename}`;

        try {
            return new URL(relativePath, baseUrl).toString();
        } catch (error) {
            return `${window.location.origin}/${relativePath.replace(/^\.?\//, '')}`;
        }
    }

    async function loadJsonData(filename) {
        const url = resolveDataUrl(filename);
        const response = await fetch(url, {
            method: 'GET',
            headers: { Accept: 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`Failed to load ${filename}: ${response.status}`);
        }

        return response.json();
    }

    function createJsonStore(filename, key, options = {}) {
        const store = {
            _data: null,
            async load() {
                if (this._data) return this._data;

                const payload = await loadJsonData(filename);
                const items = Array.isArray(payload) ? payload : payload?.[key] || [];
                this._data = options.normalize ? options.normalize(items) : items;
                return this._data;
            },
            getItems() {
                return this._data || [];
            },
            clear() {
                this._data = null;
            }
        };

        if (options.getStats) {
            store.getStats = function() {
                return options.getStats(this.getItems());
            };
        }

        return store;
    }

    window.CSE_Data = {
        resolveDataUrl,
        loadJsonData
    };

    window.CSE_Groups = {
        _instance: null,
        getInstance() {
            if (!this._instance) {
                this._instance = createJsonStore('groups.json', 'groups', {
                    getStats: (items) => {
                        const totalGroups = items.length;
                        const totalMembers = items.reduce((sum, item) => {
                            const membersValue = parseInt(String(item.members || '').replace(/[^\d]/g, ''), 10);
                            return sum + (Number.isFinite(membersValue) ? membersValue : 0);
                        }, 0);
                        const activeGroups = items.filter(item => item.active).length;

                        return {
                            totalGroups,
                            totalMembers,
                            activeGroups
                        };
                    }
                });
            }

            return this._instance;
        }
    };

    window.CSE_Announcements = {
        _instance: null,
        getInstance() {
            if (!this._instance) {
                this._instance = createJsonStore('announcements.json', 'announcements');
            }

            return this._instance;
        }
    };

    document.addEventListener('DOMContentLoaded', function() {
        applySiteMetadata();
        ensureCosmicBackground();
        resolveSitePaths(document);
        initActiveNavLink();
        initMobileMenu();

        document.addEventListener('components:loaded', function() {
            applySiteMetadata();
            ensureCosmicBackground();
            resolveSitePaths(document);
            initActiveNavLink();
            initMobileMenu();
            window.setTimeout(() => resolveSitePaths(document), 50);
            window.setTimeout(() => initActiveNavLink(), 50);
            window.setTimeout(() => initMobileMenu(), 50);
        });

        document.addEventListener('includesLoaded', function() {
            applySiteMetadata();
            ensureCosmicBackground();
            resolveSitePaths(document);
            initActiveNavLink();
            initMobileMenu();
            window.setTimeout(() => resolveSitePaths(document), 50);
            window.setTimeout(() => initActiveNavLink(), 50);
            window.setTimeout(() => initMobileMenu(), 50);
        });

        window.setTimeout(() => resolveSitePaths(document), 50);
        window.setTimeout(() => initActiveNavLink(), 50);
        window.setTimeout(() => initMobileMenu(), 50);
    });

    // ============================================
    // 1. TOAST NOTIFICATIONS
    // ============================================
    let toastTimer = null;

    /**
     * Show a toast notification
     * @param {string} message - The message to display
     * @param {string} type - Optional: 'success', 'info', 'warning' (default: 'info')
     */
    function showToast(message, type = 'info') {
        // Get or create toast element
        let toast = document.getElementById('toast');
        
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'toast';
            toast.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span id="toastMessage">${message}</span>
            `;
            document.body.appendChild(toast);
        }

        const toastIcon = toast.querySelector('i');
        const toastMsg = document.getElementById('toastMessage') || toast.querySelector('span');
        
        // Set icon based on type
        const iconMap = {
            success: 'fa-check-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-circle',
            error: 'fa-times-circle'
        };
        toastIcon.className = `fas ${iconMap[type] || iconMap.info}`;

        // Set message
        toastMsg.textContent = message;

        // Show toast
        toast.classList.add('show');
        
        // Clear existing timer
        clearTimeout(toastTimer);
        
        // Auto-hide after 3 seconds
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // ============================================
    // 2. THEME TOGGLE (DAY / NIGHT / SYSTEM)
    // ============================================
    const THEME_STORAGE_KEY = 'cse-theme-preference';

    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(mode = 'system') {
        const normalizedMode = ['light', 'dark', 'system'].includes(mode) ? mode : 'system';
        const resolvedTheme = normalizedMode === 'system' ? getSystemTheme() : normalizedMode;

        document.documentElement.setAttribute('data-theme', normalizedMode);
        document.documentElement.setAttribute('data-resolved-theme', resolvedTheme);
        document.body.setAttribute('data-theme', normalizedMode);
        document.body.setAttribute('data-resolved-theme', resolvedTheme);

        document.documentElement.classList.toggle('theme-dark', resolvedTheme === 'dark');
        document.documentElement.classList.toggle('theme-light', resolvedTheme === 'light');
        document.body.classList.toggle('theme-dark', resolvedTheme === 'dark');
        document.body.classList.toggle('theme-light', resolvedTheme === 'light');
    }

    function initThemeToggle() {
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'system';
        applyTheme(storedTheme);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'system';
            if (currentTheme === 'system') {
                applyTheme('system');
            }
        };

        if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', handleSystemThemeChange);
        } else if (typeof mediaQuery.addListener === 'function') {
            mediaQuery.addListener(handleSystemThemeChange);
        }

        document.addEventListener('keydown', function(e) {
            if (!e.altKey) return;

            const key = e.key.toLowerCase();

            if (key === 't') {
                e.preventDefault();
                const currentTheme = document.documentElement.getAttribute('data-theme') || 'system';
                const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
                localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
                applyTheme(nextTheme);
            }

            if (key === 's') {
                e.preventDefault();
                localStorage.setItem(THEME_STORAGE_KEY, 'system');
                applyTheme('system');
            }
        });
    }

    // ============================================
    // 3. MOBILE MENU TOGGLE
    // ============================================
    function initActiveNavLink() {
        const navLinks = document.querySelectorAll('#mainNav .nav-link');
        if (!navLinks.length) return false;

        const currentPath = window.location.pathname.replace(/\/+$|\/index\.html$/i, '');
        const normalizedCurrent = currentPath === '' ? '/' : currentPath;

        const isActivePath = (targetPath) => {
            const normalizedTarget = targetPath.replace(/\/+$|\/index\.html$/i, '');
            if (!normalizedTarget || normalizedTarget === '/') {
                return normalizedCurrent === '/' || normalizedCurrent === '';
            }

            if (normalizedTarget === '/pages/announcements') {
                return normalizedCurrent.startsWith('/pages/announcements');
            }
            if (normalizedTarget === '/pages/chats') {
                return normalizedCurrent.startsWith('/pages/chats');
            }
            if (normalizedTarget === '/pages/resources') {
                return normalizedCurrent.startsWith('/pages/resources');
            }
            if (normalizedTarget === '/pages/about') {
                return normalizedCurrent.startsWith('/pages/about');
            }

            return normalizedCurrent === normalizedTarget;
        };

        navLinks.forEach(link => {
            const href = link.getAttribute('href') || '';
            const targetPath = href ? new URL(href, window.location.href).pathname : '';
            const shouldBeActive = isActivePath(targetPath);
            link.classList.toggle('active', shouldBeActive);
            link.setAttribute('aria-current', shouldBeActive ? 'page' : 'false');
        });

        return true;
    }

    function initMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const mainNav = document.getElementById('mainNav');
        const navOverlay = document.getElementById('navOverlay');

        if (!menuToggle || !mainNav) return false;
        if (menuToggle.dataset.cseBound === 'true') return true;

        function toggleMenu(open) {
            const isOpen = open !== undefined ? open : mainNav.classList.contains('open');
            
            if (isOpen) {
                mainNav.classList.remove('open');
                if (navOverlay) navOverlay.classList.remove('open');
                document.body.style.overflow = '';
                document.body.classList.remove('nav-open');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                menuToggle.setAttribute('aria-expanded', 'false');
            } else {
                mainNav.classList.add('open');
                if (navOverlay) navOverlay.classList.add('open');
                document.body.style.overflow = 'hidden';
                document.body.classList.add('nav-open');
                menuToggle.innerHTML = '<i class="fas fa-times"></i>';
                menuToggle.setAttribute('aria-expanded', 'true');
            }
        }

        // Toggle on button click
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });

        // Close on overlay click
        if (navOverlay) {
            navOverlay.addEventListener('click', function() {
                toggleMenu(true);
            });
        }

        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mainNav.classList.contains('open')) {
                toggleMenu(true);
            }
        });

        // Close on nav link click (mobile)
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    toggleMenu(true);
                }
            });
        });

        // Handle resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 768 && mainNav.classList.contains('open')) {
                    toggleMenu(true);
                }
            }, 250);
        });

        menuToggle.dataset.cseBound = 'true';
        return true;
    }

    // ============================================
    // 3. SEARCH FUNCTIONALITY
    // ============================================
    function initSearch(options = {}) {
        const {
            inputSelector = '#searchInput',
            onSearch = null,
            debounceDelay = 300
        } = options;

        const searchInput = document.querySelector(inputSelector);
        if (!searchInput) return null;

        let debounceTimer = null;

        function handleSearch() {
            const query = searchInput.value.trim();
            if (onSearch && typeof onSearch === 'function') {
                onSearch(query);
            }
        }

        searchInput.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(handleSearch, debounceDelay);
        });

        // Expose for external use
        return {
            getValue: () => searchInput.value.trim(),
            reset: () => { searchInput.value = ''; handleSearch(); },
            element: searchInput
        };
    }

    // ============================================
    // 4. FILTER FUNCTIONALITY
    // ============================================
    function initFilters(options = {}) {
        const {
            containerSelector = '.filter-btns',
            onFilter = null,
            activeClass = 'active'
        } = options;

        const container = document.querySelector(containerSelector);
        if (!container) return null;

        const buttons = container.querySelectorAll('button');

        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active from all
                buttons.forEach(b => b.classList.remove(activeClass));
                // Add active to clicked
                this.classList.add(activeClass);
                
                const filterValue = this.dataset.filter || 'all';
                if (onFilter && typeof onFilter === 'function') {
                    onFilter(filterValue);
                }
            });
        });

        // Return the active filter
        function getActiveFilter() {
            const activeBtn = container.querySelector(`.${activeClass}`);
            return activeBtn ? activeBtn.dataset.filter || 'all' : 'all';
        }

        return {
            getActiveFilter,
            setFilter: (value) => {
                buttons.forEach(btn => {
                    const isActive = (btn.dataset.filter || 'all') === value;
                    btn.classList.toggle(activeClass, isActive);
                });
                if (onFilter && typeof onFilter === 'function') {
                    onFilter(value);
                }
            }
        };
    }

    // ============================================
    // 5. PAGINATION
    // ============================================
    function initPagination(options = {}) {
        const {
            containerSelector = '#pagination',
            onPageChange = null,
            itemsPerPage = 5
        } = options;

        const container = document.querySelector(containerSelector);
        if (!container) return null;

        const pageButtons = container.querySelectorAll('[data-page]');
        const prevBtn = container.querySelector('#prevPage');
        const nextBtn = container.querySelector('#nextPage');
        let currentPage = 1;
        let totalPages = 1;

        function updatePage(newPage, total) {
            totalPages = total || totalPages;
            if (newPage < 1) newPage = 1;
            if (newPage > totalPages) newPage = totalPages;
            currentPage = newPage;

            // Update button states
            pageButtons.forEach(btn => {
                const page = parseInt(btn.dataset.page);
                btn.classList.toggle('active', page === currentPage);
                btn.style.display = page <= totalPages ? 'inline-block' : 'none';
            });

            if (prevBtn) {
                prevBtn.style.display = currentPage > 1 ? 'inline-block' : 'none';
            }
            if (nextBtn) {
                nextBtn.style.display = currentPage < totalPages ? 'inline-block' : 'none';
            }

            if (onPageChange && typeof onPageChange === 'function') {
                onPageChange(currentPage);
            }
        }

        // Page button clicks
        pageButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const page = parseInt(this.dataset.page);
                updatePage(page);
            });
        });

        // Prev button
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                updatePage(currentPage - 1);
            });
        }

        // Next button
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                updatePage(currentPage + 1);
            });
        }

        return {
            currentPage: () => currentPage,
            totalPages: () => totalPages,
            goTo: (page) => updatePage(page),
            setTotal: (total) => { totalPages = total; updatePage(currentPage, total); },
            next: () => updatePage(currentPage + 1),
            prev: () => updatePage(currentPage - 1)
        };
    }

    // ============================================
    // 6. RESOURCE CARD HANDLERS
    // ============================================
    function initResourceCards() {
        document.addEventListener('click', function(e) {
            const downloadBtn = e.target.closest('.card-btn.download');
            if (downloadBtn) {
                e.preventDefault();
                const title = downloadBtn.dataset.title || 'Resource';
                showToast(`📥 Downloading: ${title}`, 'success');
                
                // Simulate download
                setTimeout(() => {
                    showToast(`✅ Download started!`, 'success');
                }, 800);
            }
        });
    }

    // ============================================
    // 7. ANNOUNCEMENT READ MORE
    // ============================================
    function initAnnouncementReadMore() {
        document.addEventListener('click', function(e) {
            const btn = e.target.closest('.read-more-btn');
            if (!btn) return;

            const id = btn.dataset.id;
            const content = document.getElementById(`content-${id}`);
            if (!content) return;

            const icon = btn.querySelector('i');
            const text = btn.querySelector('span');

            if (content.classList.contains('show')) {
                content.classList.remove('show');
                if (icon) icon.className = 'fas fa-chevron-down';
                if (text) text.textContent = 'Read More';
            } else {
                content.classList.add('show');
                if (icon) icon.className = 'fas fa-chevron-up';
                if (text) text.textContent = 'Read Less';
            }
        });
    }

    // ============================================
    // 8. SHARE FUNCTIONALITY
    // ============================================
    function initShareButtons() {
        document.addEventListener('click', function(e) {
            const btn = e.target.closest('.share-btn');
            if (!btn) return;

            const title = btn.dataset.title || 'Cyber School Experience';
            const url = window.location.href;

            if (navigator.share) {
                navigator.share({
                    title: title,
                    text: `Check out this announcement: ${title}`,
                    url: url
                }).catch(() => {});
            } else {
                const shareText = `${title} - ${url}`;
                navigator.clipboard.writeText(shareText).then(() => {
                    showToast(`📋 Copied to clipboard!`, 'success');
                }).catch(() => {
                    showToast(`📋 Share: ${title}`, 'info');
                });
            }
        });
    }

    // ============================================
    // 9. SMOOTH SCROLL TO ANCHOR
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // 10. INITIALIZE ALL
    // ============================================
    function init() {
        // Theme toggle
        initThemeToggle();

        // Mobile menu
        initMobileMenu();

        document.addEventListener('components:loaded', function() {
            initMobileMenu();
        });

        // Resource cards
        initResourceCards();

        // Announcement read more
        initAnnouncementReadMore();

        // Share buttons
        initShareButtons();

        // Smooth scroll
        initSmoothScroll();

        // Log
        console.log('🚀 Cyber School Experience — Core JS loaded!');
    }

    // ============================================
    // EXPOSE PUBLIC API
    // ============================================
    window.CSE = {
        // Toast
        showToast: showToast,
        
        // Search
        initSearch: initSearch,
        
        // Filters
        initFilters: initFilters,
        
        // Pagination
        initPagination: initPagination,
        
        // Initialize everything
        init: init
    };

    // ============================================
    // AUTO-INIT ON DOM READY
    // ============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Apply theme before the page paints, even if the script loads later.
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'system';
    applyTheme(storedTheme);

})();


