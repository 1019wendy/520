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
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

// 開始遊戲
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

function startGame() {
    isGameActive = true;
    currentQuestion = 0;
    score = 0;
    startScreen.classList.add('d-none');
    quizScreen.classList.remove('d-none');
    resultScreen.classList.add('d-none');
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

    Swal.fire({
        title: '遊戲結束！',
        text: message,
        icon: 'info',
        confirmButtonText: '確定'
    });
}

function restartGame() {
    startGame();
}