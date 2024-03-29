import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import dayjs from 'dayjs';

import './App.css'
import NavComp from './components/NavbarComponent'
import Sidebar from './components/SidebarComponent'
import FilmList from './components/FilmListComponent'
import FILMS from './films';

import { Row, Col, Container } from 'react-bootstrap'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { useState } from 'react';

function App() {

  const [selectedFilter, setSelectedFilter] = useState('filter-all');
  const [films, setFilms] = useState(FILMS);

  const filters = [
    {label: 'All', id: "filter-all", filterFunction: () => true},
    {label: 'Favorites', id: "filter-favorites", filterFunction: (f) => f.favorite},
    {label: 'Best', id: "filter-best", filterFunction: (f) => f.rating == 5},
    {label: 'SeenLastMonth', id: "filter-seen-last-month", filterFunction: (f) => f.watchDate != undefined && dayjs(f.watchDate).month() == dayjs().month() - 1 },
    {label: 'Unseen', id: 'filter-unseen', filterFunction: (f) => f.watchDate === undefined},
  ]

  const addFilm = (film) => {
    setFilms((oldFilms) => [ ...oldFilms, film ]);
  }

  const updateFilm = (film) => {
    setFilms ((oldFilms) => oldFilms.map(
      (f) => {
        if (f.id === film.id) {
          return {"id": film.id, "title": film.title, "favorite": film.favorite, "watchDate": film.watchDate, "rating": film.rating};
        } else {
          return f;
        }
      }
    ));
  }

  return (

    <BrowserRouter>
      <Routes>
      <Route element={
            <>
              <NavComp/>
              <Container fluid as={Row} className="mt-3 h-100">
                <Col md={3} className='below-nav bg-light'>
                  <Sidebar filters={filters} selected={selectedFilter} onSelect={setSelectedFilter} ></Sidebar>
                </Col>
                <Col className='below-nav'><Outlet/></Col>
              </Container>
            </>} >

        <Route index
          element= {<FilmList 
                films={films.filter(filters.find( (f) => f.id == selectedFilter ).filterFunction)} 
                selectedFilter={filters.find( (f) => f.id == selectedFilter).label}
                addFilm={addFilm}
                updateFilm={updateFilm}
                /> }>
        </Route>

      </Route>

      </Routes>
    </BrowserRouter>
          
  )
}

export default App

