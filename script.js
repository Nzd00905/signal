document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const adminModal = document.getElementById("adminModal");
  const jsonUrl =
    "https://raw.githubusercontent.com/Nzd00905/profit-calculator-login/refs/heads/main/activeuser.json";

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(jsonUrl);
      const users = await response.json();

      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        // Check if the account is expired
        const expiryDate = new Date(
          user.expirydate.split("-").reverse().join("-")
        );
        const currentDate = new Date();

        if (currentDate > expiryDate) {
          const daysDiff = Math.ceil(
            (currentDate - expiryDate) / (1000 * 60 * 60 * 24)
          );
          showAdminModal(`Your account expired ${daysDiff} days ago`);
          return;
        }

        // Check if expiring soon (within 7 days)
        const daysToExpiry = Math.ceil(
          (expiryDate - currentDate) / (1000 * 60 * 60 * 24)
        );
        if (daysToExpiry <= 7) {
          alert(`Warning: Your account will expire in ${daysToExpiry} days`);
        }

        // Login successful
        window.location.href = "home.html"; // Redirect to home.html
      } else {
        showAdminModal("Invalid username or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  });

  function showAdminModal(message) {
    const expiryMessage = document.getElementById("expiryMessage");
    if (expiryMessage) {
      expiryMessage.textContent =
        message || "Please contact admin for assistance";
    }
    adminModal.style.display = "flex";
  }

  // Close modal when clicking outside
  window.onclick = (event) => {
    if (event.target === adminModal) {
      adminModal.style.display = "none";
    }
  };
});
