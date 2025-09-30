document.addEventListener("DOMContentLoaded", () => {
  // Generate random cat images
  const catImages = Array.from({ length: 8 }, (_, i) =>
    `https://cataas.com/cat?width=400&height=500&t=${Date.now() + i}`
  );

  let currentIndex = 0;
  let likedCats = [];

  const cardContainer = document.getElementById("card-container");
  const summary = document.getElementById("summary");
  const summaryText = document.getElementById("summary-text");
  const likedCatsContainer = document.getElementById("liked-cats");
  const app = document.querySelector(".app");
  const restartBtn = document.querySelector(".restart");

  // Create a single card
  function createCard(imageUrl) {
    const card = document.createElement("div");
    card.className = "card";
    card.style.backgroundImage = `url(${imageUrl})`;

    cardContainer.innerHTML = ""; // clear previous card
    cardContainer.appendChild(card);

    let offsetX = 0;
    let isDragging = false;

    // Mouse drag
    card.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX;
    });

    document.addEventListener("mouseup", (e) => {
      if (!isDragging) return;
      isDragging = false;
      const diffX = e.clientX - offsetX;
      if (diffX > 100) handleSwipe("like", imageUrl, card);
      else if (diffX < -100) handleSwipe("dislike", imageUrl, card);
      else card.style.transform = "translateX(0)";
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const diffX = e.clientX - offsetX;
      card.style.transform = `translateX(${diffX}px) rotate(${diffX / 10}deg)`;
    });

    // Touch support
    card.addEventListener("touchstart", (e) => {
      offsetX = e.touches[0].clientX;
    });

    card.addEventListener("touchmove", (e) => {
      const diffX = e.touches[0].clientX - offsetX;
      card.style.transform = `translateX(${diffX}px) rotate(${diffX / 10}deg)`;
    });

    card.addEventListener("touchend", (e) => {
      const diffX = e.changedTouches[0].clientX - offsetX;
      if (diffX > 100) handleSwipe("like", imageUrl, card);
      else if (diffX < -100) handleSwipe("dislike", imageUrl, card);
      else card.style.transform = "translateX(0)";
    });
  }

  // Handle swipe action
  function handleSwipe(action, imageUrl, card) {
    if (action === "like") likedCats.push(imageUrl);

    card.style.transition = "transform 0.5s ease, opacity 0.5s ease";
    card.style.transform =
      action === "like" ? "translateX(1000px)" : "translateX(-1000px)";
    card.style.opacity = "0";

    setTimeout(() => {
      currentIndex++;
      if (currentIndex < catImages.length) {
        createCard(catImages[currentIndex]);
      } else {
        showSummary();
      }
    }, 400);
  }

  // Show summary
  function showSummary() {
    app.classList.add("hidden");
    summary.classList.remove("hidden");

    summaryText.textContent = `You liked ${likedCats.length} out of ${catImages.length} cats 🐱💖`;

    likedCatsContainer.innerHTML = "";
    likedCats.forEach((url) => {
      const img = document.createElement("img");
      img.src = url;
      likedCatsContainer.appendChild(img);
    });
  }

  // Restart app
  restartBtn.addEventListener("click", () => {
    likedCats = [];
    currentIndex = 0;
    summary.classList.add("hidden");
    app.classList.remove("hidden");
    createCard(catImages[currentIndex]);
  });

  // Button actions
  document.querySelector(".like").addEventListener("click", () => {
    const currentCard = document.querySelector(".card");
    if (currentCard) handleSwipe("like", catImages[currentIndex], currentCard);
  });

  document.querySelector(".dislike").addEventListener("click", () => {
    const currentCard = document.querySelector(".card");
    if (currentCard)
      handleSwipe("dislike", catImages[currentIndex], currentCard);
  });

  // Initialize first card
  createCard(catImages[currentIndex]);
});
