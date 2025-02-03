document.addEventListener("DOMContentLoaded", async () => {
    const imageGrid = document.getElementById("imageGrid");

    if (!imageGrid) {
        console.error("❌ Image grid container not found in fake_img.html");
        return;
    }

    console.log("ℹ️ Fetching fake authentication images...");

    try {
        // ✅ Fetch Fake Images from Backend
        const response = await fetch("/api/images/fake-auth-images");
        const data = await response.json();

        if (!data.images || data.images.length === 0) {
            console.error("❌ No fake images found.");
            imageGrid.innerHTML = "<p>No images available</p>";
            return;
        }

        imageGrid.innerHTML = ""; // Clear previous images

        // ✅ Create Image Elements in a 3x3 Grid
        data.images.forEach((imageUrl) => {
            const imgElement = document.createElement("img");
            imgElement.src = imageUrl;
            imgElement.alt = "Fake Authentication Image";
            imgElement.classList.add("grid-image");
            imgElement.onclick = () => selectImage(imgElement);
            imageGrid.appendChild(imgElement);
        });

        console.log(`✅ Fake Images Loaded: ${data.images.length}`);
    } catch (error) {
        console.error("❌ Error loading fake images:", error);
    }
});

// ✅ Function to Select Image
function selectImage(imgElement) {
    imgElement.classList.toggle("selected");
}

// ✅ Verify Fake Authentication (Always Deny Access)
async function verifyFakeAuth() {
    const selectedImages = [...document.querySelectorAll(".grid-image.selected")].map(img => img.src);

    if (selectedImages.length === 0) {
        alert("⚠️ Please select images before verifying.");
        return;
    }

    console.log("📩 Selected Images:", selectedImages);

    try {
        const response = await fetch("/api/auth/verify-fake-auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ selectedImages }),
        });

        const data = await response.json();

        if (response.status === 403) {
            alert("❌ Access Denied. Verification Failed.");
            window.location.href = "/access_denied.html";
        } else {
            alert("⚠️ Unexpected Behavior! Redirecting to dashboard...");
            window.location.href = "/dashboard.html";
        }
    } catch (error) {
        console.error("❌ Error verifying fake authentication:", error);
    }
}

// ✅ Attach function to button
document.getElementById("verifyFakeAuth").addEventListener("click", verifyFakeAuth);
