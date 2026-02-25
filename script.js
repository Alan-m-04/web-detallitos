document.addEventListener('DOMContentLoaded', () => {

    /* ── Header scroll shadow ── */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });

    /* ── Mobile burger ── */
    const burger = document.getElementById('burger');
    const nav    = document.getElementById('nav');

    burger?.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        burger.setAttribute('aria-expanded', open);
        const spans = burger.querySelectorAll('span');
        if (open) {
            spans[0].style.transform = 'translateY(7px) rotate(45deg)';
            spans[1].style.opacity   = '0';
            spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
        } else {
            spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        }
    });

    nav?.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            const spans = burger.querySelectorAll('span');
            spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        });
    });

    /* ── Scroll Reveal with stagger ── */
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            // stagger siblings
            const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.in-view)')];
            const myIdx    = siblings.indexOf(entry.target);
            setTimeout(() => entry.target.classList.add('in-view'), myIdx * 90);
            revealObs.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    /* ── Gallery filters ── */
    const filterBtns = document.querySelectorAll('.gf-btn');
    const galleryItems = document.querySelectorAll('.gitem');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const f = btn.dataset.filter;
            galleryItems.forEach(item => {
                const show = f === 'all' || item.dataset.cat === f;
                item.classList.toggle('hidden', !show);
                if (show) {
                    item.style.animation = 'none';
                    void item.offsetWidth;
                    item.style.animation = 'fadeIn .4s ease both';
                }
            });
        });
    });

    /* ── Lightbox ── */
    const lbox      = document.getElementById('lbox');
    const lboxImg   = document.getElementById('lbox-img');
    const lboxClose = document.getElementById('lbox-close');
    const lboxPrev  = document.getElementById('lbox-prev');
    const lboxNext  = document.getElementById('lbox-next');
    const lboxCount = document.getElementById('lbox-count');

    let cur = 0;
    let visible = [];

    function getVisible() {
        return [...document.querySelectorAll('.gitem:not(.hidden)')];
    }

    function openLbox(idx) {
        visible = getVisible();
        cur = idx;
        show();
        lbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLbox() {
        lbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    function show() {
        const img = visible[cur]?.querySelector('img');
        if (!img) return;
        lboxImg.src = img.src;
        lboxImg.alt = img.alt;
        lboxCount.textContent = `${cur + 1} / ${visible.length}`;
    }

    function prev() { cur = (cur - 1 + visible.length) % visible.length; show(); }
    function next() { cur = (cur + 1) % visible.length; show(); }

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const vis = getVisible();
            const idx = vis.indexOf(item);
            if (idx !== -1) openLbox(idx);
        });
    });

    lboxClose?.addEventListener('click', closeLbox);
    lboxPrev?.addEventListener('click',  prev);
    lboxNext?.addEventListener('click',  next);
    lbox?.addEventListener('click', e => { if (e.target === lbox) closeLbox(); });

    document.addEventListener('keydown', e => {
        if (!lbox.classList.contains('open')) return;
        if (e.key === 'Escape')      closeLbox();
        if (e.key === 'ArrowLeft')   prev();
        if (e.key === 'ArrowRight')  next();
    });

    /* Touch swipe */
    let tx = 0;
    lbox?.addEventListener('touchstart', e => { tx = e.changedTouches[0].screenX; }, { passive:true });
    lbox?.addEventListener('touchend',   e => {
        const d = tx - e.changedTouches[0].screenX;
        if (Math.abs(d) > 50) d > 0 ? next() : prev();
    });

    /* ── Active nav on scroll ── */
    const sections = document.querySelectorAll('[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                navLinks.forEach(l => {
                    l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`);
                });
            }
        });
    }, { threshold: 0.45 }).observe && sections.forEach(s => {
        new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`));
                }
            });
        }, { threshold: 0.4 }).observe(s);
    });

});