document.addEventListener("DOMContentLoaded", async () => {
    const imageGrid = document.getElementById("imageGrid");
    const verifyButton = document.getElementById("verifyButton");

    if (!imageGrid || !verifyButton) {
        console.error("❌ Required elements not found on page.");
        return;
    }

    let category = sessionStorage.getItem("imageCategory");

    if (!category || category === "undefined") {
        console.warn("⚠️ No category found in session. Fetching...");
        try {
            const response = await fetch("/api/auth/session");
            const sessionData = await response.json();

            if (sessionData.session && sessionData.session.imageCategory) {
                category = sessionData.session.imageCategory;
                sessionStorage.setItem("imageCategory", category);
            } else {
                console.error("❌ No category found.");
                return;
            }
        } catch (error) {
            console.error("❌ Error fetching session data:", error);
            return;
        }
    }

    console.log(`ℹ️ Using category: ${category}`);

    try {
        const response = await fetch(`/api/images/get-images?category=${encodeURIComponent(category)}`);
        const data = await response.json();

        if (!data.images || data.images.length === 0) {
            console.warn("⚠️ No images found.");
            imageGrid.innerHTML = "<p>No images found.</p>";
            return;
        }

        imageGrid.innerHTML = "";

        data.images.forEach((imageUrl, index) => {
            const imgElement = document.createElement("img");
            imgElement.src = imageUrl;
            imgElement.alt = `Image ${index + 1}`;
            imgElement.classList.add("grid-image");
            imgElement.onclick = () => toggleImageSelection(imgElement);
            imageGrid.appendChild(imgElement);
        });

        console.log(`✅ Images Loaded: ${data.images.length}`);
    } catch (error) {
        console.error("❌ Error loading images:", error);
    }
});

// 🟢 Image Selection Handling
let selectedImages = [];

function toggleImageSelection(imgElement) {
    imgElement.classList.toggle("selected");
    const imagePath = imgElement.src.replace(window.location.origin, ""); // Get relative path

    if (selectedImages.includes(imagePath)) {
        selectedImages = selectedImages.filter(img => img !== imagePath);
    } else {
        selectedImages.push(imagePath);
    }
}

// 🟢 Verify Image Selection
document.getElementById("verifyButton").addEventListener("click", async () => {
    if (selectedImages.length === 0) {
        alert("⚠️ Please select images in the correct sequence.");
        return;
    }

    console.log("📤 Sending Selected Images for Verification:", selectedImages);

    try {
        const response = await fetch("/api/auth/verify-images", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ selectedImages }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ Image verification successful!");
            window.location.href = "/dashboard.html";
        } else {
            alert("❌ Image verification failed: " + data.message);
            window.location.href = "/fake_img.html"; // Redirect to fake auth if verification fails
        }
    } catch (error) {
        console.error("❌ Error verifying images:", error);
        alert("⚠️ Server error. Try again.");
    }
});
