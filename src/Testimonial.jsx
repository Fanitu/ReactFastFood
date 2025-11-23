import React from 'react'

const Testimonial = ({t,}) => {
  return (
    <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">{t.testimonials}</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"{t.testimonial1}"</p>
                <div className="testimonial-author">
                  <strong>- Alex Johnson</strong>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"{t.testimonial2}"</p>
                <div className="testimonial-author">
                  <strong>- Sarah Michael</strong>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"{t.testimonial3}"</p>
                <div className="testimonial-author">
                  <strong>- David Smith</strong>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"{t.testimonial4}"</p>
                <div className="testimonial-author">
                  <strong>- Emily Brown</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default Testimonial
