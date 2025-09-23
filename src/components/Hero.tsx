import React from "react";
import CountUp from "./CountUp";

const Hero = () => {
  const started_date = new Date("2025-01-20");
  const numberOfDays = Math.floor(
    (new Date().getTime() - started_date.getTime()) / (1000 * 60 * 60 * 24),
  );

  const temp_data = {
    projects: 12,
    members: 150,
  }

  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <img
          src="/assets/bee_background.gif"
          alt="Bee Animation"
          className="background-gif"
        />
      </div>
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="gradient-text-glow" data-text="HIVE MIND">
            HIVE MIND
          </span>
          <p className="hero-subtitle">Artificial Intelligence Community</p>
        </h1>
        <p className="hero-description">
          A student-run community at Sathyabama Institute of Science and
          Technology, pushing the boundaries of Artificial Intelligence through
          collaborative learning and innovative projects in the AIML and Deep
          Learning domain.
        </p>

        <div className="hero-stats">
          <div className="stat">
            <CountUp from={0} to={temp_data.projects} delay={0.2} duration={2.5} className="stat-number stat-number-projects" />
            <span className="stat-label">Projects</span>
          </div>
          <div className="stat">
            <CountUp from={0} to={temp_data.members} delay={0.4} duration={3} className="stat-number stat-number-members" />
            <span className="stat-label">Members</span>
          </div>
          <div className="stat">
            <CountUp from={0} to={numberOfDays} delay={0.8} duration={2} className="stat-number stat-number-days" />
            <span className="stat-label">Days</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
