import React from 'react';
import Button from 'react-bootstrap/Button';
import './Hero.css'

function Hero(props) {
  return (
    <div className='Hero'>
      <div>
        <h1 className='heroheaderr ms-5 text-orange'>Matkakertomus</h1>
        <p className='subheader ms-5 text-dark-blue'>Lue muiden kokemuksia tai jaa omasi</p>
        <div className='hero-buttons'>
          <Button variant='orange' type='button' href='#kohteet' className='ms-5 herobtn'>Katso matkakohteita</Button>
          <Button variant='orange' className='ms-5' type="button" onClick={props.avaa}>Rekisteröidy</Button>
        </div>
      </div>
    </div>

  );
}

export default Hero;
