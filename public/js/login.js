document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.redirect) {
                console.log(`🔄 Redirecting to: ${data.redirect}`);
                window.location.href = data.redirect;
            } else {
                alert("❌ Login failed: Invalid credentials.");
            }

        } catch (error) {
            console.error("❌ Login Error:", error);
            alert("Error logging in. Please try again.");
        }
    });
});
