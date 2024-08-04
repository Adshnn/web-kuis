import React, { useEffect, useState, useRef } from 'react';

const QuizGame = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [result, setResult] = useState('');
  const [correctScore, setCorrectScore] = useState(0);
  const [askedCount, setAskedCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const totalQuestion = 5;
  const timerRef = useRef(null);

  useEffect(() => {
    // Load quiz data from localStorage
    const savedState = JSON.parse(localStorage.getItem('quizState'));
    if (savedState) {
      setQuestion(savedState.question || '');
      setOptions(savedState.options || []);
      setCorrectAnswer(savedState.correctAnswer || '');
      setSelectedAnswer(savedState.selectedAnswer || '');
      setResult(savedState.result || '');
      setCorrectScore(savedState.correctScore || 0);
      setAskedCount(savedState.askedCount || 0);
      setTimeLeft(savedState.timeLeft || 15);
      setIsQuizComplete(savedState.isQuizComplete || false);
    } else {
      loadQuestion();
    }

    // Clean up timer on component unmount
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      handleTimeout();
    }
  }, [timeLeft]);

  const saveStateToLocalStorage = () => {
    const state = {
      question,
      options,
      correctAnswer,
      selectedAnswer,
      result,
      correctScore,
      askedCount,
      timeLeft,
      isQuizComplete
    };
    localStorage.setItem('quizState', JSON.stringify(state));
  };

  const loadQuestion = async () => {
    const APIUrl = 'https://opentdb.com/api.php?amount=1';
    try {
      const response = await fetch(APIUrl);
      const data = await response.json();
      if (data && data.results && data.results[0]) {
        showQuestion(data.results[0]);
      } else {
        console.error('Invalid API response:', data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const showQuestion = (data) => {
    setCorrectAnswer(data.correct_answer);
    const incorrectAnswers = data.incorrect_answers;
    const optionsList = [...incorrectAnswers, data.correct_answer].sort(() => Math.random() - 0.5);
    setQuestion(data.question);
    setOptions(optionsList);
    resetTimer();
    saveStateToLocalStorage();
  };

  const submitAnswer = () => {
    clearInterval(timerRef.current); // Stop timer
    if (selectedAnswer === correctAnswer) {
      setCorrectScore(correctScore + 1);
      setResult('Correct Answer!');
    } else {
      setResult(`Incorrect Answer! Correct Answer: ${correctAnswer}`);
    }
    setAskedCount(askedCount + 1);
    setIsAnswerChecked(true);
    saveStateToLocalStorage();
    if (askedCount + 1 === totalQuestion) {
      setIsQuizComplete(true);
      saveStateToLocalStorage();
    }
  };

  const handleTimeout = () => {
    setResult(`Time's up! Correct Answer: ${correctAnswer}`);
    setAskedCount(askedCount + 1);
    setIsAnswerChecked(true);
    saveStateToLocalStorage();
    if (askedCount + 1 === totalQuestion) {
      setIsQuizComplete(true);
      saveStateToLocalStorage();
    }
  };

  const nextQuestion = () => {
    setIsAnswerChecked(false);
    loadQuestion();
    setResult('');
    setSelectedAnswer('');
    saveStateToLocalStorage();
  };

  const resetTimer = () => {
    setTimeLeft(15);
    clearInterval(timerRef.current); // Clear existing timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    saveStateToLocalStorage();
  };

  const restartQuiz = () => {
    setCorrectScore(0);
    setAskedCount(0);
    setIsQuizComplete(false);
    loadQuestion();
    setResult('');
    setSelectedAnswer('');
    setIsAnswerChecked(false);
    localStorage.removeItem('quizState');
  };

  if (isQuizComplete) {
    return (
      <section className="hero has-background-gray-light is-fullheight is-fullwidth">
        <div className="hero-body">
          <div className="wrapper flex-center">
            <div className="quiz-container">
              <div className="quiz-head">
                <h1 className="quiz-title">Quiz Complete</h1>
              </div>
              <div className="quiz-body">
                <div className="final-score">Your final score is {correctScore} out of {totalQuestion}</div>
              </div>
              
              <div className="quiz-foot mt-4">
                <button type="button" onClick={restartQuiz}>
                  Restart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero has-background-gray-light is-fullheight is-fullwidth">
      <div className="hero-body">
        <div className="wrapper flex-center">
          <div className="quiz-container">
            <div className="quiz-head">
              <h1 className="quiz-title">Quiz</h1>
              <div className="quiz-score flex">
                <span>{correctScore}</span>/<span>{totalQuestion}</span>
              </div>
            </div>
            <div className="quiz-body">
              <div className="question-count">Question {askedCount + 1} of {totalQuestion}</div>
              <h2 className="quiz-question" dangerouslySetInnerHTML={{ __html: question }} />
              <div className="timer">Time left: {timeLeft} seconds</div>
              <ol className="quiz-options" type="a">
                {options.map((option, index) => (
                  <li 
                    key={index} 
                    onClick={() => setSelectedAnswer(option)} 
                    className={selectedAnswer === option ? 'selected' : ''}
                  >
                    {String.fromCharCode(97 + index)}. <span>{option}</span>
                  </li>
                ))}
              </ol>
              <div id="result">{result}</div>
            </div>
            <div className="quiz-foot ">
              <button type="button" onClick={submitAnswer} disabled={!selectedAnswer}>
                Submit
              </button>
            </div>
            <div className="quiz-foot mt-4">
              <button type="button" onClick={nextQuestion}>
                Next Question
              </button>
            </div>
            <div className="quiz-foot mt-4">
              <div className="restart">
                <button type="button" onClick={restartQuiz}>
                  Restart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizGame;
