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
        console.log("About to send login request");
        const res = await fetch('https://quizler-yu0r.onrender.com/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        console.log("Login response:", data);
        if (res.ok) {
            console.log("Login successful, redirecting to /home");
            window.location.href = '/home';
        } else {
            alert(data.message || "Invalid email or password");
        }
    } catch (err) {
        console.error(err);
        alert('Network Error');
    }
});