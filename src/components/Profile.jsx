import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { HistoryItem, GetHistoryList, PlayAudio } from './History';
import { ChangePassForm } from './Password';
import { DisplayUser, About, Fortune, LoadProfileData } from './UserMenu';
import { ShowRoutines, ShowExercises } from './Editor';
import heroImage from '../assets/hero-small.png';
import './Grid.css';

function Profile(props) {
    const [profileData, setProfileData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [panel, setPanel] = useState(false);
    const [wakeLock, setWakeLock] = useState(null);
    const [menuData, setMenuData] = useState(null);
    const [name, setName] = useState('');
    const [blobUrl, setBlobUrl] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [routines, setRoutines] = useState([]);

    let pseudoGlobal = {'props': props,
			'setLoading': setLoading,
			'setPanel': setPanel,
			'setExercises': setPanel,
			'setRoutines': setRoutines,
			'setBlobUrl': setBlobUrl,
			'setWakeLock': setWakeLock,
			'profileData': profileData,
			'setProfileData': setProfileData};
    
    const logMeOut = async() => {
	fetch('/api/invalidate', {
	    method: 'POST',
	})
	.then((response) => {
	    localStorage.removeItem('token');
	    window.location.reload();
	})
	.catch((error) => {
	    if (error.response) {
		console.log('response = ' + error.response);
		console.log('status = ' + error.response.status);
		console.log('headers = ' + error.response.headers);
	    }
	})
    }

    useEffect(() => {
	LoadProfileData(pseudoGlobal);
	setMenuData(false);
    }, []);
    if (loading) return <p>Loading...</p>;
    if (!menuData) {
	setMenuData([
	    {
		img: heroImage,
		url: "#",
		submenu: [
		    { text: 'Info', url: '#', onClick: () => DisplayUser(pseudoGlobal) },
		    { text: 'Change Password', url: '#', onClick: () => ChangePassForm(pseudoGlobal) },
		    { text: 'Wisdom', url: '#', onClick: () => Fortune(pseudoGlobal) },
		    { text: 'About', url: '#', onClick: () => About(pseudoGlobal) },
		    { text: 'Report An Issue', url: 'https://github.com/chardin/hermes-ui/issues/new', newWindow: true},
		    { text: 'Logout', url: '#', onClick: () => logMeOut() }
		]
	    },
	    {
		text: 'Play',
		url: '#',
		onClick: () => ShowRoutines(pseudoGlobal, 'play')
	    },
	    {
		text: 'History',
		url: '#',
		onClick: () => GetHistoryList(pseudoGlobal, 0, 0)
	    },
	    {
		text: 'Edit XXX',
		url: '#',
		submenu: [
		    { text: 'Routines',
		      url: '#',
		      onClick: () => ShowRoutines(pseudoGlobal, 'edit'), },
		    { text: 'Exercises',
		      url: '#',
		      onClick: () => ShowExercises(pseudoGlobal), },
		]
	    },
	]);
    }
    
    return (
	<div className='Profile'>
            <div style={{ display: 'block', height: '100vh', minHeight: '100vh' }}>
		<Navbar data={menuData} />
		<br />
		<main style={{ flexGrow: 1, padding: '20px', overflowY: 'auto', display: 'block' }}>
		    <div>
			{panel ? panel : ''}
		    </div>
		</main>
	    </div>
	</div>
    );
    
}
export default Profile;
