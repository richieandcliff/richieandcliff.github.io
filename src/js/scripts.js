// State management
const state = {
  currentSection: null,
  scrollPosition: 0,
  observer: null,
  animationFrame: null
};

// Generate flowers for each section
function generateFlowers() {
  const sections = document.querySelectorAll('.parallax-section');
  
  sections.forEach((section, index) => {
    const flowerGrid = section.querySelector('.flower-grid');
    if (!flowerGrid) return;
    
    flowerGrid.innerHTML = '';
    const flowerCount = 35;
    
    for (let i = 0; i < flowerCount; i++) {
      const flower = document.createElement('img');
      flower.className = 'flower';
      flower.src = `images/f${Math.floor(Math.random() * 13) + 1}.png`;
      
      const scale = 0.5 + Math.random() * 0.5;
      flower.style.setProperty('--scale', scale);
      
      const hue = (index * 60) % 360;
      flower.style.filter = `hue-rotate(${hue}deg)`;
      
      flowerGrid.appendChild(flower);
    }
  });
}

// Update parallax and gradient effects
function updateParallax() {
  if (state.animationFrame) {
    cancelAnimationFrame(state.animationFrame);
  }

  state.animationFrame = requestAnimationFrame(() => {
    const scrollPosition = window.pageYOffset;
    const sections = document.querySelectorAll('.parallax-section');
    
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (inView) {
        const rate = (scrollPosition - section.offsetTop) * 0.1;
        const content = section.querySelector('.section-content');
        const flowers = section.querySelectorAll('.flower');
        
        if (content) {
          content.style.transform = `translateY(${rate * 0.2}px)`;
        }
        
        flowers.forEach(flower => {
          const speed = parseFloat(flower.dataset.speed || 0.3);
          flower.style.transform = `translateY(${rate * speed}px)`;
        });
      }
    });
  });
}

function handleIntersection(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
      const section = entry.target;
      const container = document.querySelector('.parallax-container');
      const color = getComputedStyle(section).getPropertyValue('--color');
      
      if (color && state.currentSection !== section.id) {
        state.currentSection = section.id;
        container.style.setProperty('--current-color', color);
      }
    }
  });
}
// Initialize everything
function init() {
  // Clean up existing observer
  if (state.observer) {
    state.observer.disconnect();
  }

  // Set up new intersection observer
  state.observer = new IntersectionObserver(handleIntersection, {
    threshold: [0, 0.5, 1],
    rootMargin: '0px'
  });

  // Observe all sections
  document.querySelectorAll('.parallax-section').forEach(section => {
    state.observer.observe(section);
  });

  // Generate flowers
  generateFlowers();

  // Set initial gradient
  const firstSection = document.querySelector('.parallax-section');
  if (firstSection) {
    const initialGradient = getComputedStyle(firstSection).getPropertyValue('--gradient');
    document.querySelector('.parallax-container').style.setProperty('--current-gradient', initialGradient);
  }

  // Add scroll listener
  window.addEventListener('scroll', updateParallax, { passive: true });
  window.addEventListener('resize', generateFlowers);
}

// Cleanup function
function cleanup() {
  if (state.observer) {
    state.observer.disconnect();
  }
  if (state.animationFrame) {
    cancelAnimationFrame(state.animationFrame);
  }
  window.removeEventListener('scroll', updateParallax);
  window.removeEventListener('resize', generateFlowers);
}

// Start everything when DOM is ready
document.addEventListener('DOMContentLoaded', init);
window.addEventListener('unload', cleanup);