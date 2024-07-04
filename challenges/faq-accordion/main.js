const $toggleAccordion = document.querySelectorAll(".toggle-accordion");
let $content = document.querySelector(".toggle-accordion p");
let $firstIcon = document.querySelector(".toggle-accordion button img");

$toggleAccordion.forEach((element) => {
  const $button = element.querySelector("header button");

  const hangleAccordion = () => {
    const $paragraph = element.querySelector("p");
    const $icon = element.querySelector("button img");

    if ($paragraph === $content && !$paragraph.classList.contains("hidden")) {
      $content.setAttribute("hidden", "");
      $firstIcon.setAttribute("src", "./assets/images/icon-plus.svg");
      $content = null;
      $firstIcon = null;
      return;
    }

    if (
      $content &&
      $content !== $paragraph &&
      $firstIcon &&
      $firstIcon !== $icon
    ) {
      $content.setAttribute("hidden", "");
      $firstIcon.setAttribute("src", "./assets/images/icon-plus.svg");
    }

    $paragraph.removeAttribute("hidden");
    animateIconChange($icon, "./assets/images/icon-minus.svg");
    $content = $paragraph;
    $firstIcon = $icon;
  };

  $button.addEventListener("click", hangleAccordion);
  $button.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      hangleAccordion();
    }
  });
});

function animateIconChange(iconElement, newSrc) {
  iconElement.classList.add("flip");

  setTimeout(() => {
    iconElement.src = newSrc;
    iconElement.classList.remove("flip");
    void iconElement.offsetWidth;
    iconElement.classList.add("flip");
  }, 400);
}
