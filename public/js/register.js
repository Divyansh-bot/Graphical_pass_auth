document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const categoryDropdown = document.getElementById("dropdown_menu");
    const imageGrid = document.getElementById("imageGrid");
    const selectedImages = new Set(); // Store selected image paths

    categoryDropdown.addEventListener("change", async () => {
        const selectedCategory = categoryDropdown.value;

        if (!selectedCategory) return;

        console.log(`ℹ️ Fetching images for category: ${selectedCategory}`);

        try {
            const response = await fetch(`/api/images/get-images?category=${selectedCategory}`);
            const data = await response.json();

            if (!data.images || data.images.length === 0) {
                console.error("❌ No images found");
                return;
            }

            imageGrid.innerHTML = ""; // Clear previous images
            selectedImages.clear(); // Reset selected images

            data.images.forEach(imageUrl => {
                const imgElement = document.createElement("img");
                imgElement.src = imageUrl;
                imgElement.alt = "Authentication Image";
                imgElement.classList.add("grid-image");

                imgElement.onclick = () => {
                    if (selectedImages.has(imageUrl)) {
                        selectedImages.delete(imageUrl);
                        imgElement.classList.remove("selected");
                    } else {
                        if (selectedImages.size < 5) {
                            selectedImages.add(imageUrl);
                            imgElement.classList.add("selected");
                        } else {
                            alert("You can only select up to 5 images.");
                        }
                    }
                };

                imageGrid.appendChild(imgElement);
            });

            console.log(`✅ Images Loaded: ${data.images.length}`);
        } catch (error) {
            console.error("❌ Error loading images:", error);
        }
    });

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const contact = document.getElementById("contact").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const imageCategory = categoryDropdown.value;

        if (!name || !contact || !email || !password || !imageCategory || selectedImages.size !== 5) {
            alert("All fields are required and you must select exactly 5 images.");
            return;
        }

        console.log("📌 Sending registration data...");
        
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    contact,
                    email,
                    password,
                    imageCategory,
                    imagePattern: Array.from(selectedImages)
                })
            });

            const data = await response.json();
            if (response.ok) {
                console.log("✅ Registration successful:", data);
                alert("Registration successful! Redirecting to login...");
                window.location.href = "/login.html";
            } else {
                console.error("❌ Registration failed:", data.message);
                alert(`Registration failed: ${data.message}`);
            }
        } catch (error) {
            console.error("❌ Error during registration:", error);
            alert("Server error. Please try again.");
        }
    });
});
