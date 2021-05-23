import React, {useState, useEffect} from "react";
import axios from 'axios';
import config from '../../config.json';
import './Photo.scss';

function Photo(props) {
    const { album } = props;
    const [photos, setPhotos] = useState(['']);

    useEffect(() => {
        const fetchPhotos = async () => {
            console.log('fetchPhotosss', album);
            const result = await axios.get(config.serverUrl + '/getPhoto/' + album, {headers: {Accept: 'application/json'}});
            setPhotos(result.data);
        }
        fetchPhotos();
    }, [album]);

    const loadPhoto = (photo) => {
        console.log('load photo', photo);
        const url = config.serverUrl + '/getPhoto/' + album + '?name=' + photo;
        return (<img className="image" src={url}></img>)
    }

    return (
        <div className="container">
            {photos.map((photo) => {
                return loadPhoto(photo)
            })}
        </div>
    )
}

export default Photo;