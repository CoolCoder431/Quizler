const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.querySelector('input[name="email"]').value.trim();
    const password = form.querySelector('input[name="password"]').value;
    const name = form.querySelector('input[name="name"]').value.trim();

    if (!email || !password || !name) {
        alert("Please fill in all the fields");
        return;
    }

    try {
        const res = await fetch('https://quizler-yu0r.onrender.com/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name })
        });

        const data = await res.json();

        if (res.ok) {
            alert('Signup successful! Please log in.');
            window.location.href = 'index.html'; 
        } else {
            alert(data.message || 'Signup failed');
        }
    } catch (err) {
        console.error(err);
        alert('Network error');
    }
});
