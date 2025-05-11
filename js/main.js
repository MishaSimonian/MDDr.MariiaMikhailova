document.addEventListener("DOMContentLoaded", () => {
  const logoPath = document.querySelector("svg path");

  function restartAnimation(element, animationName) {
    element.style.animation = "none";
    void element.offsetWidth;
    element.style.animation = animationName;
  }

  if (logoPath) {
    restartAnimation(
      logoPath,
      "stroke-dasharray-animation 3s ease-out forwards"
    );
  }
});
