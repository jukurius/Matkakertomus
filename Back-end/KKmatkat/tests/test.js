
import supertest from 'supertest'
import mongoose from 'mongoose'
import app from '../app'
const api = supertest(app)

let loggedUserId
let loggedUserToken
let sightid
let storyid


/* Ennen jokaista testiä käyttäjä kirjataan sisään ja
 tarkistetaan onnistunut kirjautuminen
 samalla otetaan token ja userid talteen */


beforeEach( async () =>{

  const response = await api
  .post('/api/login')
  .send( { email: "dbd@app.fi",
  password: "admin"})
  .expect(200)
  .expect('Content-Type', /application\/json/)

  loggedUserToken= response.body.token

  loggedUserId = response.body.id


} )

/* Testaus "describe" lohko ja siihen sisältyvät 6 testiä */

/* Vältetään tarve luoda näin vähälle määrälle testejä oma 
testikanta ja yhteydet kun testit on luotu sellaiseen järjestykseen että ne lisätyt ja muokatut kohteet 
poistetaan poiston testauksen yhteydessä */

describe('käyttäjä kirjautuu ja..', () => {


/* Testataan että kirjautunut käyttäjä pystyy luomaan uuden matkakohteen,
lisäämään sille matkakertomuksen ja päivittämään kertomusta. Varmistetaan testillä että muun kun itseluodun kertomuksen poisto ei onnistu
lopuksi tarkistetaan matkakertomuksen ja matkakohteen poisto
Näin kantaan lisätyt testikohteet samalla myös poistetaan   */

/* lopuksi suljetaan yhteys kantaan */

it('Luo uuden kohteen', async () => {
/* luodaan (POST) uusi kantaan lisättävä objekti 
  ja odotetaan paluuviestin olevan 200 ja 
  response.bodysta löytyvän luotua vastaava "destination" tarkistetaan
  content type on oikein */
   
        const sight = {
            "destination": "testikohde",
            "country": "finland",
            "city": "kuopio",
            "description": "testiviesti",
            "picture": "www.fi", 
            "user": loggedUserId,
            "private": false
          };

      
    const response = await api
      .post('/api/sights')
      .send(sight)
      .set({"Authorization":`bearer ${loggedUserToken} `})
      .expect('Content-Type', /application\/json/)
      .expect(200)
      expect(response.body.destination).toBe("testikohde")

      /* otetaan luodun matkakohteen id talteen */

      sightid = response.body.id

      
  })


     /* luodaan (POST) uusi kantaan lisättävä objekti 
  ja odotetaan paluuviestin olevan 200 ja 
  response.bodysta löytyvän luotua vastaava "description" tarkistetaan
  content type on oikein */

  it('Luo uuden matkakertomuksen', async () => {
  
    const story = {
        "description": "testikuvaus",
        "picture": "www.url.fi", 
        "user": loggedUserId,
        "sightId": sightid,
        "private": false
      };
  
const response = await api
  .post('/api/stories')
  .send(story)
  .set({"Authorization":`bearer ${loggedUserToken} `})
  .expect('Content-Type', /application\/json/)
  .expect(200)

  storyid= response.body.id
  /* otetaan luodun matkakohteen id talteen */



  expect(response.body.description).toBe("testikuvaus")


})


    /* päiviteään (PUT) äsken luotu objekti 
  ja odotetaan paluuviestin olevan 200 ja 
  response.bodysta löytyvän päivitettyä vastaava "description" tarkistetaan
  content type on oikein */

it('päivittää matkakertomuksensa description kentän ', async () => {


  const updatedStory = {
      "description": "uusi testikuvaus"
    };

const response = await api
.put(`/api/stories/${storyid}`)
.send(updatedStory)
.set({"Authorization":`bearer ${loggedUserToken} `})
.expect('Content-Type', /application\/json/)
.expect(200)

storyid= response.body.id
expect(response.body.description).toBe("uusi testikuvaus")


})

  /* Tarkistetaan että (DELETE) operaatio toisen käyttäjän luomaan tarinaan ei onnistu.
   Oletetaan responsena tulevan poistettujen tietojen olevan 0 ja että content type on oikein  */

it('yrittää poistaa toisen käyttäjän matkakertomuksen', async () => {
  let wrongstoryid="624715adb3b5a68c8631691b"
  const response = await api
    .delete(`/api/stories/${wrongstoryid}`)
    .set({"Authorization":`bearer ${loggedUserToken} `})
    .expect('Content-Type', /application\/json/)    
    expect(response.body.deletedCount).toBe(0)
    
})


  /* Tarkistetaan että (DELETE) operaatio onnistuu itse luotuun matkakertomukseen.
   Oletetaan responsena tulevan poistettujen tietojen olevan 1 ja että content type on oikein  */


it('poistaa oman matkakertomuksensa', async () => {

    
    const response = await api
      .delete(`/api/stories/${storyid}`)
      .set({"Authorization":`bearer ${loggedUserToken} `})
      .expect('Content-Type', /application\/json/)
      
      expect(response.body.deletedCount).toBe(1)
      
  })

    /* Tarkistetaan että (DELETE) operaatio onnistuu itse luotuun matkakohteeseen.
   Oletetaan responsena tulevan poistettujen tietojen olevan 1 ja että content type on oikein  */

  it('poistaa lopuksi oman matkakohteensa', async () => {
    const response = await api
    .delete(`/api/sights/${sightid}`)
    .set({"Authorization":`bearer ${loggedUserToken} `})
    .expect('Content-Type', /application\/json/)
    
    expect(response.body.deletedCount).toBe(1) 
      
  })

})

/* suljetaan yhteys*/ 

afterAll(() => {
    mongoose.connection.close()

  })

