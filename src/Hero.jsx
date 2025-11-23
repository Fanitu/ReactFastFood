import React from 'react'

const Hero = ({heroSlides,currentSlide,t}) => {
  return (
    <section className="hero">
        <div className="hero-slider">
          {heroSlides.map((slide, index) => (
            <div 
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="hero-overlay">
                <div className="hero-content">
                  <h2>{slide.text}</h2>
                   <p>{t.watchFeedback}</p>
                   <button className="hero-btn order-now">{t.orderNow}</button>
                 
                  </div>
              </div>
            </div>
          ))}
        </div>
        <div className="hero-dots">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></button>
          ))}
        </div>
      </section>
  )
}

export default Hero
