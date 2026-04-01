// API Base URL - will be replaced by Vercel environment variable
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// DOM Elements
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showRegisterLink = document.getElementById("showRegister");
const showLoginLink = document.getElementById("showLogin");
const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");
const messageDiv = document.getElementById("message");
const bgRemovalTool = document.getElementById("bgRemovalTool");
const loginCard = document.querySelector(".login-card");

// Background Removal Tool Elements
const userInfo = document.getElementById("userInfo");
const logoutBtn = document.getElementById("logoutBtn");
const imageUpload = document.getElementById("imageUpload");
const removeBgBtn = document.getElementById("removeBgBtn");
const resultSection = document.getElementById("resultSection");
const originalImage = document.getElementById("originalImage");
const resultImage = document.getElementById("resultImage");
const downloadBtn = document.getElementById("downloadBtn");

// Current user data
let currentUser = null;
let authToken = null;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is already logged in
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("currentUser");

  if (token && user) {
    authToken = token;
    currentUser = JSON.parse(user);
    showBackgroundRemovalTool();
  } else {
    // Ensure login form is visible by default
    loginSection.style.display = "block";
    registerSection.style.display = "none";
    bgRemovalTool.style.display = "none";
    loginCard.style.display = "block";
  }

  // Event listeners
  loginForm.addEventListener("submit", handleLogin);
  registerForm.addEventListener("submit", handleRegister);
  showRegisterLink.addEventListener("click", showRegisterForm);
  showLoginLink.addEventListener("click", showLoginForm);
  logoutBtn.addEventListener("click", handleLogout);
  imageUpload.addEventListener("change", handleImageUpload);
  removeBgBtn.addEventListener("click", handleRemoveBackground);
  downloadBtn.addEventListener("click", handleDownload);
});

// Form toggle functions
function showRegisterForm(e) {
  e.preventDefault();
  loginSection.style.display = "none";
  registerSection.style.display = "block";
  hideMessage();
}

function showLoginForm(e) {
  e.preventDefault();
  registerSection.style.display = "none";
  loginSection.style.display = "block";
  hideMessage();
}

// Message functions
function showMessage(message, type = "success") {
  const messageSpan = messageDiv.querySelector("span");
  const messageIcon = messageDiv.querySelector("i");
  
  messageSpan.textContent = message;
  messageDiv.className = `message ${type}`;
  
  // Update icon based on message type
  if (type === "success") {
    messageIcon.className = "fas fa-check-circle";
  } else if (type === "error") {
    messageIcon.className = "fas fa-exclamation-circle";
  }
  
  messageDiv.style.display = "flex";

  // Auto hide after 5 seconds
  setTimeout(() => {
    hideMessage();
  }, 5000);
}

function hideMessage() {
  messageDiv.style.display = "none";
}

// Authentication functions
async function handleLogin(e) {
  e.preventDefault();

  const formData = new FormData(loginForm);
  const loginData = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (response.ok) {
      // Store token and user info
      authToken = data.access_token;
      localStorage.setItem("authToken", authToken);

      // Get user info
      await getUserInfo();

      showMessage("Login successful! Redirecting...", "success");
      setTimeout(() => {
        showBackgroundRemovalTool();
      }, 1500);
    } else {
      showMessage(data.detail || "Login failed", "error");
    }
  } catch (error) {
    console.error("Login error:", error);
    showMessage("Network error. Please try again.", "error");
  }
}

async function handleRegister(e) {
  e.preventDefault();

  const formData = new FormData(registerForm);
  const registerData = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
    });

    const data = await response.json();

    if (response.ok) {
      showMessage("Registration successful! Please login.", "success");
      setTimeout(() => {
        showLoginForm(e);
      }, 1500);
    } else {
      showMessage(data.detail || "Registration failed", "error");
    }
  } catch (error) {
    console.error("Registration error:", error);
    showMessage("Network error. Please try again.", "error");
  }
}

async function getUserInfo() {
  try {
    const response = await fetch(`${API_BASE}/users/me`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.ok) {
      const userData = await response.json();
      currentUser = userData;
      localStorage.setItem("currentUser", JSON.stringify(userData));
    }
  } catch (error) {
    console.error("Error getting user info:", error);
  }
}

function handleLogout() {
  // Clear stored data
  localStorage.removeItem("authToken");
  localStorage.removeItem("currentUser");
  
  // Reset state
  currentUser = null;
  authToken = null;

  // Show login form
  bgRemovalTool.style.display = "none";
  loginCard.style.display = "block";
  hideMessage();

  showMessage("Logged out successfully", "success");
}

function showBackgroundRemovalTool() {
  loginCard.style.display = "none";
  bgRemovalTool.style.display = "block";
  userInfo.textContent = `Logged in as: ${currentUser.username}`;
}

// Background removal functions
let selectedFile = null;

// Add drag and drop functionality
const uploadArea = document.getElementById("uploadArea");
const fileInfo = document.getElementById("fileInfo");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const processingOverlay = document.getElementById("processingOverlay");

function handleImageUpload(e) {
  const file = e.target.files[0];
  if (file) {
    selectedFile = file;
    
    // Show file info
    fileName.textContent = file.name;
    fileSize.textContent = `(${(file.size / 1024 / 1024).toFixed(2)} MB)`;
    uploadArea.style.display = "none";
    fileInfo.style.display = "flex";

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      originalImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

// Drag and drop events
if (uploadArea) {
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.classList.add("dragover");
  });

  uploadArea.addEventListener("dragleave", (e) => {
    e.preventDefault();
    uploadArea.classList.remove("dragover");
  });

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.classList.remove("dragover");
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      imageUpload.files = files;
      handleImageUpload({ target: { files: files } });
    }
  });
}

async function handleRemoveBackground() {
  if (!selectedFile || !authToken) return;

  const formData = new FormData();
  formData.append("file", selectedFile);

  // Show processing overlay
  processingOverlay.style.display = "flex";

  try {
    const response = await fetch(`${API_BASE}/remove-bg`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    });

    if (response.ok) {
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      resultImage.src = imageUrl;
      resultSection.style.display = "block";

      showMessage("Background removed successfully!", "success");
    } else {
      const errorData = await response.json();
      showMessage(errorData.detail || "Failed to remove background", "error");
    }
  } catch (error) {
    console.error("Background removal error:", error);
    showMessage("Network error. Please try again.", "error");
  } finally {
    // Hide processing overlay
    processingOverlay.style.display = "none";
  }
}

function handleDownload() {
  if (resultImage.src) {
    const link = document.createElement("a");
    link.href = resultImage.src;
    link.download = "background-removed.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
