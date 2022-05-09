
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import React, { useState, useCallback, useEffect } from 'react';
import { useModal } from 'react-hooks-use-modal';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Hero from './components/unlogged/Hero';
import Hero_signed from './components/logged/Hero_signed';
import Matkakohteet from './components/unlogged/Matkakohteet';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { NavLink, BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Matkat from './components/logged/Matkat';
import Users from './components/logged/Users';
import PersonalInfo from './components/logged/PersonalInfo';
import axios from "axios";
import User from './components/logged/User';

function Navigointi() {
    // Modaalin asennus: npm i react-hooks-use-modal
    // Kirjautumis
    const [Modal, open, close] = useModal('root', {
        preventScroll: true,
        closeOnOverlayClick: false,
    });

    // state muuttujat
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [loginErrorTxt, setloginErrorTxt] = useState("");
    const [user, setUser] = useState({});

    // Funktiot, jotka tallentaa email ja salasana kenttien syötteet statemuuttujiin

    useEffect(() => {
        if (localStorage.getItem("currentUser") != undefined) {
            setUser(JSON.parse(localStorage.getItem("currentUser")));
            setLoggedIn(true);
        }
    }, [])

    const changeEmail = (val) => { setEmail(val.target.value); }
    const changePassword = (val) => { setPassword(val.target.value); }

    const handleSubmit = async (event) => {
        event.preventDefault();
        postLoginData('http://localhost:3002/api/login', { email: email, password: password });
    }

    const postLoginData = async (url = '', data) => {
        try {
            const res = await axios.post(url, data)
            setLoggedIn(true);
            window.localStorage.setItem("currentUser", JSON.stringify(res.data));
            setUser(JSON.parse(localStorage.getItem("currentUser")));
            localStorage.setItem("pass", JSON.stringify(password));
            close();
            console.log("login")
        } catch (error) {
            setloginErrorTxt("Sähköposti tai salasana väärin!");
        }
    }
    const logoff = () => {
        setLoggedIn(false);
        localStorage.clear();
    }

    // Rekisteröinti
    //luo uuden käyttäjän kantaan

    const [name, setName] = useState('');
    const [sname, setSName] = useState('');
    const [username, setUsername] = useState('');
    const [location, setLocation] = useState('');
    const [intro, setIntro] = useState('');
    const [userimg, setUserimg] = useState('');
    const [emaili, setEmaili] = useState('');
    const [passwordi, setPasswordi] = useState('');

    const handleName = (e) => { setName(e.target.value); };

    const handleSName = (e) => { setSName(e.target.value); };

    const handleUsername = (e) => { setUsername(e.target.value); };

    const handleLocation = (e) => { setLocation(e.target.value); };

    const handleIntro = (e) => { setIntro(e.target.value); };

    const handleEmail = (e) => { setEmaili(e.target.value); };

    const handlePassword = (e) => { setPasswordi(e.target.value); };

    const [Modal2, register, finished] = useModal('root', {
        preventScroll: true,
        closeOnOverlayClick: false,
    });

    const uploadImage = async (file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "d2yl0kee");
        const response = await axios.post(process.env.REACT_APP_CLOUDINARY_URL, data);
        return response.data.secure_url;
    };

    const handleRegister = async (event) => {
        var picUrli = "";
        if (userimg != "") {
            picUrli = await uploadImage(userimg);
        } else {
            picUrli = "https://res.cloudinary.com/dj2uzumds/image/upload/v1648308271/mpp5hojlsgznlagchbwz.jpg";
        }

        postRegisterData('http://localhost:3002/api/users', { email: emaili, firstname: name, surname: sname, username: username, locality: location, introduction: intro, imageUrl: picUrli, password: passwordi })
            .then(res => {
                if (res.status === 200) {
                    setName("");
                    setSName("");
                    setUsername("");
                    setEmaili("");
                    setPasswordi("");
                    finished();
                }
                else {
                }
            });
    }
    const [allUsers, setAllUsers] = useState([]);
    const getData = () => {
      fetch('http://localhost:3002/api/users'
        , {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      )
        .then(function (response) {
          //console.log(response)
          return response.json();
        })
        .then(function (myJson) {
          window.localStorage.setItem("userList", JSON.stringify(myJson));
          setAllUsers(JSON.parse(localStorage.getItem("userList")));
        });
    }
    useEffect(() => {
      getData()
    }, [])

    async function postRegisterData(url = '', data) {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        });
        return response;
    }

    //navbar ja perusmodaalit (login & register)
    const handleSubmitReg = (e) => {
        e.preventDefault();
        handleRegister();
    }
    const handleLoginModal = () => {
        finished();
        open();
    }
    const handleRegModal = () => {
        close();
        register();
    }

    return (
        <div>
            <Router>
                {
                    loggedIn
                        // Kirjautunut
                        ? <div className='navbar-container'>
                            <Navbar sticky='top' className='navbar' bg="white" expand="xl">
                                <Container fluid>
                                    <NavLink className="NavLink" to="/"><Navbar.Brand className='me-auto ms-5 text-orange nav-brand'>Kuopion Kulkijat</Navbar.Brand></NavLink>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                    <Navbar.Collapse id="basic-navbar-nav" className='ms-5'>
                                        <Navbar.Text className='me-auto ms-5 text-dark-blue nav-text'>Jäsen: {user.username} </Navbar.Text>
                                        <Nav className="ms-auto me-5 nav">
                                            <NavLink className="text-dark-blue NavLink" to="/">Koti</NavLink>
                                            <NavLink className="text-dark-blue NavLink" to="/matkat">Matkat</NavLink>
                                            <NavLink className="text-dark-blue NavLink" to="/omat%20tiedot">Omat tiedot</NavLink>
                                            <NavLink className="text-dark-blue NavLink" to="/jasenet">Jäsenet</NavLink>
                                            <NavLink className="text-dark-blue NavLink" to="#" onClick={() => logoff()}>Kirjaudu ulos</NavLink>
                                        </Nav>
                                    </Navbar.Collapse>
                                </Container>
                            </Navbar>
                            <Routes>
                                <Route path="/" element={<Hero_signed user={user} />} />
                                <Route path="/matkat" element={<Matkat user={user} relog={() => postLoginData('http://localhost:3002/api/login', { email: user.email, password: JSON.parse(localStorage.getItem("pass")) })} />} />
                                <Route path="/omat%20tiedot" element={<PersonalInfo user={user} getAllUsers={()=>getData()} relog={() => postLoginData('http://localhost:3002/api/login', { email: user.email, password: JSON.parse(localStorage.getItem("pass")) })} />} />
                                <Route path="/jasenet/*" element={<Users user={user} allUsers={allUsers} />} />
                                <Route path="/jasenet/jasen/:id" element={<User allUsers={allUsers} />} />
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </div>
                        // Kirjautumaton
                        : <div className='navbar-container' id='koti'>
                            <Navbar sticky='top' className='navbar' bg="white" expand="lg">
                                <Container fluid>
                                    <Navbar.Brand className='me-auto ms-5 text-orange nav-brand' href="#koti">Kuopion Kulkijat</Navbar.Brand>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                    <Navbar.Collapse id="basic-navbar-nav" className='ms-5'>
                                        <Nav className="ms-auto me-5 nav">
                                            <Nav.Link className='text-dark-blue NavLink ps-0 pe-0' href="#" onClick={() => handleLoginModal()}>Kirjaudu</Nav.Link>
                                            <Nav.Link className='text-dark-blue NavLink ps-0 pe-0' href="#" onClick={() => handleRegModal()}>Rekisteröidy</Nav.Link>
                                            <Nav.Link className='text-dark-blue NavLink ps-0 pe-0' href="#koti">Koti</Nav.Link>
                                            <Nav.Link className='text-dark-blue NavLink ps-0 pe-0' href="#kohteet">Matkakohteet</Nav.Link>
                                        </Nav>
                                    </Navbar.Collapse>
                                </Container>
                            </Navbar>
                            <Hero avaa={register} />
                            <Matkakohteet />
                        </div>
                }
            </Router>


            {/* Kirjautumis modaali */}
            <Modal>
                <div className='bg-light-grey rounded'>
                    <Form className='m-5' onSubmit={(e) => handleSubmit(e)}>
                        <h2 className='pt-5 text-dark-blue'>Kirjaudu</h2>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Sähköpostiosoite</Form.Label>
                            <Form.Control type="email" placeholder="Sähköpostiosoite" value={email} onChange={(e) => changeEmail(e)} />
                            <Form.Text className="text-muted">
                                Me emme koskaan jaa sähköpostiosoitettasi muille.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Salasana</Form.Label>
                            <Form.Control type="password" placeholder="Salasana" value={password} onChange={(e) => changePassword(e)} />
                        </Form.Group>
                        <p className='text-warning'>{loginErrorTxt}</p>
                        <Button type='submit' variant='orange' className='me-3 mt-4 mb-5 text-white p-2'>Kirjaudu</Button>
                        <Button type='button' variant='orange' className='mb-5 mt-4 text-white p-2' onClick={close}>Peruuta</Button>
                    </Form>
                </div>
            </Modal>


            {/* Rekisteröinti modaali */}
            <Modal2>
                <div className='bg-light-grey rounded' onSubmit={(e) => handleSubmitReg(e)}>
                    <Form className='m-5' id="rekisterointi">
                        <h2 className='pt-5 text-dark-blue'>Rekisteröidy</h2>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Etunimi</Form.Label>
                                    <Form.Control size="sm" placeholder="" value={name} onChange={(e) => handleName(e)} required />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Sukunimi</Form.Label>
                                    <Form.Control size="sm" placeholder="" value={sname} onChange={(e) => handleSName(e)} required />
                                </Form.Group></Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Käyttäjänimi</Form.Label>
                                    <Form.Control size="sm" placeholder="" value={username} onChange={(e) => handleUsername(e)} required />
                                </Form.Group></Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Paikkakunta</Form.Label>
                                    <Form.Control size="sm" placeholder="" value={location} onChange={(e) => handleLocation(e)} />
                                </Form.Group></Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Esittelyteksti</Form.Label>
                                    <Form.Control size="sm" placeholder="Kerro itsestäsi muutamalla sanalla." value={intro} onChange={(e) => handleIntro(e)} />
                                </Form.Group></Col>
                            <Col>
                                <Form.Group controlId="formFileSm" className="mb-3">
                                    <Form.Label>Profiilikuva</Form.Label>
                                    <Form.Control type="file" size="sm" onChange={(event) => setUserimg(event.target.files[0])} />
                                </Form.Group></Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Sähköpostiosoite</Form.Label>
                                    <Form.Control size="sm" type="email" placeholder="Sähköpostiosoite" value={emaili} onChange={(e) => handleEmail(e)} required />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group> </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Salasana</Form.Label>
                                    <Form.Control size="sm" type="password" placeholder="Salasana" value={passwordi} onChange={(e) => handlePassword(e)} required />
                                    <Form.Text id="passwordHelpBlock" muted> Salasanan tarkistus.</Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Check type="checkbox" label="Olen lukenut olemattomat käyttäjäehdot." />
                        </Form.Group>
                        <Button type='submit' variant='orange' className='me-3 mt-4 mb-5 text-white p-2'>Luo käyttäjä</Button>
                        <Button type='button' variant='orange' className='mb-5 mt-4 text-white p-2' onClick={finished}>Peruuta</Button>

                    </Form>
                </div>
            </Modal2>
        </div>
    );
}

export default Navigointi;
