import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Matkat.css'
import { Card, Container, Form } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import { useModal } from 'react-hooks-use-modal';
import { DropdownButton } from 'react-bootstrap';
import { Dropdown } from 'react-bootstrap';
import add from './plus.png';
import { Row } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import axios from "axios";
import Image from 'react-bootstrap/Image'

const DataContext = React.createContext({});

function Matkat(props) {
    const [kohteet, setKohteet] = useState([]);
    const [haeLisaa, setHaeLisaa] = useState(6); // Alussa näytetään 8 kohdetta "Hae lisää" napin painalluksella lisätään joka kerta 8.
    const [Modal, open, close] = useModal('root', {
        preventScroll: false,
        closeOnOverlayClick: false,
    });
    const relog = () => {
        props.relog();
    }
    //const [user, setUser] = useState(localStorage.getItem("currentUser"));  // käyttäjä
    const [sortDropDownValue, setSortDropDownValue] = useState("Järjestä");
    const [sightDropDownValue, setSightDropDownValue] = useState("Matkakohteet");
    const [counter, setCounter] = useState(0);
    const [myTrips, setMyTrips] = useState(false);
    const changeCounter = () => { setCounter(counter + 1); }
    const changeMyTrips = () => { setMyTrips(false); }
    const initialData = { user: JSON.parse(localStorage.getItem("currentUser")), myTrips: myTrips, counter: counter, changeCounter: changeCounter, changeMyTrips: changeMyTrips, relog: relog, mySight: sightDropDownValue };
    const [data, setData] = useState(initialData);

    // Kohteiden sorttaus
    const handleSelect = (e) => {
        switch (e) {
            case "0":
                break;
            case "1":
                // Uusin ensin
                setCounter(counter + 1);
                break;
            case "2":
                // Määränpäänmukaan
                kohteet.sort(function (a, b) {
                    var ades = a.destination;
                    var bdes = b.destination;
                    if (ades < bdes) return -1;
                    if (ades > bdes) return 1;
                    return 0;
                });
                break;
            case "3":
                // Kaupungin mukaan
                kohteet.sort(function (a, b) {
                    var ades = a.city;
                    var bdes = b.city;
                    if (ades < bdes) return -1;
                    if (ades > bdes) return 1;
                    return 0;
                });
                break;
            case "4":
                //Maan mukaan
                kohteet.sort(function (a, b) {
                    var ades = a.country;
                    var bdes = b.country;
                    if (ades < bdes) return -1;
                    if (ades > bdes) return 1;
                    return 0;
                });
        }
    }
    // Omat matkat, porukan matkat jne..
    const handleSightSelect = (e) => {
        let data = [];
        switch (e) {
            case "0":
                setMyTrips(false);
                setCounter(counter + 1);
                break;
            case "1":
                setMyTrips(false);
                setCounter(counter + 1);
                break;
            case "2": // omat matkat
                for (const element of kohteet) {
                    if (element.user !== undefined) {
                        if (element.user.email === initialData.user.email) {
                            data.push(element)
                        }
                    }
                }
                setKohteet(data);
                break;
        }
    }
    // Hakee sivun renderöityessä kaikki kohteet kohteet taulukkoon
    useEffect(() => {
        const fetchMatkat = async () => {
            let response = await fetch("http://localhost:3002/api/sights");
            const data = await response.json();
            setKohteet(data.reverse());
        }
        fetchMatkat();
    }, [counter]);

    return (
        <DataContext.Provider value={initialData}>
            <div className='container-fluid matkat-container'>
                <Container className='inner-section-container'>
                    <div>
                        <h1 className='otsikko text-orange'>Matkakohteet</h1>
                        <hr></hr>
                        <div className='select-container'>
                            <DropdownButton id="dropdown-basic-button" title={sightDropDownValue} onSelect={(e) => handleSightSelect(e)}>
                                <Dropdown.Item eventKey={0} onClick={() => setSightDropDownValue("Matkakohteet")}>Matkakohteet</Dropdown.Item>
                                <Dropdown.Item eventKey={1} onClick={() => setSightDropDownValue("Porukan matkat")}>Porukan matkat</Dropdown.Item>
                                <Dropdown.Item eventKey={2} onClick={() => setSightDropDownValue("Omat matkat")}>Omat matkat</Dropdown.Item>
                            </DropdownButton>

                            <DropdownButton id="dropdown-basic-button" title={sortDropDownValue} onSelect={(e) => handleSelect(e)}>
                                <Dropdown.Item className='ps-4' eventKey={0}>Järjestä</Dropdown.Item>
                                <Dropdown.Item className='ps-4' eventKey={1} onClick={() => setSortDropDownValue("Uusin ensin")}>Uusin ensin</Dropdown.Item>
                                <Dropdown.Item className='ps-4' eventKey={2} onClick={() => setSortDropDownValue("Määränpään mukaan")}>Määränpään mukaan</Dropdown.Item>
                                <Dropdown.Item className='ps-4' eventKey={3} onClick={() => setSortDropDownValue("Kaupungin mukaan")}>Kaupungin mukaan</Dropdown.Item>
                                <Dropdown.Item className='ps-4' eventKey={4} onClick={() => setSortDropDownValue("Maan mukaan")}>Maan mukaan</Dropdown.Item>
                            </DropdownButton>
                        </div>
                    </div>
                    <Kortit data={data} omat={myTrips} kohteet={kohteet} haeLisaa={haeLisaa} open={open} close={close} modal={Modal}></Kortit>
                </Container>
                <div className='hae-lisaa'>
                    <Button className='bg-dark-blue text-white hae-lisaa-nappi' onClick={() => setHaeLisaa(haeLisaa + 8)}>Hae Lisää</Button>
                </div>
                <ToastContainer />
            </div>
        </DataContext.Provider>
    )
}
// Lataa Matkakohde kortit
const Kortit = (props) => {
    const [sight, setSight] = useState();
    const [click, setClick] = useState(null);
    const [newSight, setNewSight] = useState(null);
    const [counter, setCounter] = useState(0);
    const context = useContext(DataContext);
    const [stories, setStories] = useState([]);

    useEffect(() => {
        const getStories = async () => {
            const res = await axios.get("http://localhost:3002/api/stories");
            setStories(res.data);
        }
        getStories();
    }, [counter])

    function Modaali(x) {
        setCounter(counter + 1);
        setSight(x);
        setClick(true);
        props.open();
    }
    function addSight() {
        setClick(false);
        setNewSight(true);
        props.open();
    }

    var kohteet = [];
    var laskuri = 0;
    // Pitää muokata tehokkaamaksi. Nyt looppaataan turhaan kaikki kohteet
    kohteet = props.kohteet.map(function (x, i) {
        if (context.mySight === "Omat matkat" && context.user.email === x.user.email) {
            if (laskuri <= props.haeLisaa) {
                laskuri++;
                return (
                    <React.Fragment key={x.id}>
                        {
                            x.private ?
                                <Card style={{ width: '18rem' }} className="card">
                                    <Card.Img style={{ height: "12rem" }} variant="top" src={x.picture} className="kortti" />
                                    <Card.Body>
                                        <Card.Title className="kortti">{`${x.destination}, ${x.city}`}</Card.Title>
                                        <Card.Text className='kortti'>
                                            {x.country}<br /><br />
                                        </Card.Text>
                                        <Card.Text className='private'>
                                            Private
                                        </Card.Text>
                                    </Card.Body>
                                    <Button className='bg-orange text-white ms-5 me-5 mb-4' onClick={() => Modaali(x)}>Lue lisää</Button>
                                </Card> :
                                <Card style={{ width: '18rem' }} className="card">
                                    <Card.Img style={{ height: "12rem" }} variant="top" src={x.picture} />
                                    <Card.Body>
                                        <Card.Title>{`${x.destination}, ${x.city}`}</Card.Title>
                                        <Card.Text>
                                            {x.country}<br /><br />
                                        </Card.Text>
                                    </Card.Body>
                                    <Button className='bg-orange text-white ms-5 me-5 mb-4' onClick={() => Modaali(x)}>Lue lisää</Button>
                                </Card>
                        }
                    </React.Fragment>
                )
            }
        }
        if (context.mySight !== "Omat matkat" && laskuri <= props.haeLisaa && x.private === false) {
            laskuri++;
            return (
                <React.Fragment key={x.id}>
                    <Card style={{ width: '18rem' }} className="card">
                        <Card.Img style={{ height: "12rem" }} variant="top" src={x.picture} />
                        <Card.Body>
                            <Card.Title>{`${x.destination}, ${x.city}`}</Card.Title>
                            <Card.Text>
                                {x.country}<br /><br />
                            </Card.Text>
                        </Card.Body>
                        <Button className='bg-orange text-white ms-5 me-5 mb-4' onClick={() => Modaali(x)}>Lue lisää</Button>
                    </Card>
                </React.Fragment>
            )
        }
    })

    const addCard = (
        <React.Fragment key={"lisaa"}>
            <Card style={{ width: '18rem' }} className="card">
                <Card.Img src={add} style={{ padding: "60px 60px 38px 60px", height: "18rem" }} variant="top"></Card.Img>
                <Button className='bg-orange text-white mt-5 ms-5 me-5 mb-4' onClick={() => addSight()}>Lisää kohde</Button>
            </Card>
        </React.Fragment>
    );
    kohteet.unshift(addCard);

    return (
        <div className='flex-container'>
            {kohteet}
            {
                click && <OpenModal close={props.close} open={props.open} modal={props.modal} sight={sight} counter={counter} setCounter={() => setCounter()} stories={stories} />
            }
            {
                newSight && <AddNewSight close={props.close} open={props.open} modal={props.modal} addNew={setNewSight}></AddNewSight>
            }
        </div>
    )
}
// Kohteen lue lisää modaali
const OpenModal = (props) => {
    const [EditModalStory, open, close] = useModal('root', {
        preventScroll: false,
        closeOnOverlayClick: false,
    });
    const dl = useContext(DataContext);
    const token = dl.user.token;
    const [edit, setEdit] = useState(false);
    const [story, setStory] = useState(false);
    const [omaKohde, setOmakohde] = useState(false);
    const [picture, setPicture] = useState("");
    const [currentStory, setCurrentStory] = useState({});
    const [onkoTarinoita, setOnkotarinoita] = useState(false);

    var info;
    const notify = () => toast.success(info, { autoClose: 2500 });
    const notifyWarning = () => toast.error(info, { autoClose: 2500 });
    const handleDelete = (id) => { deleteSight(id); }

    const handleSubmit = async (e) => {
        e.preventDefault()
        var picUrl = "";
        if (picture !== "") { picUrl = await uploadImage(picture); }
        else {
            picUrl = currentStory.picture;
        }
        editStory(picUrl);
    }
    useEffect(() => {
        for (let i = 0; i < props.stories.length; i++) {
            if (props.stories[i].sight === props.sight.id) { // Tarkastetaan onko kohteella matkoja.. RASKAS
                setOnkotarinoita(true);
                break;
            } else {
                setOnkotarinoita(false);
            }
        }
        let data = dl.user.sights;
        for (let i = 0; i < data.length; i++) {
            if (data[i] === props.sight.id) {
                setOmakohde(true);
                break;
            } else {
                setOmakohde(false);
            }
        }
    }, [props.counter]);

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("file", file[0]);
        formData.append("upload_preset", "d2yl0kee");
        const response = await axios.post(process.env.REACT_APP_CLOUDINARY_URL, formData);
        return response.data.secure_url;
    };

    const editStory = async (pic) => {
        const header = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${token}`
            }
        }
        const body = {
            description: currentStory.description,
            picture: pic
        }
        try {
            const res = await axios.put("http://localhost:3002/api/stories/" + currentStory.id, body, header);
            close();
            props.setCounter(props.counter + 1);
            info = "Tarinaa muokattu!"
            notify();
        } catch (error) {
            info = "Jokin meni pieleen!"
            notifyWarning();
        }
    }

    const storiesList = props.stories.map(function (x) {
        if (x.sight === props.sight.id && x.user.email === dl.user.email) {
            return (
                <li key={x.id}>
                    <Row>
                        <p style={{ fontWeight: "bold" }}>{x.user.username} <span style={{ fontWeight: "normal" }}>{x.date}</span></p>
                        <Col xs={3}>
                            <Image src={x.picture} className='mb-4' style={{ maxWidth: "20vh", maxHeight: "40vh" }}></Image>
                        </Col>
                        <Col xs={9}><p className='ms-0'>{x.description}</p></Col>
                    </Row>
                    <Button className='bg-dark-blue mt-4 mb-4 me-4 ps-5 pe-5 text-white' onClick={() => openEditModal(x)}>Muokkaa</Button>
                    <Button className='bg-dark-blue mt-4 mb-4 me-4 ps-5 pe-5 text-white' onClick={() => deleteStory(x.id)}>Poista</Button>
                    <hr></hr>
                </li>
            )
        } else {
            if (x.sight === props.sight.id) {
                return (
                    <li key={x.id}>
                        <Row>
                            <p style={{ fontWeight: "bold" }}>{x.user.username} <span style={{ fontWeight: "normal" }}>{x.date}</span></p>
                            <Col xs={3}>
                                <Image src={x.picture} className='mb-4' style={{ maxWidth: "20vh", maxHeight: "40vh" }}></Image>
                            </Col>
                            <Col xs={5}><p className='ms-0'>{x.description}</p></Col>
                            <hr></hr>
                        </Row>
                    </li>
                )
            }
        }
    })
    const changeCurrentStory = (e) => {
        setCurrentStory({ ...currentStory, description: e.target.value })
    }

    const openEditModal = (story) => {
        setCurrentStory(story)
        open();
    }
    const renderEditModal = () => {
        return (
            <EditModalStory>
                <div className='bg-light-grey rounded kohde-modaali' style={{ maxHeight: "80vh", overflowY: "auto" }}>
                    <Form onSubmit={(e) => handleSubmit(e)} className="add-sight-form">
                        <h2 className='pb-4 text-dark-blue'>Muokkaa tarinaa</h2>
                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Kirjoita tarinasi kohteelle {props.sight.destination}</Form.Label>
                                <Form.Control required as="textarea" value={currentStory.description} onChange={(e) => changeCurrentStory(e)} style={{ height: '20vh', width: '60vh' }} />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Lisää kuva</Form.Label>
                                <FormControl onChange={(e) => setPicture(e.target.files)} type="file" id="formFile" />
                            </Form.Group>
                        </Row>
                        <Button className='bg-orange mt-4 ps-5 pe-5 text-white me-4' type="submit">Muokkaa tarinaa</Button>
                        <Button onClick={close} className='bg-orange mt-4 ps-5 pe-5 text-white'>Sulje</Button>
                    </Form>
                </div>
            </EditModalStory>
        )
    }

    const deleteSight = async (id) => {
        const header = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${token}`
            }
        }
        var res;
        try {
            res = await axios.delete("http://localhost:3002/api/sights/" + id, header);
            if (res.status == 200) {
                props.close();
                info = "Kohteen poistaminen onnistui!"
                await dl.changeCounter(2);
                notify()
            }
        } catch (error) {
            info = "Kohteen poistaminen epäonnistui!"
            notifyWarning()
        }
    }

    const deleteStory = async (id) => {
        const header = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${token}`
            }
        }
        try {
            const res = await axios.delete("http://localhost:3002/api/stories/" + id, header);
            props.setCounter(props.counter + 1);
            props.close();
            info = "Tarina poistettu!"
            notify();
        } catch (error) {
            info = "tarinan poistaminen epäonnistui!"
            notifyWarning();
        }
    }

    const renderContent = () => {
        if (edit) {
            return (
                <EditModal modal={props.modal} setEdit={() => setEdit()} close={props.close} sight={props.sight} open={props} />
            )
        } else if (story) {
            return (
                <AddStoryModal modal={props.modal} setStory={() => setStory()} close={props.close} sight={props.sight} update={() => props.setCounter(props.counter + 1)} />
            )
        } else {
            if (omaKohde && onkoTarinoita === false) {
                return (
                    <props.modal >
                        <div className='bg-light-grey rounded kohde-modaali' style={{ maxHeight: "80vh", overflowY: "auto" }}>
                            <img className='modaalikuva' src={props.sight.picture} style={{ width: 1160 }}></img>
                            <div className='mt-4 modal-text'>
                                <h1>{props.sight.destination}</h1>
                                <p>{`Maa: ${props.sight.country}`}</p>
                                <p>{`Kaupunki: ${props.sight.city}`}</p>
                                <p>{`Kuvaus: ${props.sight.description}`}</p>
                                <p style={{color:"blue"}}>{`Lisännyt: ${props.sight.user.username}`}</p>
                            </div>
                            <div>
                                <h2>Kertomuksia</h2>
                                <hr></hr>
                                <ul style={{ listStyle: "none" }}>
                                    {storiesList}
                                </ul>
                            </div>
                            <div>
                                <Button onClick={props.close} className='bg-orange mt-4 me-4 ps-5 pe-5 text-white'>Sulje</Button>
                                <Button className='bg-orange mt-4 me-4 ps-5 pe-5 text-white' onClick={() => setStory(true)}>Lisää kertomus</Button>
                                <Button className='bg-orange mt-4 me-4 ps-5 pe-5 text-white' onClick={() => setEdit(true)}>Muokkaa kohdetta</Button>
                                <Button className='bg-orange mt-4 me-4 ps-5 pe-5 text-white' onClick={() => handleDelete(props.sight.id)}>Poista kohde</Button>
                            </div>
                        </div>
                    </props.modal >
                )
            } else {
                return (
                    <props.modal >
                        <div className='bg-light-grey rounded kohde-modaali' style={{ maxHeight: "80vh", overflowY: "auto" }}>
                            <img className='modaalikuva' src={props.sight.picture} style={{ width: 1160 }}></img>
                            <div className='mt-4 modal-text'>
                                <h1>{props.sight.destination}</h1>
                                <p>{`Maa: ${props.sight.country}`}</p>
                                <p>{`Kaupunki: ${props.sight.city}`}</p>
                                <p>{`Kuvaus: ${props.sight.description}`}</p>
                                <p style={{color:"blue"}}>{`Lisännyt: ${props.sight.user.username}`}</p>
                            </div>
                            <div>
                                <h2>Kertomuksia</h2>
                                <hr></hr>
                                <ul style={{ listStyle: "none" }}>
                                    {storiesList}
                                </ul>
                            </div>
                            <div>
                                <Button onClick={props.close} className='bg-orange mt-4 me-4 ps-5 pe-5 text-white'>Sulje</Button>
                                <Button className='bg-orange mt-4 me-4 ps-5 pe-5 text-white' onClick={() => setStory(true)}>Lisää kertomus</Button>
                            </div>
                        </div>
                    </props.modal >
                )
            }
        }
    }
    return (
        <div>
            {renderContent()}
            {renderEditModal()}
        </div>
    )
}

const AddStoryModal = (props) => {
    const dl = useContext(DataContext);
    const user = useContext(DataContext);
    const [story, setStory] = useState("");
    const [picture, setPicture] = useState("");
    var info;
    const notify = () => toast.success(info, { autoClose: 2500 });
    const notifyWarning = () => toast.error(info, { autoClose: 2500 });
    const close = () => {
        props.setStory(false);
        props.close();
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        var picUrl = "";
        if (picture !== "") { picUrl = await uploadImage(picture); }
        else {
            picUrl = "https://res.cloudinary.com/dj2uzumds/image/upload/v1648308271/mpp5hojlsgznlagchbwz.jpg";
        }
        postStory(picUrl);
    }

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("file", file[0]);
        formData.append("upload_preset", "d2yl0kee");
        const response = await axios.post(process.env.REACT_APP_CLOUDINARY_URL, formData);
        return response.data.secure_url;
    };

    const postStory = async (pic) => {
        const header = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.user.token}`
            }
        }
        const body = {
            sightId: props.sight.id,
            description: story,
            picture: pic
        }
        try {
            const res = await axios.post("http://localhost:3002/api/stories", JSON.stringify(body), header);
            props.setStory(false);
            props.update();
            info = "Kertomus lisätty!"
            notify();
            props.close();
        } catch (error) {
            info = "Jokin meni pieleen!"
            notifyWarning();
        }

    }
    return (
        <props.modal>
            <div className='bg-light-grey rounded kohde-modaali' style={{ maxHeight: "80vh", overflowY: "auto" }}>
                <Form onSubmit={(e) => handleSubmit(e)} className="add-sight-form">
                    <h2 className='pb-4 text-dark-blue'>Lisää tarina</h2>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>Kirjoita tarinasi kohteelle {props.sight.destination}</Form.Label>
                            <Form.Control required as="textarea" placeholder='Kirjoita...' onChange={(e) => setStory(e.target.value)} style={{ height: '20vh', width: '60vh' }} />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>Lisää kuva</Form.Label>
                            <FormControl onChange={(event) => setPicture(event.target.files)} type="file" id="formFile" />
                        </Form.Group>
                    </Row>
                    <Button className='bg-orange mt-4 ps-5 pe-5 text-white me-4' type="submit">Lisää tarina</Button>
                    <Button onClick={close} className='bg-orange mt-4 ps-5 pe-5 text-white'>Sulje</Button>
                </Form>
            </div>
        </props.modal>
    )

}
const EditModal = (props) => {
    const dl = useContext(DataContext);
    const [destination, setDestination] = useState(props.sight.destination);
    const [city, setCity] = useState(props.sight.city);
    const [country, setCountry] = useState(props.sight.country);
    const [description, setDescription] = useState(props.sight.description);
    const [picture, setPicture] = useState(props.sight.picture);
    const [privatee, setPrivate] = useState(props.sight.private);
    const token = dl.user.token;
    var info;
    const notify = () => toast.success(info, { autoClose: 2500 });
    const notifyWarning = () => toast.error(info, { autoClose: 2500 });
    const close = () => {
        props.close();
        props.setEdit(false);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        editSight(props.sight.id);
    }
    function capitalizeFirstLetter(txt) {
        return txt.charAt(0).toUpperCase() + txt.slice(1);
    }
    const editSight = async (id) => {
        const header = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        const body = {
            destination: capitalizeFirstLetter(destination),
            country: capitalizeFirstLetter(country),
            city: capitalizeFirstLetter(city),
            description: capitalizeFirstLetter(description),
            picture: picture,
            private: privatee
        }
        var res;
        try {
            res = await axios.put("http://localhost:3002/api/sights/" + id, JSON.stringify(body), header)
            info = "Kohteen muokkaus onnistui!"
            dl.changeCounter();
            props.setEdit(false);
            props.close();
            notify()
        } catch (error) {
            info = "Kohteen muokkaus epäonnistui!"
            notifyWarning();
        }
    }
    return (
        <props.modal>
            <div className='bg-light-grey rounded kohde-modaali' style={{ maxHeight: "80vh", overflowY: "auto" }}>
                <Form onSubmit={(e) => handleSubmit(e)} className="add-sight-form">
                    <h2 className='pb-4 text-dark-blue'>Muokkaa kohdetta</h2>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>Kohde</Form.Label>
                            <Form.Control required onChange={(e) => setDestination(e.target.value)} value={destination} type="text" placeholder="Kohde" />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Kaupunki</Form.Label>
                            <Form.Control required onChange={(e) => setCity(e.target.value)} value={city} type="text" placeholder="Kaupunki" />
                        </Form.Group>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label>Maa</Form.Label>
                        <Form.Control required onChange={(e) => setCountry(e.target.value)} value={country} type='text' placeholder="Kohde maa" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Kuvaus</Form.Label>
                        <FormControl required onChange={(e) => setDescription(e.target.value)} value={description} as="textarea" placeholder='Kirjoita lyhyt kuvaus kohteesta' />
                    </Form.Group>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>Lisää kuva</Form.Label>
                            <FormControl onChange={(event) => setPicture(event.target.files)} type="file" id="formFile" />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group>
                            <Form.Check type='checkbox' label='Aseta kohde privaatiksi' checked={privatee} onChange={(e) => setPrivate(e.target.checked)} />
                        </Form.Group>
                    </Row>
                    <Button className='bg-orange mt-4 ps-5 pe-5 text-white me-4' type="submit">Muokkaa kohdetta</Button>
                    <Button onClick={close} className='bg-orange mt-4 ps-5 pe-5 text-white'>Sulje</Button>
                </Form>
            </div>
        </props.modal>
    )
}
const AddNewSight = (props) => {
    const dl = useContext(DataContext);
    const [destination, setDestination] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [description, setDescription] = useState("");
    const [picture, setPicture] = useState("");
    const [privatee, setPrivate] = useState(false);
    var info;
    const notify = () => toast.success(info, { autoClose: 2500 });
    const notifyWarning = () => toast.error(info, { autoClose: 2500 });

    const handleSubmit = async (e) => {
        e.preventDefault();
        props.addNew(false);
        var picUrl = "";
        if (picture !== "") { picUrl = await uploadImage(picture); }
        else {
            picUrl = "https://res.cloudinary.com/dj2uzumds/image/upload/v1648308271/mpp5hojlsgznlagchbwz.jpg";
        }
        postNewSight('http://localhost:3002/api/sights', {
            destination: capitalizeFirstLetter(destination),
            country: capitalizeFirstLetter(country),
            city: capitalizeFirstLetter(city),
            description: capitalizeFirstLetter(description),
            picture: picUrl,
            private: privatee
        })
            .then(res => {
                if (res.status === 200) {
                    dl.changeCounter();
                    dl.relog();
                    props.close();
                    info = "Kohde " + destination + " lisättiin onnistuneesti!"
                    notify()
                }
            });
    }
    function capitalizeFirstLetter(txt) {
        return txt.charAt(0).toUpperCase() + txt.slice(1);
    }

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("file", file[0]);
        formData.append("upload_preset", "d2yl0kee");
        const response = await axios.post(process.env.REACT_APP_CLOUDINARY_URL, formData);
        return response.data.secure_url;
    };

    const formClose = () => {
        props.addNew(false);
        props.close();
    }

    const postNewSight = async (url = '', data) => {
        const header = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${dl.user.token}`
            }
        }
        let response;
        try {
            response = await axios.post(url, JSON.stringify(data), header);
            return response;
        } catch (error) {
            info = "Kohteen " + destination + " lisäys epäonnistui!"
            notifyWarning()
        }
        return response;
    }
    return (
        <div>
            <props.modal>
                <div className='bg-light-grey rounded kohde-modaali' style={{ maxHeight: "80vh", overflowY: "auto" }}>
                    <Form onSubmit={(e) => handleSubmit(e)} className="add-sight-form">
                        <h2 className='pb-4 text-dark-blue'>Lisää kohde</h2>
                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Kohde</Form.Label>
                                <Form.Control required onChange={(e) => setDestination(e.target.value)} value={destination} type="text" placeholder="Kohde" />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Kaupunki</Form.Label>
                                <Form.Control required onChange={(e) => setCity(e.target.value)} value={city} type="text" placeholder="Kaupunki" />
                            </Form.Group>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Maa</Form.Label>
                            <Form.Control required onChange={(e) => setCountry(e.target.value)} value={country} type='text' placeholder="Kohde maa" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Kuvaus</Form.Label>
                            <FormControl required onChange={(e) => setDescription(e.target.value)} value={description} as="textarea" placeholder='Kirjoita lyhyt kuvaus kohteesta' />
                        </Form.Group>
                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Lisää kuva</Form.Label>
                                <FormControl onChange={(event) => setPicture(event.target.files)} type="file" id="formFile" />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group>
                                <Form.Check type='checkbox' label='Aseta yksityiseksi' onChange={(e) => setPrivate(e.target.checked)} />
                            </Form.Group>
                        </Row>
                        <Button className='bg-orange mt-4 ps-5 pe-5 text-white me-4' type="submit">Lisää kohde</Button>
                        <Button onClick={formClose} className='bg-orange mt-4 ps-5 pe-5 text-white'>Sulje</Button>
                    </Form>
                </div>
            </props.modal>
        </div>
    )
}

export default Matkat