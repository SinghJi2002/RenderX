
document.getElementById("fileInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const originalPreview = document.getElementById("preview");
        const enhancedPreview = document.getElementById("enhancedPreview");
        const loaders = document.querySelectorAll(".loader");
        const enhanceBtn = document.getElementById("enhanceBtn");
        const downloadBtn = document.getElementById("downloadBtn");
        const arrow = document.querySelector(".arrow");

        // Show loading animation
        loaders[0].style.display = "block";
        originalPreview.style.display = "none";
        enhancedPreview.style.display = "none";
        arrow.style.display = "none";
        downloadBtn.classList.add("hidden");

        setTimeout(() => {
            // Stop loading and display the image
            loaders[0].style.display = "none";
            originalPreview.src = e.target.result;
            originalPreview.style.display = "block";
            enhanceBtn.classList.remove("hidden"); // Show Enhance button
        }, 2000);
    };
    reader.readAsDataURL(file);
});

// Enhance Button Logic
document.getElementById("enhanceBtn").addEventListener("click", function () {
    const loaders = document.querySelectorAll(".loader");
    const originalPreview = document.getElementById("preview");
    const enhancedPreview = document.getElementById("enhancedPreview");
    const downloadBtn = document.getElementById("downloadBtn");
    const arrow = document.querySelector(".arrow");

    // Show loading animation for enhancement
    loaders[1].style.display = "block";
    enhancedPreview.style.display = "none";
    arrow.style.display = "none";
    downloadBtn.classList.add("hidden");

    // Simulate image enhancement delay
    setTimeout(() => {
        // Stop loading and set the same image for now (change this when backend is ready)
        loaders[1].style.display = "none";
        enhancedPreview.src = originalPreview.src; // Fake enhancement (Replace when backend is ready)
        enhancedPreview.style.display = "block";
        downloadBtn.classList.remove("hidden");
        arrow.style.display = "block";

        // Set download functionality
        downloadBtn.onclick = function () {
            const a = document.createElement("a");
            a.href = enhancedPreview.src;
            a.download = "enhanced-image.png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
    }, 3000);
});

// Dark Mode by Default
document.body.classList.add("dark");

// profile part
document.addEventListener("DOMContentLoaded", function () {
    const images = [
        "av1.png", "av2.png", "av3.png", "av4.png",
        "av5.png", "av6.png", "av7.png", "av8.png"
    ];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    document.getElementById("profileImage").src = "/images/profiles/" + randomImage;

    document.getElementById("fileInput").addEventListener("change", function () {
        const fileNameDisplay = document.getElementById("fileName");
        if (this.files.length > 0) {
            fileNameDisplay.textContent = this.files[0].name;
        } else {
            fileNameDisplay.textContent = "";
        }
    });
    
    

    const profileContainer = document.getElementById("profile");
    const profileImage = document.getElementById("profileImage");
    const profileName = document.getElementById("profileName");
    const dialogBox = document.getElementById("dialogBox");
    const imageCount = document.getElementById("imageCount");

    const profilePics = [
        "av1.png", 
        "av2.png", 
        "av3.png", 
        "av4.png", 
        "av5.png",
        "av6.png", 
        "av7.png", 
        "av8.png"
    ]; // Use the same profile image array

    // Show username below profile pic on hover
    profileContainer.addEventListener("mouseenter", () => {
        profileName.style.display = "block";
    });

    profileContainer.addEventListener("mouseleave", () => {
        profileName.style.display = "none";
    });

    // Toggle dialog box on profile click
    profileContainer.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent click from triggering the document event
        if (dialogBox.style.opacity === "1") {
            closeDialogBox();
        } else {
            openDialogBox();
        }
    });

    // Close dialog box when clicking anywhere outside of it
    document.addEventListener("click", (event) => {
        if (!dialogBox.contains(event.target) && !profileContainer.contains(event.target)) {
            closeDialogBox();
        }
    });

    function openDialogBox() {
        dialogBox.style.display = "flex";
        setTimeout(() => {
            dialogBox.style.opacity = "1";
            dialogBox.style.transform = "translateY(0)";
        }, 10);
    }

    function closeDialogBox() {
        dialogBox.style.opacity = "0";
        dialogBox.style.transform = "translateY(-10px)";
        setTimeout(() => {
            dialogBox.style.display = "none";
        }, 300);
    }
    
    // Theme Switching
    document.getElementById("light").addEventListener("click", () => setTheme("light"));
    document.getElementById("dark").addEventListener("click", () => setTheme("dark"));

    function setTheme(mode) {
        if (mode === "dark") {
            document.body.classList.add("dark");
            document.body.classList.remove("light");
        } else {
            document.body.classList.add("light");
            document.body.classList.remove("dark");
        }
        localStorage.setItem("theme", mode);
    }

    // Load Theme Preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        setTheme(savedTheme);
        document.getElementById(savedTheme).checked = true;
    }

    // Fetch user data from backend
    function fetchUserData() {
        fetch("/api/user")
            .then(response => response.json())
            .then(data => {
                profileName.textContent = data.name || "Sankhya";

                // Check if a profile picture was assigned before
                let storedProfilePic = localStorage.getItem("profilePic");

                if (!storedProfilePic) {
                    storedProfilePic = profilePics[Math.floor(Math.random() * profilePics.length)];
                    localStorage.setItem("profilePic", storedProfilePic);
                }

                profileImage.src = storedProfilePic;
                imageCount.textContent = `Images Enhanced: ${data.imageCount || 0}`;
            })
            .catch(error => console.error("Error fetching user data:", error));
    }

    fetchUserData();

    // Logout Function
    function logout() {
        fetch("/api/logout", { 
            method: "POST",
        })
        .then(() => {
            localStorage.removeItem("profilePic"); 
            alert("Logged out successfully!");
            window.location.href = "landing/index.html";
        })
        .catch(error => console.error("Logout failed:", error));
    }
    
    window.logout = logout;
    
});
