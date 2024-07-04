const $cardContainer = document.querySelector("#card-container");
const $submitButton = document.querySelector(".submit");
const ratingBts = document.querySelectorAll("li[data-rating]");

let rating;

ratingBts.forEach((bt) => {
  bt.addEventListener("click", (e) => {
    ratingBts.forEach((bt) => {
      bt.classList.remove("active");
    });

    rating = e.target.dataset.rating;
    e.target.classList.add("active");
  });
});

$submitButton.addEventListener("click", () => {
  if (rating) {
    const newUrl = `${window.location.pathname}?rating=${rating}`;
    history.pushState({}, "", newUrl);

    window.parent.postMessage({ action: "updateURL", payload: newUrl }, "*");
    showThankYouState();
  }
});

function showThankYouState() {
  $cardContainer.style.display = "block";
  $cardContainer.innerHTML = cardThankYouState({ rating });
}

window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  rating = params.get("rating");

  if (rating) {
    showThankYouState();
  }
};

function cardThankYouState({ rating }) {
  return `
    <main class="rating-end">
      <header>
        <img
          src="./assets/illustration-thank-you.svg"
          alt="illustration thank you"
        />
        <p class="rating">You selected <span id="rating">${rating}</span> out of 5</p>
        <h1>Thank you!</h1>
        <p>
          We appreciate you taking the time to give a rating. If you ever need
          more support, don’t hesitate to get in touch!
        </p>
      </header>
    </main>
  `;
}
