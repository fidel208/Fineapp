const signupContainer = document.getElementById("signup-cont");
const loginContainer = document.getElementById("login-cont");
const accountCardWrapper = document.getElementById("account");
const onboardingCardWrapper = document.getElementById("add-details");

const loginLink = document.getElementById("login-link");
const signUpLink = document.getElementById("create-link");

const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const addDetailsForm = document.getElementById("add-form");

const uploadTriggerBtn = document.querySelector("#profile-pic > button");
const hiddenImageInput = document.getElementById("image");
const circularPreviewSlot = document.getElementById("pic");

const API_BASE_URL = "http://localhost:5000/api/auth";

function initializeFormState() {
  signupContainer.style.display = "flex";
  loginContainer.style.display = "none";
  onboardingCardWrapper.classList.add("hidden");
}
document.addEventListener("DOMContentLoaded", initializeFormState);

loginLink.addEventListener("click", (e) => {
  e.preventDefault();
  signupContainer.style.display = "none";
  loginContainer.style.display = "flex";
});

signUpLink.addEventListener("click", (e) => {
  e.preventDefault();
  loginContainer.style.display = "none";
  signupContainer.style.display = "flex";
});

function transitionToOnboarding() {
  accountCardWrapper.style.display = "none";
  onboardingCardWrapper.classList.remove("hidden");
}

uploadTriggerBtn.addEventListener("click", () => {
  hiddenImageInput.click();
});

hiddenImageInput.addEventListener("change", function () {
  const selectedLocalFile = this.files[0];

  if (selectedLocalFile) {
    const streamReader = new FileReader();

    streamReader.addEventListener("load", function () {
      circularPreviewSlot.style.backgroundImage = `url(${this.result})`;
    });

    streamReader.readAsDataURL(selectedLocalFile);
  }
});

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const emailValue = document.getElementById("email").value.trim();
  const usernameValue = document.getElementById("signup-name").value.trim();
  const passwordValue = document.getElementById("signup-pass").value;

  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailValue,
        username: usernameValue,
        password: passwordValue,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Account registration request failed.");
    }

    alert(
      "Account created successfully! Let's finish setting up your profile.",
    );

    if (data.token) localStorage.setItem("token", data.token);
    transitionToOnboarding();
  } catch (error) {
    alert(`❌ Sign-Up Error: ${error.message}`);
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const usernameValue = document.getElementById("login-name").value.trim();
  const passwordValue = document.getElementById("pass").value;

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usernameValue,
        password: passwordValue,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Authorization verification failed.");
    }

    localStorage.setItem("token", data.token);

    if (data.hasCompletedOnboarding) {
      alert("Welcome back! Loading your feeds...");
      window.location.href = "/feed.html";
    } else {
      transitionToOnboarding();
    }
  } catch (error) {
    alert(`❌ Authentication Error: ${error.message}`);
  }
});

addDetailsForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const phoneValue = document.getElementById("number").value.trim();
  const birthdayValue = document.getElementById("birthday").value;
  const genderValue = document.getElementById("gender").value;
  const countryValue = document.getElementById("country").value.trim();
  const bioValue = document.getElementById("desc").value.trim();

  const profilePayload = new FormData();
  profilePayload.append("phone", phoneValue);
  profilePayload.append("birthday", birthdayValue);
  profilePayload.append("gender", genderValue);
  profilePayload.append("country", countryValue);
  profilePayload.append("bio", bioValue);

  if (hiddenImageInput.files[0]) {
    profilePayload.append("image", hiddenImageInput.files[0]);
  }

  try {
    const secureToken = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/onboarding`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${secureToken}`,
      },
      body: profilePayload,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Profile configuration storage failed.");
    }

    alert("Profile configurations updated successfully! Welcome to Fineapp.");
    window.location.href = "/feed.html";
  } catch (error) {
    alert(`❌ Profile Setup Error: ${error.message}`);
  }
});
