import React, { useState, useEffect } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';

function Profile(props) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [widget, setWidget] = useState(false);
    const [blobUrl, setBlobUrl] = useState(null);
	

    const PlayAudio = async(event, routine_path) => {
	fetch(routine_path, {
	    headers: {
		'Authorization': 'Bearer ' + props.token,
	    },
	})
	.then((response) => {
	    if (!response.ok) {
		throw new Error("HTTP error! Status: ${response.status}");
	    }
	    return response.blob();
	})
	.then((audioBlob) => {
	    return URL.createObjectURL(audioBlob);	
	})
	.then((blobUrl) => {
	    setBlobUrl(blobUrl);
	    if (blobUrl) {
		setWidget(

		    <div>
			<audio controls src={blobUrl} />
		    </div>
		);
	    }
	});
    };

    useEffect(() => {
	fetch('/api/profile', {
	    headers: {
		Authorization: 'Bearer ' + props.token
	    }
	})
        .then((response) => response.json())
	.then((json) => {
	    setData(json);
	    setLoading(false);}
	)
	.catch((error) => console.error('Error fetching data:', error));
    
    }, []);
    if (loading) return <p>Loading...</p>;
    return (
	<div className='Profile'>
            <div style={{ display: 'flex', height: '100vh', minHeight: '100vh' }}>
		<Sidebar backgroundColor="#284177">
		    <Menu
			menuItemStyles={{
			    button: {
				color: '#83CEEC',
				backgroundColor: '#006BBD',
				'&:hover': {
				    backgroundColor: '#284177',
				    color: '#006BBD',
				},
				'&.active': {
				    backgroundColor: '#EDE8E4',
				    color: '#006BBD',
				},
			    },
			    label: {
				fontWeight: 'bold',
				color: '#EDE8E4',
			    },
			    icon: {
				color: '#EDE8E4',
			    },
			}}>
			<MenuItem>Welcome, {data.user.full_name}</MenuItem>

			<SubMenu label="Play Routine">
			    {data.routines.map((routine) => (
				<MenuItem key={routine.audio_path} onClick={(event) => {PlayAudio(event, routine.audio_path)}}> {routine.name} </MenuItem>
			    ))}
			</SubMenu>
			<SubMenu label="Edit Data">
			    <SubMenu label="Routines">
				{data.routines.map((routine) => (
				    <MenuItem key={routine.audio_path}> {routine.name} </MenuItem>
				))}
			    </SubMenu>	
			</SubMenu>
			
		    </Menu>
		</Sidebar>
		<main style={{ flexGrow: 1, padding: '20px', overflowY: 'auto' }}>
		    <div>
			{widget ? widget : ''}
		    </div>
		</main>
	    </div>
	</div>
    );
    
}
export default Profile;
