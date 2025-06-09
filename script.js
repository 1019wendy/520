// 問題資料庫
const questions = [
    {
        question: "康熙來了開播年份是哪一年？",
        options: ["2002年", "2004年", "2006年", "2008年"],
        correctAnswer: 1
    },
    {
        question: "康熙來了的主持人是誰？",
        options: ["蔡康永和徐熙娣", "吳宗憲和陳建州", "張菲和費玉清", "曾國城和陳漢典"],
        correctAnswer: 0
    },
    {
        question: "以下哪個不是康熙來了的經典單元？",
        options: ["收視率破表", "康熙字典", "美食好簡單", "女人我最大"],
        correctAnswer: 2
    },
    {
        question: "康熙來了最後一集播出是在哪一年？",
        options: ["2014年", "2015年", "2016年", "2017年"],
        correctAnswer: 2
    },
    {
        question: "小S在節目中最常說的口頭禪是什麼？",
        options: ["真的假的", "幹嘛啦", "哎呀媽呀", "討厭啦"],
        correctAnswer: 1
    },
    {
        question: "康熙來了的第一集主題是什麼？",
        options: ["明星的秘密", "時尚穿搭", "美食特輯", "家庭故事"],
        correctAnswer: 0
    },
    {
        question: "康熙來了的節目名稱由誰命名？",
        options: ["蔡康永", "徐熙娣", "製作人", "觀眾投票"],
        correctAnswer: 2
    },
    {
        question: "康熙來了的節目時長通常是多少分鐘？",
        options: ["30分鐘", "45分鐘", "60分鐘", "90分鐘"],
        correctAnswer: 2
    },
    {
        question: "康熙來了的經典單元之一是什麼？",
        options: ["康熙大明星", "康熙美食", "康熙時尚", "康熙家庭"],
        correctAnswer: 0
    },
    {
        question: "康熙來了的節目中，蔡康永最常做的事情是什麼？",
        options: ["講笑話", "分析心理", "主持辯論", "分享故事"],
        correctAnswer: 3
    },
    {
        question: "康熙來了的節目中，哪位嘉賓曾創下最多次上節目的紀錄？",
        options: ["蔡康永", "徐熙娣", "陳漢典", "連戰"],
        correctAnswer: 3
    }
];

let currentQuestion = 0;
let score = 0;
let isGameActive = false;

// DOM 元素
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const continueBtn = document.getElementById('continue-btn');
const newGameBtn = document.getElementById('new-game-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');
const highScoreElement = document.getElementById('high-score');
const savedProgressDiv = document.getElementById('saved-progress');
const savedScoreElement = document.getElementById('saved-score');

// 本地存儲系統
const storage = {
    // 存儲鍵名
    keys: {
        highScore: 'khHighScore',
        gameProgress: 'khGameProgress',
        userPreferences: 'khUserPreferences'
    },

    // 初始化存儲
    init() {
        if (!this.getHighScore()) {
            this.setHighScore(0);
        }
        if (!this.getGameProgress()) {
            this.setGameProgress({
                currentQuestion: 0,
                score: 0
            });
        }
        if (!this.getUserPreferences()) {
            this.setUserPreferences({
                soundEnabled: true,
                username: ''
            });
        }
    },

    // 最高分相關方法
    getHighScore() {
        return parseInt(localStorage.getItem(this.keys.highScore)) || 0;
    },
    setHighScore(score) {
        localStorage.setItem(this.keys.highScore, score);
    },
    updateHighScore(currentScore) {
        const highScore = this.getHighScore();
        if (currentScore > highScore) {
            this.setHighScore(currentScore);
            return true;
        }
        return false;
    },

    // 遊戲進度相關方法
    getGameProgress() {
        const progress = localStorage.getItem(this.keys.gameProgress);
        return progress ? JSON.parse(progress) : null;
    },
    setGameProgress(progress) {
        localStorage.setItem(this.keys.gameProgress, JSON.stringify(progress));
    },
    clearGameProgress() {
        localStorage.removeItem(this.keys.gameProgress);
    },

    // 使用者偏好設定相關方法
    getUserPreferences() {
        const prefs = localStorage.getItem(this.keys.userPreferences);
        return prefs ? JSON.parse(prefs) : null;
    },
    setUserPreferences(prefs) {
        localStorage.setItem(this.keys.userPreferences, JSON.stringify(prefs));
    }
};

// 事件監聽器
startBtn.addEventListener('click', () => startNewGame());
continueBtn.addEventListener('click', () => continueGame());
newGameBtn.addEventListener('click', () => startNewGame());
restartBtn.addEventListener('click', restartGame);

// 初始化遊戲
function initializeGame() {
    // 顯示最高分
    highScoreElement.textContent = storage.getHighScore();
    
    // 檢查是否有未完成的遊戲
    const savedProgress = storage.getGameProgress();
    if (savedProgress) {
        savedProgressDiv.classList.remove('d-none');
        savedScoreElement.textContent = savedProgress.score;
        startBtn.classList.add('d-none');
    } else {
        savedProgressDiv.classList.add('d-none');
        startBtn.classList.remove('d-none');
    }
}

// 開始新遊戲
function startNewGame() {
    storage.clearGameProgress();
    isGameActive = true;
    currentQuestion = 0;
    score = 0;
    startScreen.classList.add('d-none');
    quizScreen.classList.remove('d-none');
    resultScreen.classList.add('d-none');
    scoreElement.textContent = score;
    showQuestion();
}

// 繼續遊戲
function continueGame() {
    const savedProgress = storage.getGameProgress();
    if (savedProgress) {
        isGameActive = true;
        currentQuestion = savedProgress.currentQuestion;
        score = savedProgress.score;
        startScreen.classList.add('d-none');
        quizScreen.classList.remove('d-none');
        resultScreen.classList.add('d-none');
        scoreElement.textContent = score;
        showQuestion();
    } else {
        startNewGame();
    }
}

// 開始遊戲
function startGame() {
    isGameActive = true;
    
    // 檢查是否有未完成的遊戲
    const savedProgress = storage.getGameProgress();
    if (savedProgress) {
        currentQuestion = savedProgress.currentQuestion;
        score = savedProgress.score;
    } else {
        currentQuestion = 0;
        score = 0;
    }
    
    startScreen.classList.add('d-none');
    quizScreen.classList.remove('d-none');
    resultScreen.classList.add('d-none');
    scoreElement.textContent = score;
    showQuestion();
}

function showQuestion() {
    if (currentQuestion >= questions.length) {
        endGame();
        return;
    }

    const question = questions[currentQuestion];
    questionText.textContent = question.question;
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn btn mb-2';
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(index));
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedIndex) {
    if (!isGameActive) return;

    const question = questions[currentQuestion];
    const buttons = optionsContainer.querySelectorAll('.option-btn');
    
    buttons.forEach(button => {
        button.disabled = true;
    });

    if (selectedIndex === question.correctAnswer) {
        buttons[selectedIndex].classList.add('correct');
        score += 20;
        scoreElement.textContent = score;
        // 保存遊戲進度
        storage.setGameProgress({
            currentQuestion: currentQuestion + 1,
            score: score
        });
        Swal.fire({
            icon: 'success',
            title: '答對了！',
            text: '太棒了！',
            showConfirmButton: false,
            timer: 1500
        });
    } else {
        buttons[selectedIndex].classList.add('wrong');
        buttons[question.correctAnswer].classList.add('correct');
        Swal.fire({
            icon: 'error',
            title: '答錯了！',
            text: '正確答案是：' + question.options[question.correctAnswer],
            showConfirmButton: false,
            timer: 2000
        });
    }

    setTimeout(() => {
        currentQuestion++;
        showQuestion();
    }, 2000);
}

function endGame() {
    isGameActive = false;
    quizScreen.classList.add('d-none');
    resultScreen.classList.remove('d-none');
    finalScoreElement.textContent = score;
    
    // 檢查是否創造新高分
    const isNewHighScore = storage.updateHighScore(score);
    
    // 清除遊戲進度
    storage.clearGameProgress();
    
    let message = '';
    if (score === 100) {
        message = '完美！你是康熙來了的終極粉絲！';
    } else if (score >= 80) {
        message = '太厲害了！你真的很了解康熙來了！';
    } else if (score >= 60) {
        message = '不錯喔！再接再厲！';
    } else {
        message = '要多看看康熙來了的重播喔！';
    }

    if (isNewHighScore) {
        message += '\n恭喜創造新高分！';
    }

    Swal.fire({
        title: '遊戲結束！',
        html: `${message}<br>最高分：${storage.getHighScore()}分`,
        icon: 'info',
        confirmButtonText: '確定'
    });
}

// 修改 restartGame 函數
function restartGame() {
    startNewGame();
}

// 初始化本地存儲和遊戲
storage.init();
initializeGame();