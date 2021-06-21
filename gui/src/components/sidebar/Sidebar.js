import React, { useState, useEffect } from "react";
import axios from 'axios';
import Button from '@material-ui/core/Button';
import config from '../../config.json';
import './Sidebar.scss'

function Sidebar(props) {
    const [albums, setAlbums] = useState([]);
    useEffect(() => {
        const fetchAlbums = async () => {
            console.log('Fetching album....');
            var query = `query Query {\
                albums\
            }`
            const result = await axios.post(config.serverUrl + '/graphql', { query }, 
            {   
                headers: 
                { 
                    Accept: 'application/json', 
                    'Content-Type': 'application/json',
                    'Authorization': window.sessionStorage.getItem('token')
                } 
            });
            setAlbums(result.data.data.albums);
        }
        fetchAlbums();
    }, []);

    const handleClick = param => (event) => {
        props.selectAlbum(param);
        event.preventDefault();
    }

    return (
        <div className="sidebar">
            {albums.map((album, index) => {
                if (album) {
                    return (
                        <div className="album" key={index}><Button onClick={handleClick(album)} variant="outlined" color="primary">{album}</Button></div>
                    )
                }
                return (null);
            })}
        </div>
    )
}

export default Sidebar;