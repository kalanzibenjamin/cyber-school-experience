/**
 * include.js - HTML Include Handler
 * Usage: Add data-include="path/to/file.html" to any element
 * 
 * Example: <div data-include="components/header.html"></div>
 * 
 * Features:
 * - Supports relative paths
 * - Handles nested includes
 * - Caches fetched content
 * - Error handling with fallback
 */

(function() {
    'use strict';

    // ===== CONFIGURATION =====
    const CONFIG = {
        // Show loading indicator while fetching
        showLoading: true,
        // Loading text/HTML
        loadingHTML: '<div class="include-loading" style="padding: 20px; text-align: center; color: var(--text-light);"><i class="fas fa-spinner fa-spin"></i> Loading...</div>',
        // Error HTML fallback
        errorHTML: '<div class="include-error" style="padding: 20px; text-align: center; color: #e11d48;"><i class="fas fa-exclamation-circle"></i> Failed to load content</div>',
        // Cache fetched content
        useCache: true,
        // Enable debug logging
        debug: false
    };

    // ===== CACHE =====
    const cache = new Map();

    // ===== LOGGER =====
    function log(...args) {
        if (CONFIG.debug) {
            console.log('[Include.js]', ...args);
        }
    }

    function warn(...args) {
        console.warn('[Include.js]', ...args);
    }

    function error(...args) {
        console.error('[Include.js]', ...args);
    }

    // ===== LOAD CONTENT =====
    async function loadContent(url) {
        // Check cache first
        if (CONFIG.useCache && cache.has(url)) {
            log('Cache hit:', url);
            return cache.get(url);
        }

        log('Fetching:', url);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'text/html',
                    'Cache-Control': 'no-cache'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();

            // Store in cache
            if (CONFIG.useCache) {
                cache.set(url, html);
            }

            log('Successfully loaded:', url);
            return html;

        } catch (err) {
            error('Failed to load:', url, err.message);
            throw err;
        }
    }

    // ===== PROCESS INCLUDES =====
    async function processIncludes(container = document) {
        const elements = container.querySelectorAll('[data-include]');
        
        if (elements.length === 0) {
            log('No include elements found');
            return;
        }

        log(`Found ${elements.length} include(s)`);

        // Build list of promises
        const promises = Array.from(elements).map(async (element) => {
            const url = element.getAttribute('data-include');
            
            if (!url) {
                warn('Element has empty data-include attribute');
                return;
            }

            // Skip if already processed
            if (element.hasAttribute('data-include-processed')) {
                log('Already processed:', url);
                return;
            }

            // Show loading indicator
            if (CONFIG.showLoading) {
                element.innerHTML = CONFIG.loadingHTML;
            }

            try {
                // Load content
                const html = await loadContent(url);
                
                // Insert content
                element.innerHTML = html;
                element.setAttribute('data-include-processed', 'true');

                // Process nested includes
                await processIncludes(element);

                log('Processed:', url);

            } catch (err) {
                // Show error fallback
                element.innerHTML = CONFIG.errorHTML;
                element.setAttribute('data-include-error', 'true');
                error('Failed to process include:', url, err.message);
            }
        });

        // Wait for all includes to load
        await Promise.allSettled(promises);
        
        log('All includes processed');
    }

    // ===== OBSERVER FOR DYNAMIC CONTENT =====
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                // Check added nodes
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if node itself has data-include
                        if (node.hasAttribute && node.hasAttribute('data-include')) {
                            processIncludes(node);
                        }
                        // Check for nested includes
                        if (node.querySelectorAll) {
                            const nested = node.querySelectorAll('[data-include]');
                            if (nested.length > 0) {
                                processIncludes(node);
                            }
                        }
                    }
                }
            }
        });

        // Observe the entire document
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        log('MutationObserver set up');
        return observer;
    }

    // ===== INITIALIZE =====
    async function init() {
        log('Initializing...');

        // Process all includes in the document
        await processIncludes(document);

        // Setup observer for dynamic content
        setupObserver();

        // Dispatch event when includes are done
        document.dispatchEvent(new CustomEvent('includesLoaded', {
            detail: { 
                timestamp: Date.now(),
                success: true
            }
        }));

        log('Initialization complete');
    }

    // ===== EXPOSE PUBLIC API =====
    window.CSE_Includes = {
        // Process includes in a specific container
        process: processIncludes,
        
        // Clear the cache
        clearCache: function() {
            cache.clear();
            log('Cache cleared');
        },
        
        // Get cache stats
        getCacheStats: function() {
            return {
                size: cache.size,
                urls: Array.from(cache.keys())
            };
        },
        
        // Reload a specific include
        reload: async function(selector) {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
                const url = el.getAttribute('data-include');
                if (url) {
                    // Remove from cache
                    if (CONFIG.useCache) {
                        cache.delete(url);
                    }
                    el.removeAttribute('data-include-processed');
                    await processIncludes(el);
                }
            }
        }
    };

    // ===== AUTO-INIT ON DOM READY =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ===== RE-INIT ON PAGE LOAD (for browsers that cache) =====
    window.addEventListener('load', function() {
        // Check if any includes were missed
        const unprocessed = document.querySelectorAll('[data-include]:not([data-include-processed])');
        if (unprocessed.length > 0) {
            log('Found unprocessed includes on load, processing...');
            processIncludes(document);
        }
    });

    // ===== EXPOSE CONFIGURATION =====
    window.CSE_IncludesConfig = CONFIG;

    log('Include.js loaded successfully');

})();