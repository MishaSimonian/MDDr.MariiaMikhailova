document.addEventListener("DOMContentLoaded", () => {
  const imgEl = document.getElementById("single-gallery-img");
  const leftBtn = document.querySelector(".gallery-arrow-left");
  const rightBtn = document.querySelector(".gallery-arrow-right");
  const indicator = document.getElementById("single-gallery-indicator");

  if (!imgEl || !leftBtn || !rightBtn || !indicator) {
    console.warn("Not all gallery elements found!");
    return;
  }

  const galleryImages = [
    "img/MyCollages.jpg",
    "img/MyCollages (3).jpg",
    "img/MyCollages (4).jpg",
    "img/Blank 2 Grids Collage (1).png",
    "img/photo_2025-05-06_15-59-11.jpg",
    "img/photo_2025-05-06_15-59-31.jpg",
  ];

  let currentIndex = 0;
  let startX = null;
  let currentTranslate = 0;
  let dragging = false;
  let swipeHandled = false;

  function preloadNearbyImages(index) {
    [index - 1, index + 1].forEach((i) => {
      if (i >= 0 && i < galleryImages.length) {
        const img = new window.Image();
        img.src = galleryImages[i];
      }
    });
  }

  // Preload the first image
  function updateGallery() {
    imgEl.style.transition = "opacity 0.4s ease";
    imgEl.style.opacity = "0";
    setTimeout(() => {
      imgEl.src = galleryImages[currentIndex];
      imgEl.alt = `Work example ${currentIndex + 1}`;
      indicator.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
      leftBtn.disabled = currentIndex === 0;
      rightBtn.disabled = currentIndex === galleryImages.length - 1;

      // Preload the next and previous images
      preloadNearbyImages(currentIndex);

      const fadeIn = () => {
        imgEl.style.opacity = "1";
        imgEl.removeEventListener("load", fadeIn);
      };
      imgEl.addEventListener("load", fadeIn);
      setTimeout(() => {
        if (imgEl.style.opacity !== "1") fadeIn();
      }, 30);
    }, 200);
  }

  function setTranslate(x) {
    imgEl.style.transform = `translateX(${x}px)`;
  }

  function resetTranslate(withTransition = true) {
    imgEl.style.transition = withTransition ? "transform 0.3s ease" : "none";
    setTranslate(0);
    if (withTransition) {
      setTimeout(() => {
        imgEl.style.transition = "";
      }, 300);
    }
  }

  function handleSwipe(e) {
    if (!imgEl || swipeHandled) return;
    if (e.type === "pointerdown" || e.type === "touchstart") {
      dragging = true;
      startX = (e.touches ? e.touches[0] : e).clientX;
      currentTranslate = 0;
      swipeHandled = false;
      imgEl.style.transition = "none";
      if (e.type === "pointerdown" && imgEl.setPointerCapture) {
        imgEl.setPointerCapture(e.pointerId);
      }
    } else if (
      dragging &&
      (e.type === "pointermove" || e.type === "touchmove")
    ) {
      const moveX = (e.touches ? e.touches[0] : e).clientX;
      currentTranslate = moveX - startX;
      setTranslate(currentTranslate);
      if (e.cancelable) e.preventDefault();
    } else if (dragging && (e.type === "pointerup" || e.type === "touchend")) {
      dragging = false;
      swipeHandled = true;
      if (e.type === "pointerup" && imgEl.releasePointerCapture) {
        imgEl.releasePointerCapture(e.pointerId);
      }
      imgEl.style.transition = "transform 0.3s ease";
      if (currentTranslate > 60 && currentIndex > 0) {
        imgEl.style.transform = "translateX(100vw)";
        setTimeout(() => {
          currentIndex--;
          updateGallery();
          resetTranslate(false);
          swipeHandled = false;
        }, 300);
      } else if (
        currentTranslate < -60 &&
        currentIndex < galleryImages.length - 1
      ) {
        imgEl.style.transform = "translateX(-100vw)";
        setTimeout(() => {
          currentIndex++;
          updateGallery();
          resetTranslate(false);
          swipeHandled = false;
        }, 300);
      } else {
        resetTranslate();
        swipeHandled = false;
      }
      startX = null;
      currentTranslate = 0;
    } else if (e.type === "pointercancel" || e.type === "touchcancel") {
      dragging = false;
      resetTranslate();
      swipeHandled = false;
    }
  }

  ["pointerdown", "pointermove", "pointerup", "pointercancel"].forEach(
    (event) => imgEl.addEventListener(event, handleSwipe)
  );
  ["touchstart", "touchmove", "touchend", "touchcancel"].forEach((event) => {
    imgEl.addEventListener(event, handleSwipe, { passive: false });
  });

  leftBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateGallery();
    }
  });

  rightBtn.addEventListener("click", () => {
    if (currentIndex < galleryImages.length - 1) {
      currentIndex++;
      updateGallery();
    }
  });

  updateGallery();
});
