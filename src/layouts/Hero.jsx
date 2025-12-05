import React,{useEffect} from 'react'

const Hero = ({currentSlide,t,setCurrentSlide}) => {

   const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YnVyZ2VyfGVufDB8fDB8fHww&w=1000&q=80",
      text: t.betterTaste
    },
    {
      image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnJlc2glMjBqdWljZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
      text: "Fresh Juices Made Daily With Love and Care!"
    },
    {
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGl6emF8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
      text: "Delicious Pizzas That Will Make Your Day Better!"
    },
    {
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMGZyaWVkfGVufDB8fDB8fHww&w=1000&q=80",
      text: "Crispy Fried Chicken That Melts in Your Mouth!"
    }
  ];

   useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);


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
