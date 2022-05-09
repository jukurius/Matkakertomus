import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import './User.css'

function User(props) {
    const params = useParams();
    const { id } = params;
    const [user, setUser] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        for (let i = 0; i < props.allUsers.length; i++) {
            if (props.allUsers[i].id == id) {
                setUser(props.allUsers[i]);
                break;
            }
        }
    })

    return (
        <div className='container-fluid'>
            <Container className='inner-section-container'>
                <div className='kortti-container'>
                </div>
                <div className="cardd mb-3">
                    <div className="row g-0">
                        <div className="col-md-4">
                            <img src={user.imageUrl} className="img-fluid rounded-start" />
                        </div>
                        <div className="col-md-8">
                            <div className="card-body">
                                <h2 className="card-title display-4 text-orange mb-5">{user.username}</h2>
                                <div className='row'>
                                    <h4 className='col text-muted'>Etunimi:</h4>
                                    <p className="card-text col lead">{user.firstname}</p>
                                </div>
                                <div className='row'><hr className='viiva' /></div>
                                <div className='row'>
                                    <h4 className='col text-muted'>Sukunimi:</h4>
                                    <p className="card-text col lead">{user.surname}</p>
                                </div>
                                <div className='row'><hr className='viiva' /></div>
                                <div className='row'>
                                    <h4 className='col text-muted'>Paikkakunta:</h4>
                                    <p className="card-text col lead">{user.locality}</p>
                                </div>
                                <div className='row'><hr className='viiva' /></div>
                                <div className='row'>
                                    <h4 className='col text-muted'>Esittely</h4>
                                </div>
                                <div className='row'>
                                    <p className="card-text col lead">{user.introduction}</p>
                                </div>
                                <p className="card-text"><small className="text-muted">Viimeksi muokattu {user.date}</small></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='button-container'>
                    <Button type='button' variant='dark-blue' onClick={() => navigate("/jasenet")}>Jäsenet-sivulle</Button>
                </div>
            </Container >
        </div >
    )
}

export default User