document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     Hamburger Menu Toggle
  ========================= */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('show');
  });

  /* =========================
     Horizontal Scroller (Client)
  ========================= */
  let isScrolling = false;
  let scrollInterval = null;

  const container = document.getElementById("clientScroller");
  const track = document.getElementById("scrollTrack");

  function updateScrollbar() {
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const percent = (scrollLeft / maxScroll) * 100;
    track.style.width = `${percent}%`;
  }

  function startCreatorAutoScroll() {
    if (scrollInterval) return;
    scrollInterval = setInterval(() => {
      container.scrollLeft += 2;
      updateScrollbar();
    }, 10);
  }

  function stopCreatorAutoScroll() {
    clearInterval(scrollInterval);
    scrollInterval = null;
  }

  let lastScrollY = window.scrollY;
  setInterval(() => {
    const currentY = window.scrollY;
    if (currentY !== lastScrollY) {
      isScrolling = true;
      startCreatorAutoScroll();
      lastScrollY = currentY;
    } else if (isScrolling) {
      isScrolling = false;
      stopCreatorAutoScroll();
    }
  }, 150);

  document.querySelector('.scroll-btn.left').addEventListener('click', () => {
    container.scrollBy({ left: -200, behavior: 'smooth' });
  });

  document.querySelector('.scroll-btn.right').addEventListener('click', () => {
    container.scrollBy({ left: 200, behavior: 'smooth' });
  });

  container.addEventListener("scroll", updateScrollbar);
/* =========================
   Counter Animation (Once When Visible)
========================= */
const counter = document.getElementById("viewCounter");
const counterEnd = 30000000; 
const counterDuration = 2000;
let hasAnimated = false;

function animateCounter(element, end, duration) {
  let currentFrame = 0;
  const frameRate = 60;
  const totalFrames = Math.round((duration / 1000) * frameRate);
  const increment = end / totalFrames;

  const interval = setInterval(() => {
    currentFrame++;
    const value = Math.round(increment * currentFrame);

  
    element.textContent = value.toLocaleString("en-IN");

    if (currentFrame >= totalFrames) {
      clearInterval(interval);
      element.textContent = end.toLocaleString("en-IN"); 
      }
  }, 1000 / frameRate);
}

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !hasAnimated) {
      animateCounter(counter, counterEnd, counterDuration);
      hasAnimated = true;
      observer.unobserve(counter);
    }
  });
}, { threshold: 0.5 });

if (counter) observer.observe(counter);


  /* =========================
     Services Grid Expansion
  ========================= */
  const services = [
    { title: "Viral Social Media Content", desc: "Create buzzworthy and engaging content that spreads like wildfire.", img: "ExperienceMedia-assets/services/viral-socialmedia.png" },
    { title: "Podcast Production Service", desc: "Professional audio production and editing for captivating podcasts.", img: "ExperienceMedia-assets/services/podcast-prodservice.png" },
    { title: "VFX And CGI", desc: "High-quality visual effects and computer graphics for stunning visuals.", img: "ExperienceMedia-assets/services/vfx-cgi.png" },
    { title: "Storytelling Documentary", desc: "Craft compelling documentaries that inspire and inform.", img: "ExperienceMedia-assets/services/storytelling-documentary.png" },
    { title: "Event Photography & Videography", desc: "Capture memorable moments from your events in high definition.", img: "ExperienceMedia-assets/services/Event-Photography-Videography.png" },
    { title: "Strategic Content Consultancy", desc: "Consulting for effective and results-driven content strategies.", img: "ExperienceMedia-assets/services/Strategic-Content-Consultancy.png" },
    { title: "Music Videos", desc: "Creative and visually striking music videos for artists and labels.", img: "ExperienceMedia-assets/services/Music-Videos.png" },
    { title: "Ad Production Service", desc: "Compelling ads with cinematic precision and marketing impact.", img: "ExperienceMedia-assets/services/Add-Production-Service.png" },
    { title: "Team Training & System Enhancement", desc: "Upskill your team and optimize workflows.", img: "ExperienceMedia-assets/services/Team-Training-System-Enhancement.png" }
  ];

  const grid = document.getElementById("servicesGrid");
  services.forEach(service => {
    const card = document.createElement("div");
    card.classList.add("services-card");
    card.innerHTML = `
      <img src="${service.img}" alt="${service.title}" />
      <div class="card-content">
        <h2>${service.title}</h2>
        <p>${service.desc}</p>
      </div>
    `;

    card.addEventListener("click", () => {
      document.querySelectorAll(".services-card").forEach(c => {
        if (c !== card) c.classList.remove("expanded");
      });
      card.classList.toggle("expanded");

      if (card.classList.contains("expanded")) {
        setTimeout(() => {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
    });

    grid.appendChild(card);
  });

  /* =========================
     Testimonial Carousel Horizontal Scroll
  ========================= */
  const carousel = document.getElementById('testimonialCarousel');
  let testimonialLastScrollY = window.scrollY;
  let testimonialScrollTimer = null;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY !== testimonialLastScrollY) {
      if (carousel) carousel.scrollLeft += 1.5;
      testimonialLastScrollY = currentScrollY;

      clearTimeout(testimonialScrollTimer);
      testimonialScrollTimer = setTimeout(() => {}, 150);
    }
  });

  const pauseAndScroll = (offset) => {
    if (carousel) carousel.scrollBy({ left: offset, behavior: 'smooth' });
  };

  document.querySelector('.testimonial-scroll-btn.left')?.addEventListener('click', () => pauseAndScroll(-400));
  document.querySelector('.testimonial-scroll-btn.right')?.addEventListener('click', () => pauseAndScroll(400));
});
