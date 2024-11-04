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


// src/js/scripts.js

// Update parallax and gradient effects
function updateParallax() {
  const sections = document.querySelectorAll('.parallax-section');
  const scrollPosition = window.pageYOffset;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;

    if (inView) {
      const rate = (scrollPosition - section.offsetTop) * 0.5;

      // Parallax effect for content
      const content = section.querySelector('.section-content');
      if (content) {
        content.style.transform = `translateY(${rate * 0.2}px)`;
      }

      // Parallax effect for shapes
      const shapes = section.querySelectorAll('.shape');
      shapes.forEach((shape) => {
        const speed = parseFloat(shape.dataset.speed || 0.25);
        const translateY = rate * speed;
        shape.style.transform = `translateY(${translateY}px)`;
      });

      // Parallax effect for flowers
      const flowers = section.querySelectorAll('.flower');
      flowers.forEach((flower) => {
        const speed = parseFloat(flower.dataset.speed || 0.3);
        const scale = flower.style.getPropertyValue('--scale') || 1;
        flower.style.transform = `translateY(${rate * speed}px) scale(${scale})`;
      });
    }
  });
}

// src/js/scripts.js

// Generate shapes for each section
function generateShapes() {
  const sections = document.querySelectorAll('.parallax-section');

  sections.forEach((section) => {
    const shapeContainer = section.querySelector('.shape-container');
    if (!shapeContainer) return;

    shapeContainer.innerHTML = '';

    // Get the background color from the section's CSS variable
    const sectionStyle = getComputedStyle(section);
    const backgroundColor = sectionStyle.getPropertyValue('--color').trim();

    // Convert HEX color to RGBA with increased opacity
    function hexToRGBA(hex, opacity) {
      // Remove '#' if present
      hex = hex.replace('#', '');
      // Parse r, g, b values
      const bigint = parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // Set shape color with desired opacity (e.g., 0.3 for more opacity)
    const shapeColor = hexToRGBA(backgroundColor, 0.8); // Adjust opacity as needed

    // Define shapes with positions, sizes, and speeds
    const shapes = [
      { size: 400, top: '30%', left: '20%', speed: 0.3 },
      { size: 250, top: '70%', left: '60%', speed: 0.3 }
    ];

    // Create and append shapes
    shapes.forEach((shapeData) => {
      const shape = document.createElement('div');
      shape.className = 'shape';
      shape.style.width = `${shapeData.size}px`;
      shape.style.height = `${shapeData.size}px`;
      shape.style.backgroundColor = shapeColor;
      shape.style.top = shapeData.top;
      shape.style.left = shapeData.left;
      shape.dataset.speed = shapeData.speed;

      shapeContainer.appendChild(shape);
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

/*
function generateShapes() {
  const sections = document.querySelectorAll('.parallax-section');

  sections.forEach((section) => {
    const shapeContainer = section.querySelector('.shape-container');
    if (!shapeContainer) return;

    shapeContainer.innerHTML = '';

    const shapes = []; // Define shapes for each section

    // Example shapes for each section
    if (section.id === 'welcome') {
      shapes.push({ size: 400, color: '#FF6B6B', top: '30%', left: '20%', speed: 0.3 });
      shapes.push({ size: 250, color: '#4ECDC4', top: '70%', left: '60%', speed: 0.3 });
    }

    // Add shapes for other sections
    if (section.id === 'when') {
      shapes.push({ size: 350, color: '#45B7D1', top: '40%', left: '25%', speed: 0.3 });
      shapes.push({ size: 200, color: '#96C93D', top: '65%', left: '55%', speed: 0.3 });
    }

    shapes.forEach((shapeData) => {
      const shape = document.createElement('div');
      shape.className = 'shape';
      shape.style.width = `${shapeData.size}px`;
      shape.style.height = `${shapeData.size}px`;
      shape.style.backgroundColor = shapeData.color;
      shape.style.top = shapeData.top;
      shape.style.left = shapeData.left;
      shape.dataset.speed = shapeData.speed;

      shapeContainer.appendChild(shape);
    });
  });
}
  */
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
  generateShapes();
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