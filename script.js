
// Wait until page loads
document.addEventListener("DOMContentLoaded", () => {
  console.log("CTC site loaded ✅");

  // Example: handle mixer button (placeholder)
  const mixButton = document.querySelector("#mixButton");
  if (mixButton) {
    mixButton.addEventListener("click", () => {
      alert("🎨 Mixing colors... feature coming soon!");
    });
  }
});
