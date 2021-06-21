import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import Photo from "../photo/Photo";
import './Home.scss';

function Home(props) {
    const [selectedAlbum, setSelectedAlbum] = useState('');

    function onAlbumClicked(album) {
        setSelectedAlbum(album);
    }

    return (
        <span className="grid">
            <Sidebar selectAlbum={onAlbumClicked}></Sidebar>
            {selectedAlbum.length ? <Photo album={selectedAlbum}></Photo> : (null)}
        </span>
    )

}

export default Home;