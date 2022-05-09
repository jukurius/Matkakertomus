import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import './HeroSigned.css'
import Image from 'react-bootstrap/Image'

function Hero_signed(props) {
  var user = props.user;
  return (
    <div className='Hero'>
      <div>
          <Image className="hero-image ms-5" rounded src={user.imageUrl}></Image>
        <h1 className='heroheader ms-5 text-orange'>Tervetuloa </h1>
        <p className='subheader ms-5 text-dark-blue'>Kuopion Kulkijoiden matkakertomuksiin, </p>
        <div className="subheader ms-5 text-dark-blue">
          <p className=''>{user.firstname} {user.surname}!</p>
        </div>
      </div>
    </div>

  );
}

export default Hero_signed;