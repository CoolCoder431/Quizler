const form = document.querySelector('#login-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.querySelector('input[name="email"]').value.trim();
    const password = form.querySelector('input[name="password"]').value;

    if (!email || !password) {
        alert("Please fill both the fields");
        return;
    }

    try {
        const res = await fetch('https://quizler-yu0r.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        // Check if the response is a successful redirect (status 2xx)
        if (res.ok) {
            console.log("Login successful, redirecting to /home");
            window.location.href = '/home';
        } else {
            // If the response is not ok, it might still contain a JSON message
            const data = await res.json();
            alert(data.message || "Login failed. Please try again.");
        }
    } catch (err) {
        console.error(err);
        alert('An unexpected error occurred. Please check the network connection.');
    }
});