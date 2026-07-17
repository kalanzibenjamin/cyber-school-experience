/**
 * Announcement detail page script
 */

function buildAnnouncementDetailUrl(id) {
    const baseUrl = new URL(window.location.href, window.location.origin);
    const basePath = baseUrl.pathname.endsWith('/') ? baseUrl.pathname : baseUrl.pathname.replace(/[^/]+$/, '');
    return new URL(`./single.html?id=${encodeURIComponent(id)}`, `${baseUrl.origin}${basePath}`).toString();
}

async function loadAnnouncementDetail() {
    const titleEl = document.getElementById('announcement-title');
    const metaEl = document.getElementById('announcement-meta');
    const bodyEl = document.getElementById('announcement-body');
    const shareBtn = document.getElementById('share-announcement-btn');

    if (!titleEl || !metaEl || !bodyEl) return;

    try {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        let announcements = [];

        if (window.CSE_Announcements && typeof window.CSE_Announcements.getInstance === 'function') {
            announcements = await window.CSE_Announcements.getInstance().load();
        } else {
            const response = await fetch(new URL('../../data/announcements.json', window.location.href));
            const payload = await response.json();
            announcements = Array.isArray(payload) ? payload : payload?.announcements || [];
        }

        const item = id ? announcements.find((entry) => String(entry.id) === String(id)) : announcements[0];

        if (!item) {
            titleEl.textContent = 'Announcement not found';
            metaEl.innerHTML = '';
            bodyEl.innerHTML = '<p>The requested announcement could not be found.</p>';
            if (shareBtn) shareBtn.style.display = 'none';
            return;
        }

        const detailUrl = buildAnnouncementDetailUrl(item.id);
        titleEl.textContent = item.title;
        metaEl.innerHTML = `
            <span><i class="fas fa-calendar-alt"></i> ${item.date}</span>
            <span><i class="fas fa-user"></i> ${item.author} · ${item.authorRole}</span>
        `;
        bodyEl.innerHTML = item.fullContent || item.excerpt || '';

        if (shareBtn) {
            shareBtn.dataset.url = detailUrl;
            shareBtn.addEventListener('click', function() {
                const url = this.dataset.url || detailUrl;
                if (navigator.share) {
                    navigator.share({
                        title: item.title,
                        text: `📢 ${item.title}`,
                        url
                    }).catch(() => {});
                } else {
                    navigator.clipboard.writeText(`📢 ${item.title}\n${url}`).then(() => {
                        if (window.showToast) {
                            window.showToast('📋 Link copied to clipboard!', 'success');
                        }
                    }).catch(() => {
                        if (window.showToast) {
                            window.showToast('📋 Share link ready to copy.', 'info');
                        }
                    });
                }
            });
        }
    } catch (err) {
        console.error('Error loading announcement:', err);
        titleEl.textContent = 'Unable to load announcement';
    }
}

document.addEventListener('DOMContentLoaded', loadAnnouncementDetail);
