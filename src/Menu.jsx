import React from 'react'

const Menu = ({products,activeCategory,t,setActiveCategory,addToCart}) => {
  return (
   <section className="menu-section">
        <div className="container">
          <h2 className="section-title">{t.menu}</h2>
          <div className="menu-nav">
            {Object.keys(products).map(category => (
              <button
                key={category}
                className={`nav-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="menu-grid">
            {products[activeCategory].map(product => (
              <div key={product.id} className="menu-item">
                <div className="menu-item-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="menu-item-info">
                  <h3>{product.name}</h3>
                  <p className="price">{product.price} Birr</p>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
                  >
                    {t.addToCart}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default Menu
