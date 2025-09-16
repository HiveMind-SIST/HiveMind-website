document.addEventListener("DOMContentLoaded", () => {
  const errorMessage = document.getElementById("error-message");

  // This is the only JavaScript needed for the login page.
  // It checks if the URL has an 'error' parameter, which your Python backend
  // adds after a failed login attempt (e.g., redirecting to /login?error=1).
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("error")) {
    if (errorMessage) {
      errorMessage.textContent = "Invalid email or password. Please try again.";
      errorMessage.style.display = "block";
    }
  }

  // By not having a 'submit' event listener on the form, we allow the
  // browser to perform its default action: sending a POST request to the
  // 'action' URL specified in your HTML form tag. Your FastAPI backend is
  // already set up to handle this and issue the correct redirects.
});
    