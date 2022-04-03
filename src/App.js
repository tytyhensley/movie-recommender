import React, { useState } from 'react';
import popcorn from "./images/popcorn.svg";
import next from "./images/next.svg";
import prev from "./images/prev.svg";
import logo from "./images/logo.svg";
import axios from "axios";
import Popup from './Popup';
import './App.css';

const App = () => {
    const [movieList, setList] = useState(null); // sets the state of the list of movies given from api
    const [genre,setGenre]= useState(null); // sets the state of the genre chosen by the user 
    const [popData,setPopup]= useState(null); //holds the specific data from the movie card chosen
    const [pg, setPG]= useState(1); //variable that holds the page count

    const [isOpen, setIsOpen] = useState(false); // controls the whether the popup is open or not
    
    const options = { // the parameters for the api requests
        method: 'GET',
        url: 'https://advanced-movie-search.p.rapidapi.com/discover/movie',
        params: {
            with_genres: genre, 
            page: pg.toString()
        },
        headers: {
            'X-RapidAPI-Host': 'advanced-movie-search.p.rapidapi.com',
            'X-RapidAPI-Key': 'cf656e9357msh60dcb7c1c1d1cfap1205d8jsnec7e18240da9'
        }
    };

    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    const renderMovies = (card, index) => {//cards for streams
        return(
            <div className="movie_card" >{/*displays the grid */}
                <img key={index} onClick={()=>{setPopup(movieList[index]); togglePopup();}} src={card.poster_path} alt="movie poster"/>{/*movie posters */}
                {isOpen && <Popup //the popup window that displays further info of movie selected by user
                content={<>
                    <div className="popup">
                        <img src={popData.poster_path} alt="movie poster"/>
                        <div>
                            <h1>{popData.title}</h1>
                            <h3>{popData.vote_average} ☆</h3>
                            <h4>{popData.release_date}</h4>
                            <br/>
                            <p>{popData.overview}</p>
                        </div>
                    </div>
                </>}
                handleClose={togglePopup}
                />}
            </div>
        )
    }

    async function getRequest () { 
        await axios.request(options).then((response) => { //makes a request to the api with the selected genre, and waits for the call to be finsihed before continuing
            setList(response.data.results);//sets movieList to the given list of movies
            return;
        }).catch((error) => { //catches any errors 
            console.error(error);
        });
    }

    const display = () => { //renders the list of movies based on user selected genre
        if (genre == null) { //if no genre has been chosen show this
            return (
                <div className='no_movies'>
                  <img src={popcorn} alt='popcorn'/>
                  <h1>Get Your Popcorn Ready</h1> 
            </div>
            )
        } else { //if a genre has been chosen show this
            getRequest();//makes a call to the api request function
            return (
                <div className="movie_grid" style={{ color: 'whitesmoke'}}>
                   {movieList ? movieList.map(renderMovies) : 'Loading...' } {/*dislays a Loading screen while waiting for the api call to finish */}
                </div>
            )
        }
    }

    return(
        <div className="app"> {/*the background of the app*/}
            <img alt="site logo" className="logo" src={logo}/>
            <select className="genre_select" onChange={(e)=>{setGenre(e.target.value); setList(null);}}> {/*drop down menu of the genre opti ons the user can pick from*/}
                <option value="" disabled selected hidden>What kind of movie are you feeling today..</option> {/*acts as a placeholder for the drop down menu*/}
                <option value="28" >Action</option>
                <option value="12">Adventure</option>
                <option value="16">Animation</option>
                <option value="35">Comedy</option>
                <option value="80">Crime</option>
                <option value="99">Documentary</option>
                <option value="18">Drama</option>
                <option value="10751">Family</option>
                <option value="14">Fantasy</option>
                <option value="36">History</option>
                <option value="27">Horror</option>
                <option value="10402">Music</option>
                <option value="9648">Mystery</option>
                <option value="10749">Romance</option>
                <option value="878">Sci-Fi</option>
                <option value="10770">TV-Movie</option>
                <option value="53">Thriller</option>
                <option value="10752">War</option>
                <option value="37">Western</option>
            </select>
            <div className="movies">{/*where the list of movies will be displayed*/}
                {display()}
            </div>
            <div onClick={()=>{if(pg < 300){setPG(pg+1); setList(null); }}}>
                <img alt="next page" className="next_pg" src={next} />
            </div>
            <div onClick={()=>{if(pg > 1){setPG(pg-1); setList(null);}}}>
                <img alt="previous page" className="prev_pg" src={prev} />
            </div>
        </div>
    )
}

export default App;