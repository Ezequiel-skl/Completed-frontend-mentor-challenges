import { contentSlider } from "./const.js";

const $testimonial = document.querySelector("#testimonial");
const $name = document.querySelector("#name");
const $personImage = document.querySelector("#img-person");
const $position = document.querySelector("#position");
const $buttonPrev = document.querySelector("#button-prev");
const $buttonNext = document.querySelector("#button-next");
const $testimonialSection = document.querySelector(".testimonial-section q");

let sliderIndex = 0;

function showTestimonial(index) {
  if (index >= 0 && index < contentSlider.length) {
    $name.innerHTML = contentSlider[index].name;
    $position.innerHTML = contentSlider[index].position;
    $testimonial.innerHTML = contentSlider[index].testimonial;
    $personImage.setAttribute("src", contentSlider[index].imgSrc);
    $personImage.setAttribute("alt", contentSlider[index].name);
  }
}

function prevSlide() {
  sliderIndex = (sliderIndex - 1 + contentSlider.length) % contentSlider.length;
  showTestimonial(sliderIndex);
  sliderAnimation({ element: $personImage, className: "slide-right" });
  sliderAnimation({
    element: $testimonialSection,
    className: "slide-right",
  });
}

function nextSlide() {
  sliderIndex = (sliderIndex + 1) % contentSlider.length;
  showTestimonial(sliderIndex);
  sliderAnimation({ element: $personImage, className: "slider-left" });
  sliderAnimation({
    element: $testimonialSection,
    className: "slider-left",
  });
}

$buttonPrev.addEventListener("click", prevSlide);
$buttonNext.addEventListener("click", nextSlide);
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    prevSlide();
  }
  if (e.key === "ArrowRight") {
    nextSlide();
  }
});

showTestimonial(sliderIndex);

function sliderAnimation({ element, className }) {
  element.classList.add(className);
  setTimeout(() => {
    element.classList.remove(className);
  }, 500);
}
