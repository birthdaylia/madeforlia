/* ── CONFIG ──────────────────────────────────────── */
const PLAY_VIDEO_ID  = 'meaTqd2BpbY';   // Video buat tombol Play
const PASSWORD       = '070821';

/* ── HELPERS ─────────────────────────────────────── */
const $  = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

function showScreen(id) {
  $$('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}

function showToast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.add('hidden'), 2800);
}

/* ── LAZY INIT FLAGS ─────────────────────────────── */
const inited = { about: false, flipbook: false, spin: false, coupons: false };

/* ── ① INTRO ──────────────────────────────────────── */
(function initIntro() {
  const screen = $('intro-screen');

  // CSS animation is 3.2s — auto-advance after it finishes (+0.4s buffer)
  const autoTimer = setTimeout(goToProfiles, 3600);

  // Tap anywhere to skip
  screen.addEventListener('click', () => {
    clearTimeout(autoTimer);
    goToProfiles();
  });

  function goToProfiles() {
    screen.style.transition = 'opacity .5s ease';
    screen.style.opacity = '0';
    setTimeout(() => showScreen('profile-screen'), 500);
  }
})();


/* ── ② PROFILES ───────────────────────────────────── */
$$('.profile-item').forEach(item => {
  item.addEventListener('click', () => {
    const name = item.dataset.name;
    if (name === 'Mpaa') {
      showScreen('password-screen');
    } else {
      showToast(`Ini bukan akunmu, sayang! Klik profil Mpaa 😄`);
    }
  });
});

/* ── ③ PASSWORD ───────────────────────────────────── */
$('back-btn').addEventListener('click', () => showScreen('profile-screen'));

function checkPassword() {
  const val = $('password-input').value;
  if (val === PASSWORD) {
    $('password-input').value = '';
    $('error-msg').classList.add('hidden');
    showScreen('app-screen');
    // Play background music
    const music = $('bg-music');
    if (music) {
      music.volume = 0.45;
      music.play().catch(() => { /* autoplay blocked, user interaction needed */ });
    }
    // Init about swiper first time
    if (!inited.about) {
      inited.about = true;
      requestAnimationFrame(initAboutSwiper);
    }
    // Confetti!
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 },
      colors: ['#E50914', '#fff', '#ffcc00', '#ff6b6b'] });
  } else {
    const inp = $('password-input');
    $('error-msg').classList.remove('hidden');
    inp.value = '';
    inp.style.animation = 'none';
    requestAnimationFrame(() => { inp.style.animation = 'shake .4s ease'; });
  }
}

$('unlock-btn').addEventListener('click', checkPassword);
$('password-input').addEventListener('keypress', e => { if (e.key === 'Enter') checkPassword(); });

/* ── ④ TOP NAV ────────────────────────────────────── */
$$('.ntab').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.ntab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const secId = btn.dataset.sec;
    $$('.app-sec').forEach(s => {
      s.classList.toggle('hidden', s.id !== secId);
      if (s.id === secId) s.classList.add('active'); else s.classList.remove('active');
    });

    // Lazy init
    if (secId === 'episodes-section' && !inited.flipbook) {
      inited.flipbook = true;
      requestAnimationFrame(initFlipbook);
    }
    if (secId === 'spin-section' && !inited.spin) {
      inited.spin = true;
      requestAnimationFrame(initSpinWheel);
    }
    if (secId === 'coupons-section' && !inited.coupons) {
      inited.coupons = true;
      requestAnimationFrame(initCoupons);
    }
  });
});

/* SUB TABS (Overview / Trailer inside Home) */
$$('.stab').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.stab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const panelId = btn.dataset.panel;
    $$('.panel').forEach(p => {
      p.classList.toggle('hidden', p.id !== panelId);
      p.classList.toggle('active', p.id === panelId);
    });
  });
});

/* ── PLAY BUTTON & VIDEO MODAL ───────────────────── */
$('play-btn').addEventListener('click', () => {
  $('video-modal').classList.remove('hidden');
  $('video-iframe').src =
    `https://www.youtube.com/embed/${PLAY_VIDEO_ID}?autoplay=1&playsinline=1&rel=0`;
});

$('close-modal').addEventListener('click', () => {
  $('video-modal').classList.add('hidden');
  $('video-iframe').src = '';  // Stop video
});

/* More Info → switch to About tab */
$('info-btn').addEventListener('click', () => {
  const aboutTab = document.querySelector('.ntab[data-sec="about-section"]');
  if (aboutTab) aboutTab.click();
});

/* ── PROFILE CARD: SEND LOVE ─────────────────────── */
document.addEventListener('click', e => {
  if (e.target && e.target.id === 'pc-contact-btn') {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 },
      colors: ['#E50914', '#ff6b6b', '#fff', '#ffcc00', '#ff85a1'] });
    showToast('Udah dikirim! Cinta dari aku buat kamu 💌');
  }
});

/* ── FEATURE: ABOUT YOU SWIPER ───────────────────── */
function initAboutSwiper() {
  const wrapper = document.querySelector('.mySwiper .swiper-wrapper');
  const reasons = [
    {
      img: 'about/card-1.jpg',
      icon: '🩷',
      title: 'Pink',
      text: 'Pink isn\'t just your favorite color — it\'s your whole aesthetic, your vibe, your energy. Everything looks better when it\'s pink, and so do you.',
    },
    {
      img: 'about/card-2.jpg',
      icon: '🍰',
      title: 'Sweet Things',
      text: 'Your eyes literally light up whenever there\'s dessert nearby. Watching you enjoy something sweet is honestly one of the most adorable things ever.',
    },
    {
      img: 'about/card-3.jpg',
      icon: '🌸',
      title: 'Beautiful Places',
      text: 'You have this magical ability to find the most beautiful, aesthetic spots everywhere you go. The world looks prettier through your eyes.',
    },
    {
      img: 'about/card-4.jpg',
      icon: '🐈',
      title: 'Emeng',
      text: 'Emeng has your whole heart and honestly, fair enough. Watching you melt every time you see that little cat is the cutest thing in the world.',
    },
    {
      img: 'about/card-5.jpg',
      icon: '🥰',
      title: 'Me (Obviously)',
      text: 'Well, according to you at least — and I\'m not complaining. Your taste is impeccable and I promise to always be worth your love. 😏',
    },
  ];
  reasons.forEach(r => {
    const s = document.createElement('div');
    s.className = 'swiper-slide';
    s.innerHTML = `
      <div class="slide-img-wrap">
        <img src="${r.img}" alt="${r.title}" class="slide-img"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <span class="slide-emoji-fallback">${r.icon}</span>
      </div>
      <h3>${r.title}</h3>
      <p>${r.text}</p>
    `;
    wrapper.appendChild(s);
  });
  new Swiper('.mySwiper', {
    grabCursor: true, centeredSlides: true,
    slidesPerView: 1.08, spaceBetween: 14,
    pagination: { el: '.swiper-pagination', clickable: true },
  });
}

/* ── FEATURE: FLIPBOOK (nyapi style) ─────────────── */
function initFlipbook() {
  const book    = $('fb-book');
  const prevBtn = $('fb-prev-btn');
  const nextBtn = $('fb-next-btn');

  if (!book || !prevBtn || !nextBtn) return;

  const papers = [
    $('fb-p1'), $('fb-p2'), $('fb-p3'),
    $('fb-p4'), $('fb-p5'), $('fb-p6'), $('fb-p7'),
  ];
  const numPapers   = papers.length;  // 7
  const maxLocation = numPapers + 1;  // 8
  let currentLocation = 1;

  function openBook() {
    book.style.transform = 'translateX(50%)';
  }
  function closeBook(isAtBeginning) {
    book.style.transform = isAtBeginning ? 'translateX(0%)' : 'translateX(100%)';
  }

  function goNextPage() {
    if (currentLocation >= maxLocation) return;
    switch (currentLocation) {
      case 1: openBook(); papers[0].classList.add('fb-flipped'); papers[0].style.zIndex = 1; break;
      case 2:             papers[1].classList.add('fb-flipped'); papers[1].style.zIndex = 2; break;
      case 3:             papers[2].classList.add('fb-flipped'); papers[2].style.zIndex = 3; break;
      case 4:             papers[3].classList.add('fb-flipped'); papers[3].style.zIndex = 4; break;
      case 5:             papers[4].classList.add('fb-flipped'); papers[4].style.zIndex = 5; break;
      case 6:             papers[5].classList.add('fb-flipped'); papers[5].style.zIndex = 6; break;
      case 7: papers[6].classList.add('fb-flipped'); papers[6].style.zIndex = 7; closeBook(false); break;
    }
    currentLocation++;
    updateUI();
  }

  function goPrevPage() {
    if (currentLocation <= 1) return;
    switch (currentLocation) {
      case 2: closeBook(true); papers[0].classList.remove('fb-flipped'); papers[0].style.zIndex = 7; break;
      case 3:                  papers[1].classList.remove('fb-flipped'); papers[1].style.zIndex = 6; break;
      case 4:                  papers[2].classList.remove('fb-flipped'); papers[2].style.zIndex = 5; break;
      case 5:                  papers[3].classList.remove('fb-flipped'); papers[3].style.zIndex = 4; break;
      case 6:                  papers[4].classList.remove('fb-flipped'); papers[4].style.zIndex = 3; break;
      case 7:                  papers[5].classList.remove('fb-flipped'); papers[5].style.zIndex = 2; break;
      case 8: openBook();      papers[6].classList.remove('fb-flipped'); papers[6].style.zIndex = 1; break;
    }
    currentLocation--;
    updateUI();
  }

  function updateUI() {
    // Update page indicator
    const curEl = $('fb-cur-page');
    const maxEl = $('fb-max-page');
    const pageNum = Math.max(1, Math.min(currentLocation, numPapers * 2));
    if (curEl) curEl.textContent = pageNum;
    if (maxEl) maxEl.textContent = numPapers * 2;

    // Disable buttons at boundaries
    prevBtn.disabled = currentLocation <= 1;
    nextBtn.disabled = currentLocation >= maxLocation;
  }

  nextBtn.addEventListener('click', goNextPage);
  prevBtn.addEventListener('click', goPrevPage);

  // Init state
  updateUI();
}


/* ── FEATURE: SPIN WHEEL ─────────────────────────── */
function initSpinWheel() {
  const wheel   = $('wheel');
  const spinBtn = $('spin-btn');

  // ── Revisi items ──
  const gifts  = ['MPA stiker tengah', 'MPA stiker kanan', 'MPA hampir Kotak', 'Pelangi Kotak', 'Pelangi Tipis'];
  // Alternating pink & pure white
  const colors = ['#FE5901', '#8338EC', '#ff4d6d', '#FCF2E8', '#FFC100'];
  const textColors = ['#ffffff', '#fafafa', '#000000', '#000000', '#ffffff'];

  const n = gifts.length;          // 5
  const sliceA = 360 / n;          // 72° per slice

  // conic-gradient background with a thin dark pink separator (1.5deg) so adjacent pinks don't blend
  const parts = gifts.map((_, i) => {
    const start = i * sliceA;
    const end = (i + 1) * sliceA;
    return `${colors[i]} ${start}deg ${end - 1.5}deg, #b02a5c ${end - 1.5}deg ${end}deg`;
  });
  wheel.style.background = `conic-gradient(from 0deg, ${parts.join(', ')})`;

  // Labels — centered in each slice
  // Technique: start at wheel center (top:50%, left:50%),
  // rotate to slice's bisecting angle, then translateX(dist)
  // so text moves ALONG that rotated direction = visually centered in slice.
  gifts.forEach((g, i) => {
    const lbl = document.createElement('div');
    const angle = i * sliceA + sliceA / 2;   // center angle of this slice
    Object.assign(lbl.style, {
      position:     'absolute',
      top:          '50%',
      left:         '50%',
      width:        '72px',
      transformOrigin: '0 0',
      // rotate to slice direction → move 30px out → center vertically
      transform:    `rotate(${angle}deg) translateX(28px) translateY(-50%)`,
      textAlign:    'center',
      fontWeight:   '700',
      fontSize:     '8.5px',
      lineHeight:   '1.35',
      color:        textColors[i],
      whiteSpace:   'normal',
      wordBreak:    'break-word',
      pointerEvents:'none',
      textShadow:   i % 2 === 0 ? '0 1px 3px rgba(0,0,0,.5)' : '0 1px 2px rgba(192,67,106,.25)',
    });
    lbl.innerText = g;
    wheel.appendChild(lbl);
  });

  let rotation = 0, spinning = false;

  spinBtn.addEventListener('click', () => {
    if (spinning) return;
    spinning = true; spinBtn.disabled = true;
    $('wheel-result').classList.add('hidden');

    const extra = (Math.floor(Math.random() * 5) + 7) * 360 + Math.floor(Math.random() * 360);
    rotation += extra;
    wheel.style.transform = `rotate(${rotation}deg)`;

    setTimeout(() => {
      const norm  = ((rotation % 360) + 360) % 360;
      const atTop = (360 - norm + 270) % 360;
      const idx   = Math.floor(atTop / sliceA) % n;
      $('result-text').innerText = gifts[idx];
      $('wheel-result').classList.remove('hidden');
      confetti({ particleCount: 80, spread: 60, colors: ['#E50914','#fff','#ffcc00'] });
      spinning = false; spinBtn.disabled = false;
    }, 4200);
  });
}


/* ── FEATURE: SCRATCH COUPONS ────────────────────── */
function initCoupons() {
  const wrap = document.querySelector('.coupons-wrap');
  const list = [
    { icon:'🎬', t:'Voucher Nonton',  d:'Bebas pilih film yang mau ditonton minggu ini!' },
    { icon:'💆', t:'Free Pijat',      d:'Pijat bahu & punggung 15 menit, no debat.' },
    { icon:'😤', t:'Bebas Ngambek',   d:'Berlaku 1 hari — aku yang minta maaf duluan.' },
  ];

  list.forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'coupon';
    div.innerHTML = `
      <div class="c-icon">${c.icon}</div>
      <div><div class="c-title">${c.t}</div><div class="c-desc">${c.d}</div></div>
      <canvas class="scratch-canvas" id="sc-${i}"></canvas>`;
    wrap.appendChild(div);

    const canvas = div.querySelector('canvas');
    const ctx    = canvas.getContext('2d');

    requestAnimationFrame(() => {
      setTimeout(() => {
        canvas.width  = div.offsetWidth;
        canvas.height = div.offsetHeight;
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#E50914';
        ctx.fillRect(0, 0, 4, canvas.height);
        ctx.fillStyle = '#555';
        ctx.font = 'bold 13px Inter,sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✦  GOSOK DI SINI  ✦', canvas.width / 2, canvas.height / 2 + 5);
      }, 300);
    });

    let drawing = false;
    const pos = e => {
      const r = canvas.getBoundingClientRect();
      const s = e.touches ? e.touches[0] : e;
      return { x: s.clientX - r.left, y: s.clientY - r.top };
    };
    const draw = p => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath(); ctx.arc(p.x, p.y, 22, 0, Math.PI * 2); ctx.fill();
    };
    canvas.addEventListener('mousedown',  e => { drawing = true; draw(pos(e)); });
    canvas.addEventListener('mousemove',  e => { if (drawing) draw(pos(e)); });
    canvas.addEventListener('mouseup',    () => drawing = false);
    canvas.addEventListener('mouseleave', () => drawing = false);
    canvas.addEventListener('touchstart', e => { drawing = true; e.preventDefault(); draw(pos(e)); }, { passive:false });
    canvas.addEventListener('touchmove',  e => { if (drawing) { e.preventDefault(); draw(pos(e)); } }, { passive:false });
    canvas.addEventListener('touchend',   () => drawing = false);
  });
}
