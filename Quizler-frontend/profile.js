document.addEventListener('DOMContentLoaded', async () => {

    try {

        const response = await fetch('/profile-results', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();

        console.log(data);

        document.getElementById('quizzesTaken').textContent =
            data.quizzesPlayed;

        document.getElementById('averageScore').textContent =
            data.averageScore + '%';

        showQuizHistory(data.results);

    } catch (error) {

        console.error('Error loading profile:', error);

    }

});


function showQuizHistory(results) {

    const historyList = document.getElementById('historyList');

    historyList.innerHTML = '';

    results.forEach(result => {

        const historyItem = document.createElement('div');

        historyItem.className = 'history-item';

        historyItem.innerHTML = `
            <div class="history-icon">📝</div>

            <div class="history-details">

                <div class="history-title">
                    ${result.category} Quiz - ${result.difficulty}
                </div>

                <div class="history-meta">
                    ${result.totalQuestions} Questions
                </div>

            </div>

            <div class="history-score">
                ${result.correctAnswers}/${result.totalQuestions}
            </div>
        `;

        historyList.appendChild(historyItem);
    });
}