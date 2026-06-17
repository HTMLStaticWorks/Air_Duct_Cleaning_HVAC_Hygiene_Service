// main.js - AeroPure HVAC Hygiene Shared JavaScript Logic

document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  initTheme();
  initRTL();
  initMobileMenu();
  initBeforeAfterSliders();
  initCounters();
});

// --- Theme Toggle ---
function initTheme() {
  const themeToggles = document.querySelectorAll('.theme-toggle');
  
  // Apply saved theme or system default
  const savedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  updateThemeIcons();
  
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      const isDark = document.documentElement.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateThemeIcons();
    });
  });
}

function updateThemeIcons() {
  const isDark = document.documentElement.classList.contains('dark');
  const sunIcons = document.querySelectorAll('.sun-icon');
  const moonIcons = document.querySelectorAll('.moon-icon');
  
  if (isDark) {
    sunIcons.forEach(icon => icon.classList.remove('hidden'));
    moonIcons.forEach(icon => icon.classList.add('hidden'));
  } else {
    sunIcons.forEach(icon => icon.classList.add('hidden'));
    moonIcons.forEach(icon => icon.classList.remove('hidden'));
  }
}

// --- RTL (Right-to-Left) Toggle ---
function initRTL() {
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  
  // Apply saved direction or default to LTR
  const savedDir = localStorage.getItem('dir') || 'ltr';
  document.documentElement.setAttribute('dir', savedDir);
  updateRTLButtons(savedDir);
  
  rtlToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir');
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('dir', newDir);
      updateRTLButtons(newDir);
    });
  });
}

function updateRTLButtons(dir) {
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  rtlToggles.forEach(toggle => {
    if (dir === 'rtl') {
      toggle.classList.add('bg-brand-primary', 'text-white', 'border-brand-primary', 'dark:border-brand-primary');
      toggle.classList.remove('text-slate-600', 'dark:text-slate-300', 'border-slate-200', 'dark:border-slate-800');
    } else {
      toggle.classList.remove('bg-brand-primary', 'text-white', 'border-brand-primary', 'dark:border-brand-primary');
      toggle.classList.add('text-slate-600', 'dark:text-slate-300', 'border-slate-200', 'dark:border-slate-800');
    }
  });

  const rtlLabels = document.querySelectorAll('.rtl-label');
  rtlLabels.forEach(label => {
    // Show EN for RTL switch, show AR for LTR switch (Arabic / English demo toggle)
    if (dir === 'rtl') {
      label.textContent = 'LTR';
      document.title = document.title.includes(' (RTL)') ? document.title : document.title + ' (RTL)';
    } else {
      label.textContent = 'RTL';
      if (document.title.includes(' (RTL)')) {
        document.title = document.title.replace(' (RTL)', '');
      }
    }
  });
}

// --- Mobile Hamburger Menu ---
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menuContainer = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');
  
  if (menuBtn && menuContainer) {
    menuBtn.addEventListener('click', () => {
      menuContainer.classList.remove('hidden');
      menuContainer.classList.add('flex');
      setTimeout(() => {
        menuContainer.classList.remove('opacity-0', '-translate-y-4');
      }, 10);
    });
  }
  
  if (closeBtn && menuContainer) {
    closeBtn.addEventListener('click', () => {
      menuContainer.classList.add('opacity-0', '-translate-y-4');
      setTimeout(() => {
        menuContainer.classList.add('hidden');
        menuContainer.classList.remove('flex');
      }, 300);
    });
  }
  
  // Close menu when clicking links
  const mobileLinks = menuContainer ? menuContainer.querySelectorAll('a') : [];
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (menuContainer) {
        menuContainer.classList.add('opacity-0', '-translate-y-4');
        setTimeout(() => {
          menuContainer.classList.add('hidden');
          menuContainer.classList.remove('flex');
        }, 300);
      }
    });
  });
}

// --- Before & After Image Sliders ---
function initBeforeAfterSliders() {
  const sliders = document.querySelectorAll('.comparison-slider');
  
  sliders.forEach(slider => {
    const rangeInput = slider.querySelector('.slider-range');
    const resizeContainer = slider.querySelector('.resize-container');
    const handle = slider.querySelector('.slider-handle');
    
    if (rangeInput && resizeContainer && handle) {
      // Set initial state
      resizeContainer.style.width = rangeInput.value + '%';
      handle.style.left = rangeInput.value + '%';
      
      // Update on range input
      rangeInput.addEventListener('input', (e) => {
        const value = e.target.value;
        resizeContainer.style.width = value + '%';
        handle.style.left = value + '%';
      });
    }
  });
}

// --- Animated Stats Counters ---
function initCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  
  const runCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const duration = 1500; // 1.5 seconds animation
    const step = target / (duration / 16); // 60fps refresh rate
    let current = 0;
    
    const update = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.ceil(current);
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    };
    
    update();
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}
