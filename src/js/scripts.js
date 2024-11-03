// Utility function for debouncing
function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

function generateFlowers() {
  const sections = document.querySelectorAll('.parallax-section');
  
  sections.forEach((section, sectionIndex) => {
    const flowerGrid = section.querySelector('.flower-grid');
    if (!flowerGrid) return;
    
    flowerGrid.innerHTML = '';
    
    // Fixed number of flowers
    const flowerCount = 35;
    
    for (let i = 0; i < flowerCount; i++) {
      const flower = document.createElement('img');
      flower.className = 'flower';
      flower.src = `images/f${Math.floor(Math.random() * 13) + 1}.png`;
      
      // Only scale varies
      const scale = 0.5 + Math.random() * 0.5;
      flower.style.setProperty('--scale', scale);
      
      // Section-specific color
      const hue = (sectionIndex * 60) % 360;
      flower.style.filter = `hue-rotate(${hue}deg)`;
      
      flowerGrid.appendChild(flower);
    }
  });
}

// Handle parallax scrolling and gradient transitions
function updateParallax() {
  const sections = document.querySelectorAll('.parallax-section');
  
  // Find current section for gradient
  const currentSection = Array.from(sections).find(section => {
    const rect = section.getBoundingClientRect();
    return rect.top <= window.innerHeight/2 && rect.bottom >= window.innerHeight/2;
  }) || sections[0];

  // Update container gradient
  document.querySelector('.parallax-container').style.background = 
    getComputedStyle(currentSection).getPropertyValue('--section-gradient');
  
  // Update parallax effects
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const viewHeight = window.innerHeight;
    
    if (rect.top < viewHeight && rect.bottom > 0) {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.5;
      
      const content = section.querySelector('.section-content');
      const flowers = section.querySelectorAll('.flower');
      
      content.style.transform = `translateY(${rate * 0.2}px)`;
      
      flowers.forEach(flower => {
        const speed = parseFloat(flower.dataset.speed);
        flower.style.transform = `translate(-50%, -50%) scale(${flower.style.getPropertyValue('--scale') || 1}) translateY(${rate * speed}px)`;
      });
    }
  });
}

// Initialize everything
function init() {
  generateFlowers();
  updateParallax();
}

// Event listeners
window.addEventListener('load', init);
window.addEventListener('resize', debounce(generateFlowers, 250));
window.addEventListener('scroll', () => requestAnimationFrame(updateParallax));