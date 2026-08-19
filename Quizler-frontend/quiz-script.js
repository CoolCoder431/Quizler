document.addEventListener('DOMContentLoaded', () => {
  const quizForm = document.querySelector('#quizForm');
  const difficultyInput = document.getElementById('difficultyInput');

  let quizData = [];
  let currentIndex = 0;
  let userAnswers = {}; 
  let selectedTopic = '';
  let selectedDifficulty = '';

  document.querySelectorAll('.difficulty-buttons button').forEach(btn => {
    btn.addEventListener('click', () => {
      difficultyInput.value = btn.dataset.value;
      document.querySelectorAll('.difficulty-buttons button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  quizForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const questionCount = document.querySelector('#questionCount').value;
    selectedDifficulty = difficultyInput.value;
    selectedTopic = document.querySelector('#topics').value;

    if (!selectedDifficulty) {
      alert('Please select a difficulty!');
      return;
    }

    const categoryMap = {
    "General Knowledge": 9,
    "Books": 10,
    "Film": 11,
    "Music": 12,
    "Theatre": 13,
    "TV": 14,
    "Video Games": 15,
    "Board Games": 16,
    "Science": 17,
    "Computers": 18,
    "Mathematics": 19,
    "Mythology": 20,
    "Sports": 21,
    "Geography": 22,
    "History": 23,
    "Politics": 24,
    "Art": 25,
    "Celebrities": 26,
    "Animals": 27,
    "Vehicles": 28,
    "Comics": 29,
    "Gadgets": 30,
    "Anime & Manga": 31,
    "Cartoons": 32
};

    const categoryId = categoryMap[selectedTopic];

    const apiUrl = `https://opentdb.com/api.php?amount=${questionCount}&category=${categoryId}&difficulty=${selectedDifficulty}&type=multiple`;

    try {
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (!data.results.length) {
        alert(`No questions for ${selectedTopic} - ${selectedDifficulty}. Try a different combo.`);
        return;
      }

      quizData = data.results;
      currentIndex = 0;
      userAnswers = {}; // Reset the map
      quizForm.style.display = 'none';
      showQuestion();
    } catch (err) {
      alert('Network error. Please try again.');
    }
  });

  function showQuestion() {
    document.querySelector('#questions')?.remove();
    const q = quizData[currentIndex];
    const container = document.createElement('div');
    container.id = 'questions';

    const card = document.createElement('div');
    card.className = 'question-card';

    const qEl = document.createElement('p');
    qEl.className = 'question-text';
    qEl.innerHTML = decodeHTMLEntities(`Q${currentIndex + 1}: ${q.question}`);
    card.appendChild(qEl);

    const allAnswers = shuffleArray([q.correct_answer, ...q.incorrect_answers]);
    const ul = document.createElement('ul');
    ul.className = 'options';

    allAnswers.forEach(ans => {
      const li = document.createElement('li');
      li.className = 'option';
      const label = document.createElement('label');

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'answer';
      input.value = ans;

      
      if (userAnswers[currentIndex] === ans) {
        input.checked = true;
      }

      const text = document.createElement('span');
      text.textContent = decodeHTMLEntities(ans);

      label.appendChild(input);
      label.appendChild(text);
      li.appendChild(label);
      ul.appendChild(li);
    });

    card.appendChild(ul);

    const nav = document.createElement('div');
    nav.className = 'quiz-nav';

    if (currentIndex > 0) {
      const backBtn = document.createElement('button');
      backBtn.type = 'button';
      backBtn.className = 'quiz-btn quiz-btn--ghost';
      backBtn.textContent = '⬅ Back';
      backBtn.addEventListener('click', () => {
        currentIndex--;
        showQuestion();
      });
      nav.appendChild(backBtn);
    } else {
      const spacer = document.createElement('div');
      spacer.style.flex = '1';
      nav.appendChild(spacer);
    }

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'quiz-btn quiz-btn--primary';
    nextBtn.textContent = currentIndex === quizData.length - 1 ? 'Finish' : 'Next ➡';
    nextBtn.addEventListener('click', () => {
      const selected = document.querySelector('input[name="answer"]:checked');
      if (!selected) {
        alert('Please select an answer!');
        return;
      }

      // Store user answer for this question index
      userAnswers[currentIndex] = selected.value;
      currentIndex++;

      if (currentIndex < quizData.length) {
        showQuestion();
      } else {
        showResult();
      }
    });

    nav.appendChild(nextBtn);
    card.appendChild(nav);
    container.appendChild(card);
    document.body.appendChild(container);
  }

  async function showResult() {
    document.querySelector('#questions')?.remove();
    

    let score = 0;
    

    for (let i = 0; i < quizData.length; i++) {
      const userAnswer = userAnswers[i];
      const correctAnswer = quizData[i].correct_answer;
      
      
      if (userAnswer === correctAnswer) {
        score++;
      } else {
        console.log(`✗ Wrong`);
      }
    }

    try {

    await fetch('/quiz-result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            category: selectedTopic,
            difficulty: selectedDifficulty,
            totalQuestions: quizData.length,
            correctAnswers: score
        })
    });

} catch (error) {
    console.error('Failed to save quiz result:', error);
}
    

    const container = document.createElement('div');
    container.id = 'questions';

    const card = document.createElement('div');
    card.className = 'question-card result-card';
    card.innerHTML = `
      <h2>Quiz Finished!</h2>
      <p>Your score: <strong>${score}</strong> / ${quizData.length}</p>
      <div class="quiz-nav" style="justify-content:center; gap:1rem;">
        <button type="button" class="quiz-btn quiz-btn--ghost" id="restartBtn">Restart</button>
      </div>
    `;

    container.appendChild(card);
    document.body.appendChild(container);

    document.getElementById('restartBtn').addEventListener('click', () => {
      currentIndex = 0;
      userAnswers = {};
      container.remove();
      quizForm.style.display = 'block';
    });
  }

  function shuffleArray(arr) {
    return arr.slice().sort(() => Math.random() - 0.5);
  }

  function decodeHTMLEntities(str) {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  }
});