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
      var flowerEffect = (offset - scrollPosition) * flowerSpeed;
      flower.style.transform = 'translateY(' + flowerEffect + 'px)';
    }
  }
});