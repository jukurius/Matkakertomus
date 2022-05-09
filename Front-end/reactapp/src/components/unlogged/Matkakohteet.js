import React, { useEffect, useState } from 'react';
import './Matkakohteet.css'
import { Card, Container } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import { useModal } from 'react-hooks-use-modal';

function Matkakohteet() {
  const [kohteet, setKohteet] = useState([]);
  const [haeLisaa, setHaeLisaa] = useState(7); // Alussa näytetään 8 kohdetta "Hae lisää" napin painalluksella lisätään joka kerta 8.
  const [Modal, open, close] = useModal('root', {
    preventScroll: false,
    closeOnOverlayClick: false,
  });

  // Hakee sivun renderöityessä kaikki kohteet kohteet taulukkoon
  useEffect(() => {
    const fetchMatkat = async () => {
      let response = await fetch("http://localhost:3002/api/sights");
      setKohteet(await response.json());
    }
    fetchMatkat();
  }, []);

  return (
    <div className='container-fluid bg-light-grey outer-section-container' id='kohteet'>
      <Container className='inner-section-container'>
        <div>
          <h1 className='otsikko text-orange'>Matkakohteet</h1>
          <hr></hr>
        </div>
        <Kortit kohteet={kohteet} haeLisaa={haeLisaa} open={open} close={close} modal={Modal}></Kortit>
      </Container>
      <div className='hae-lisaa'>
        <Button className='bg-dark-blue text-white hae-lisaa-nappi' onClick={() => setHaeLisaa(haeLisaa + 8)}>Hae Lisää</Button>
      </div>
    </div>
  )
}
// Lataa Matkakohde kortit
const Kortit = (props) => {
  const [sight, setSight] = useState();
  const [click, setClick] = useState(false);

  function Modaali(x) {
    setSight(x);
    setClick(true);
    props.open();
  }
  var counter = 0;
  // Pitää muokata tehokkaamaksi. Nyt looppaataan turhaan kaikki kohteet
  const kohteet = props.kohteet.map(function (x, i) {
    if (counter <= props.haeLisaa && x.private === false) {
      counter++;
      return (
        <Card key={x.id} style={{ width: '18rem' }} className="card">
          <Card.Img style={{ height: "12rem" }} variant="top" src={x.picture} />
          <Card.Body>
            <Card.Title>{`${x.destination}, ${x.city}`}</Card.Title>
            <Card.Text>
              {x.country}<br /><br />
              {/* {x.description} */}
            </Card.Text>
          </Card.Body>
          <Button className='bg-orange text-white ms-5 me-5 mb-4' onClick={() => Modaali(x)}>Lue lisää</Button>
        </Card>
      )
    }
  })
  return (
    <div className='flex-container'>
      {kohteet}
      {
        click ? <OpenModal close={props.close} open={props.open} modal={props.modal} sight={sight} />
          : null
      }
    </div>
  )
}
// Kohteen lue lisää modaali
const OpenModal = (props) => {
  return (
    <props.modal>
      <div className='bg-light-grey rounded kohde-modaali' style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <img className='modaalikuva' src={props.sight.picture} style={{ width: 1160 }}></img>
        <div className='mt-4 modal-text'>
          <h1>{props.sight.destination}</h1>
          <p>{`Maa: ${props.sight.country}`}</p>
          <p>{`Kaupunki: ${props.sight.city}`}</p>
          <p>{`Kuvaus: ${props.sight.description}`}</p>
        </div>
        <Button onClick={props.close} className='bg-orange mt-4 ps-5 pe-5 text-white'>Sulje</Button>
      </div>
    </props.modal>
  )
}

export default Matkakohteet