import React from 'react'

const Hero = () => {
  return (
    <section id="home" className="hero">
        <div className="hero-background">
            <img src="/assets/bee_background.gif" alt="Bee Animation" className="background-gif" />
        </div>
        <div className="hero-content">
            <h1 className="hero-title">
                <span className="gradient-text-glow" data-text="HIVE MIND">HIVE MIND</span>
                <p className="hero-subtitle">Artificial Intelligence Community</p>
            </h1>
            <p className="hero-description">
                A student-run community at Sathyabama Institute of Science and Technology,
                pushing the boundaries of Artificial Intelligence through collaborative learning and innovative projects
                in the AIML and Deep Learning domain.
            </p>

            <div className="hero-stats">
                <div className="stat">
                    <span className="stat-number" data-target="{{ project_count }}">0</span>
                    <span className="stat-label">Projects</span>
                </div>
                <div className="stat">
                    <span className="stat-number" data-target="{{ member_count }}">0</span>
                    <span className="stat-label">Members</span>
                </div>
                <div className="stat">
                    <span className="stat-number" data-target="{{ days_count }}">0</span>
                    <span className="stat-label">Days</span>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Hero