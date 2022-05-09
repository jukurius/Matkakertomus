import React, { useContext, useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import { Card, Container, Form } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button';
import './Users.css'
import { NavLink, BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import User from './User';


function Users(props) {
  return (
    <div className='container-fluid matkat-container'>
      <Container className='inner-section-container'>
        <div>
          <h1 className='otsikko text-orange'>Kaikki jäsenet</h1>
          <hr></hr>
          <Table1 data={props.allUsers} curUser={props.user} />
        </div>
      </Container>
    </div>
  );
}
const Table1 = (props) => {
  const list = props.data.map(function (x, i) {
    return (
      <tr key={x.id}>
        <td><NavLink to={'/jasenet/jasen/' + x.id}>{x.username}</NavLink></td>
        <td>{x.firstname}</td>
        <td>{x.surname}</td>
        <td>{x.locality}</td>
      </tr>
    )
  })
  return (
    <Table striped bordered hover size="sm" >
      <thead>
        <tr>
          <th>Käyttäjänimi</th>
          <th>Etunimi</th>
          <th>Sukunimi</th>
          <th>Paikkakunta</th>
        </tr>
      </thead>
      <tbody>
        {list}
      </tbody>
    </Table>
  )
}

export default Users

