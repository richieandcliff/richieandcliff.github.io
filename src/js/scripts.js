// Function to generate random flower grid
function generateFlowerGrid() {
  const sections = document.getElementsByClassName('parallax-section');
  const totalFlowers = 56; // 7 columns × 8 rows
  
  Array.from(sections).forEach(section => {
    const flowerGrid = section.querySelector('.flower-grid');
    if (!flowerGrid) return;
    
    // Clear existing flowers
    flowerGrid.innerHTML = '';
    
    // Generate flowers
    for (let i = 0; i < totalFlowers; i++) {
      const randomFlowerNum = Math.floor(Math.random() * 13) + 1; // Random number 1-13
      const randomSpeed = (Math.random() * 0.3 + 0.2).toFixed(2); // Random speed between 0.2 and 0.5
      const randomDelay = (Math.random() * 12).toFixed(2); // Random animation delay
      const randomScale = (Math.random() * 0.4 + 0.8).toFixed(2); // Random scale between 0.8 and 1.2
      
      const flower = document.createElement('img');
      flower.src = `images/f${randomFlowerNum}.png`;
      flower.className = 'flower';
      flower.setAttribute('data-speed', randomSpeed);
      flower.style.setProperty('--delay', randomDelay);
      flower.style.transform = `scale(${randomScale})`;
      flower.alt = `Decorative flower ${randomFlowerNum}`;
      
      flowerGrid.appendChild(flower);
    }
  });
}

// Run on page load
document.addEventListener('DOMContentLoaded', generateFlowerGrid);

// Optional: Regenerate on page refresh or when needed
window.addEventListener('resize', generateFlowerGrid);

window.addEventListener('scroll', function() {
  var scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

  var sections = document.getElementsByClassName('parallax-section');
  for (var i = 0; i < sections.length; i++) {
    var section = sections[i];
    var offset = section.offsetTop;
    var speed = section.dataset.speed;

    var parallaxEffect = (offset - scrollPosition) * speed;
    section.style.backgroundPositionY = parallaxEffect + 'px';

    var flowers = section.getElementsByClassName('flower');
    for (var j = 0; j < flowers.length; j++) {
      var flower = flowers[j];
      var flowerSpeed = flower.dataset.speed;
      var flowerEffect = (scrollPosition - offset) * flowerSpeed;
      flower.style.transform = 'translateY(' + flowerEffect + 'px)';
    }
  }
});