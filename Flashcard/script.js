  let flashcards = [];
let currentIndex = 0;
let favorites = [];

window.addEventListener('load', function() {
    loadFromStorage();
    setupEventListeners();
    renderStudy();
});

function setupEventListeners() {
    document.getElementById('addForm').addEventListener('submit', addCard);
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
}

function addCard(e) {
    e.preventDefault();
    const question = document.getElementById('question').value.trim();
    const answer = document.getElementById('answer').value.trim();
    
    if(!question || !answer) {
        alert('❌ Please fill all fields!');
        return;
    }
    
    flashcards.push({
        id: Date.now(),
        question,
        answer,
        createdDate: new Date().toLocaleDateString()
    });
    
    saveToStorage();
    document.getElementById('addForm').reset();
    alert('✅ Card added successfully!');
    switchTab('study');
    renderStudy();
}

function renderStudy() {
    const study = document.getElementById('studyContent');
    
    if(flashcards.length === 0) {
        study.innerHTML = '<div class="empty-state">📚 No cards yet. Add one to get started!</div>';
        return;
    }
    
    const card = flashcards[currentIndex];
    const isFav = favorites.includes(card.id);
    
    study.innerHTML = `
        <div class="card" onclick="toggleFlip(this)">
            <div class="card-front">
                <p style="font-size:14px; margin-bottom: 10px;">❓ QUESTION</p>
                <p style="font-size:20px; font-weight:bold;">${card.question}</p>
            </div>
            <div class="card-back" style="display:none;">
                <p style="font-size:14px; margin-bottom: 10px;">✅ ANSWER</p>
                <p style="font-size:20px; font-weight:bold;">${card.answer}</p>
            </div>
        </div>
        
        <button onclick="toggleCardFavorite(${card.id})" style="width:100%; background: ${isFav ? '#e74c3c' : '#95a5a6'}; color:white; padding:12px; border:none; border-radius:5px; cursor:pointer; margin-bottom:15px; font-weight:600; transition: all 0.3s;">
            ${isFav ? '❤️ Favorited' : '🤍 Favorite'}
        </button>
        
        <div class="counter">${currentIndex + 1} / ${flashcards.length}</div>
        
        <div class="nav-buttons">
            <button onclick="previousCard()" class="btn btn-secondary" ${currentIndex === 0 ? 'disabled' : ''}>← Previous</button>
            <button onclick="nextCard()" class="btn btn-secondary" ${currentIndex === flashcards.length - 1 ? 'disabled' : ''}>Next →</button>
        </div>
    `;
}

function toggleFlip(el) {
    const front = el.querySelector('.card-front');
    const back = el.querySelector('.card-back');
    
    if(!front || !back) return;
    
    if(front.style.display === 'none') {
        front.style.display = 'block';
        back.style.display = 'none';
    } else {
        front.style.display = 'none';
        back.style.display = 'block';
    }
}

function nextCard() {
    if(currentIndex < flashcards.length - 1) {
        currentIndex++;
        renderStudy();
    }
}

function previousCard() {
    if(currentIndex > 0) {
        currentIndex--;
        renderStudy();
    }
}

function toggleCardFavorite(id) {
    if(favorites.includes(id)) {
        favorites = favorites.filter(fav => fav !== id);
    } else {
        favorites.push(id);
    }
    saveToStorage();
    renderStudy();
}

function renderManage() {
    const manage = document.getElementById('manageContent');
    
    if(flashcards.length === 0) {
        manage.innerHTML = '<div class="empty-state">No cards to manage. Add some first!</div>';
        return;
    }
    
    manage.innerHTML = flashcards.map((card, index) => `
        <div class="card-item">
            <p class="question">❓ ${card.question}</p>
            <p class="answer">✅ ${card.answer}</p>
            <p class="meta">${card.createdDate}</p>
            <button onclick="deleteCard(${card.id})" class="btn btn-secondary" style="width:100%;">🗑️ Delete</button>
        </div>
    `).join('');
}

function deleteCard(id) {
    if(confirm('Are you sure you want to delete this card?')) {
        flashcards = flashcards.filter(card => card.id !== id);
        favorites = favorites.filter(fav => fav !== id);
        
        if(currentIndex >= flashcards.length && currentIndex > 0) {
            currentIndex--;
        }
        
        saveToStorage();
        renderManage();
        renderStudy();
    }
}

function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(tab).classList.add('active');
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    if(tab === 'manage') {
        renderManage();
    } else if(tab === 'study') {
        renderStudy();
    }
}

function saveToStorage() {
    localStorage.setItem('flashcards_data', JSON.stringify(flashcards));
    localStorage.setItem('flashcards_favorites', JSON.stringify(favorites));
}

function loadFromStorage() {
    const saved = localStorage.getItem('flashcards_data');
    const favs = localStorage.getItem('flashcards_favorites');
    
    if(saved) {
        flashcards = JSON.parse(saved);
    }
    if(favs) {
        favorites = JSON.parse(favs);
    }
}
