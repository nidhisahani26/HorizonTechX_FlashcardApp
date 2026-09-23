let allCards = [];
let currentIndex = 0;
let isFlipped = false;

window.addEventListener('load', function() {
    setupEventListeners();
    loadFromStorage();
    renderStudyView();
});

function setupEventListeners() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            switchTab(e.target.dataset.tab);
        });
    });
    
    document.getElementById('addForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addCard();
    });
}

function addCard() {
    const questionInput = document.getElementById('question');
    const answerInput = document.getElementById('answer');
    
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();
    
    if (!question || !answer) {
        alert('❌ Please fill in both fields!');
        return;
    }
    
    const newCard = {
        id: Date.now(),
        question: question,
        answer: answer,
        createdAt: new Date().toLocaleDateString()
    };
    
    allCards.push(newCard);
    saveToStorage();
    
    alert(`✅ Card added! Total: ${allCards.length}`);
    
    questionInput.value = '';
    answerInput.value = '';
    questionInput.focus();
    
    renderStudyView();
    renderManageView();
}

function deleteCard(id) {
    if (confirm('🗑️ Delete this card?')) {
        allCards = allCards.filter(card => card.id !== id);
        
        if (currentIndex >= allCards.length && allCards.length > 0) {
            currentIndex = allCards.length - 1;
        }
        
        saveToStorage();
        alert('🗑️ Card deleted!');
        renderStudyView();
        renderManageView();
    }
}

function nextCard() {
    if (currentIndex < allCards.length - 1) {
        currentIndex++;
        isFlipped = false;
        renderStudyView();
    }
}

function previousCard() {
    if (currentIndex > 0) {
        currentIndex--;
        isFlipped = false;
        renderStudyView();
    }
}

function flipCard() {
    isFlipped = !isFlipped;
    renderStudyView();
}

function renderStudyView() {
    const studyContent = document.getElementById('studyContent');
    
    if (allCards.length === 0) {
        studyContent.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <p>No flashcards yet.</p>
            </div>
        `;
        return;
    }
    
    const currentCard = allCards[currentIndex];
    
    const html = `
        <div class="flashcard" onclick="flipCard()">
            <p class="flashcard-label">
                ${isFlipped ? '✅ Answer' : '❓ Question'}
            </p>
            <p class="flashcard-content">
                ${isFlipped ? currentCard.answer : currentCard.question}
            </p>
        </div>
        
        <div class="controls">
            <button class="btn btn-secondary" 
                    ${currentIndex === 0 ? 'disabled' : ''} 
                    onclick="previousCard()">
                ← Previous
            </button>
            <span class="counter">
                ${currentIndex + 1} / ${allCards.length}
            </span>
            <button class="btn btn-secondary" 
                    ${currentIndex === allCards.length - 1 ? 'disabled' : ''} 
                    onclick="nextCard()">
                Next →
            </button>
        </div>
    `;
    
    studyContent.innerHTML = html;
}

function renderManageView() {
    const manageContent = document.getElementById('manageContent');
    
    if (allCards.length === 0) {
        manageContent.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <p>No flashcards to manage.</p>
            </div>
        `;
        return;
    }
    
    let cardsHtml = '<div class="card-list">';
    
    allCards.forEach((card, index) => {
        cardsHtml += `
            <div class="card-item">
                <div class="card-item-text">
                    <div class="card-item-question">
                        Q${index + 1}: ${card.question}
                    </div>
                    <div class="card-item-answer">
                        A: ${card.answer.substring(0, 50)}...
                    </div>
                </div>
                <div>
                    <button class="btn-danger" onclick="deleteCard(${card.id})">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `;
    });
    
    cardsHtml += '</div>';
    manageContent.innerHTML = cardsHtml;
}

function saveToStorage() {
    const jsonString = JSON.stringify(allCards);
    localStorage.setItem('flashcards', jsonString);
}

function loadFromStorage() {
    const saved = localStorage.getItem('flashcards');
    if (saved) {
        allCards = JSON.parse(saved);
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}