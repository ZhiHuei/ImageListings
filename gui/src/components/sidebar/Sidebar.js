import React, {useState, useEffect} from "react";
import axios from 'axios';
import Button from '@material-ui/core/Button';
import config from '../../config.json';
function Sidebar(props) {
    useEffect(() => {
        const fetchAlbums = async () => {
            console.log('Fetching album....');
            var query = `query Query {\
                getAlbums\
            }`
            const result = await axios.post(config.serverUrl + '/graphql', { query }, {headers: {Accept: 'application/json', 'Content-Type': 'application/json'}});
            console.log(result);
        }
        fetchAlbums();
      }, []);

    return (
        <div>
            <Button variant="outlined" color="primary">View More Results</Button>
        </div>
    )
}

export default Sidebar;