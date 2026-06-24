const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('show');
});

document.addEventListener('DOMContentLoaded', function () {
  const grid = document.querySelector('.short-grid');
  if (!grid) return;

  let scrollInterval = null;

  function startAutoScroll() {
    if (scrollInterval) return;

    scrollInterval = setInterval(() => {
      const maxScrollLeft = grid.scrollWidth - grid.clientWidth;

      // move a tiny bit each frame
      grid.scrollLeft += 1;

      // if we hit the end, loop back to start
      if (grid.scrollLeft >= maxScrollLeft - 2) {
        grid.scrollLeft = 0;
      }
    }, 16); // ~60fps
  }

  function stopAutoScroll() {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = null;
    }
  }

  // helper: check if grid is visible in viewport
  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  // start auto-scroll initially
  startAutoScroll();

  // --- STOP auto-scroll on USER INTERACTION ---

  // Any direct interaction with the strip (good for mobile + desktop)
  ['touchstart', 'pointerdown', 'mousedown', 'wheel'].forEach((eventName) => {
    grid.addEventListener(
      eventName,
      () => {
        stopAutoScroll();
      },
      { passive: true }
    );
  });

  // Also keep hover behavior for desktop users
  grid.addEventListener('mouseenter', stopAutoScroll);
  grid.addEventListener('mouseleave', startAutoScroll);

  // When the user scrolls the page and the short-grid is in view,
  // stop the auto-scroll so they can immediately swipe horizontally
  window.addEventListener(
    'scroll',
    () => {
      if (isInViewport(grid)) {
        stopAutoScroll();
      }
    },
    { passive: true }
  );
});
