const pulse = document.querySelector(".pulse");

pulse?.addEventListener("click", () => {
  pulse.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(.94)" },
      { transform: "scale(1.04)" },
      { transform: "scale(1)" }
    ],
    { duration: 360, easing: "ease-out" }
  );
});