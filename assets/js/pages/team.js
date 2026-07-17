/**
 * Team page script
 */

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(new URL('../../data/team.json', window.location.href));
        const payload = await response.json();
        const team = Array.isArray(payload) ? payload : payload?.team || [];

        const container = document.getElementById('team-list');
        container.innerHTML = team.map((member) => {
            const imgPath = member.image ? (window.CSE_Utils?.resolveSitePath(member.image) || member.image) : null;
            const initials = (member.name || '').split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();

            return `
                <article class="content-card team-member">
                    <div class="member-header">
                        ${imgPath ? `<img src="${imgPath}" alt="${member.name}" onerror="this.style.display='none'" class="member-avatar" />` : `<div class="member-avatar fallback">${initials}</div>`}
                        <div class="member-meta">
                            <h3>${member.name}</h3>
                            <p class="muted"><strong>${member.role}</strong> — ${member.department || ''}</p>
                        </div>
                    </div>
                    <div class="member-bio"><p>${member.bio}</p></div>
                </article>
            `;
        }).join('');
    } catch (err) {
        console.error('Error loading team data:', err);
    }
});
