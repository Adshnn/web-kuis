import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate('/Kuis');
  };

  return (
    <section className="hero has-background-gray-light is-fullheight is-fullwidth">
    <div className="hero-body">
      <div className="wrapper flex-center">
        <div className="quiz-container">
          <div className="quiz-head">
            <h1 className="quiz-title">Quiz</h1>
          </div>
          <div className="quiz-foot flex-center">
          <button onClick={handleStartQuiz}>Start Quiz</button>
          </div>
        </div>
     </div>
    </div>
  </section>
  );
}

export default Dashboard;
