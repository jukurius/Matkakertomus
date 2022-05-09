import React, { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Card, Container, Form } from 'react-bootstrap'
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import Image from 'react-bootstrap/Image'
import './PersonalInfo.css'


function PersonalInfo(props) {

    const user = props.user;  
    const [name, setName] = useState(user.firstname);
    const [sname, setSName] = useState(user.surname);
    const [username, setUsername] = useState(user.username); 
    const [location, setLocation] = useState(user.locality); 
    const [intro, setIntro] = useState(user.introduction);
    const [userimg, setUserimg] = useState(user.imageUrl);
    const [emaili, setEmaili] = useState(user.email);

    var info;
    const notify = () => toast.success(info, { autoClose: 2500 });
    const notifyError = () => toast.error(info, { autoClose: 2500 });

    const handleName = (e) => {
        setName(e.target.value);
    };

    const handleSName = (e) => {
        setSName(e.target.value);
    };
  
    const handleUsername = (e) => {
        setUsername(e.target.value);
    };

    const handleLocation = (e) => {
        setLocation(e.target.value);
    };

    const handleIntro = (e) => {
        setIntro(e.target.value);
    };
    const relog = () => {
        props.relog();
    }
    const refreshUsers = () => {
        props.getAllUsers();
    }
 
     const uploadImage = async (file) => {
         const data = new FormData();
         data.append("file", file);
         data.append("upload_preset", "d2yl0kee");
         const response = await axios.post(process.env.REACT_APP_CLOUDINARY_URL, data);
         return response.data.secure_url;
     };

    const editUser = async (e) => {
        e.preventDefault();
        var picUrli = "";
        picUrli = await uploadImage(userimg);
        const header = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${props.user.token}`
            }
        }

        const body = {
            firstname: name,
            surname: sname,
            username: username,
            introduction: intro,
            locality: location,
            imageUrl: picUrli,
            email: emaili
        };

        var res;
        try {
            res = await axios.put("http://localhost:3002/api/users/" + props.user.email, JSON.stringify(body), header);
            info = "Käyttäjätiedot päivitetty!"
            relog();
            refreshUsers();
            notify();
        
        } catch (error) {
            info = "Jokin meni pieleen!"
            notifyError();
        }
    }

    const noChanges= (event) => {
        event.preventDefault()
        setName("");
        setSName("");
        setUsername("");
        setLocation("");
        setIntro("");
        setUserimg("");
    }


  return (

    <div className='container-fluid matkat-container'>
                <Container className='inner-section-container'>
                    <div>
                        <h1 className='otsikko text-orange'>Omat tiedot</h1>
                       
                        <hr></hr>                 
                    </div>                   
               
                <div className='bg-light-grey rounded'>
                    <Form className='m-5' onSubmit={(e)=>editUser(e)} id="rekisterointi">
                        <h2 className='pt-5 text-dark-blue'></h2>
                        
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Etunimi  </Form.Label>
                                    <Form.Control size="sm" type="text"  onChange={(e) => handleName(e)} defaultValue={user.firstname} required />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Sukunimi</Form.Label>
                                    <Form.Control size="sm" defaultValue={user.surname} onChange={(e) => handleSName(e)} required />
                                </Form.Group></Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Käyttäjänimi</Form.Label>
                                    <Form.Control size="sm" defaultValue={user.username} onChange={(e) => handleUsername(e)} required />
                                </Form.Group></Col>     
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Paikkakunta</Form.Label>
                                    <Form.Control size="sm" defaultValue={user.locality} onChange={(e) => handleLocation(e)} />
                                </Form.Group></Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Esittelyteksti</Form.Label>
                                    <Form.Control size="sm" defaultValue={user.introduction} onChange={(e) => handleIntro(e)}/>
                                </Form.Group></Col>
                            <Col>
                                <Form.Group controlId="formFileSm" className="mb-3">
                                    <Form.Label>Profiilikuva<Image className="user-image" rounded src={user.imageUrl}></Image></Form.Label>                       
                                    <Form.Control type="file" size="sm" onChange={(event) => setUserimg(event.target.files[0])}/>
                                </Form.Group></Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Sähköpostia ei voi muuttaa</Form.Label>
                                    <Form.Control defaultValue={user.email} disabled />
                                    </Form.Group>
                                </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Salasanaa ei voi muuttaa</Form.Label>
                                    <Form.Control placeholder="******" disabled />
                                    </Form.Group>
                                </Col>
                        </Row>
                       
                       {/*} <Button type='submit' variant='orange' className='me-3 mt-4 mb-5 text-white p-2' onClick={() => editUser()}>Päivitä tiedot</Button>*/}
                       <Button type='submit' variant='orange' className='me-3 mt-4 mb-5 text-white p-2'>Päivitä</Button>
                        <Button type='button' variant='orange' className='mb-5 mt-4 text-white p-2' onClick={noChanges}>Peruuta</Button>

                    </Form>
                </div>
                </Container> 
                <ToastContainer />               
            </div>
  )
}

export default PersonalInfo