import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { RecordHistory, HistoryItem, ConfirmDeleteHistoryItem, GetHistoryList, PlayAudio } from './History';
import { ChangePassForm } from './Password';
import heroImage from '../assets/hero-small.png';
import './Grid.css';

function Profile(props) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [widget, setWidget] = useState(false);
    const [wakeLock, setWakeLock] = useState(null);
    const [menuData, setMenuData] = useState(null);
    const [name, setName] = useState('');
    const [blobUrl, setBlobUrl] = useState(null);
    
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

    const ShowRoutines = async(routines) => {
	routines.sort((a, b) => a.name.localeCompare(b.name));
	setWidget(
	    <div className="flexible-grid-container">
	    {routines.map((routine) => (
		<div key={routine.routine_id} className="grid-item">
		    <a href='#' onClick={() => EditRoutineForm(routine)}>{routine.name}</a>
		</div>
	    ))}
	    </div>
	);
    }
    
    const ShowExercises = async(exercises) => {
	exercises.sort((a, b) => a.name.localeCompare(b.name));
	setWidget(
	    <div className="flexible-grid-container">
	    {exercises.map((exercise) => (
		<div key={exercise.exercise_id} className="grid-item">
		    <a href='#' onClick={() => EditExercise(exercise)}>{exercise.name}</a>
		</div>
	    ))}
	    </div>
	);
    }

    const EditRoutineForm = async(routine) => {
	setWidget(
	    <div className="form-group">
		<form id="EditRoutine" onSubmit={SaveRoutine}>
		    <input
			type='hidden'
			name='routine_id'
			defaultValue={routine.routine_id}
		    />
		    <label htmlFor="name">Name:</label>
		    <input
			name='name'
			id='name'
			type='text'
			defaultValue={routine.name}
			required
		    />
		    <br />
		    {routine.exercises.map((exercise) => (
			<>
			    <label htmlFor='exercise_name'>{exercise.name}</label>
			    <input
			    type='text'
				name='order'
				defaultValue={exercise.order}
			    />
			    <br />
			</>

		    ))}
		    
		    <br />
		    <button type="submit">Save Routine</button>
		</form>
	    </div>
	);
    }

    const SaveRoutine = async() => {
	event.preventDefault();
	const form = event.target;
	const formData = new FormData(form);
	const formValues = Object.fromEntries(formData.entries());

	console.log(formValues);
    }
    
    const EditExercise = async(exercise) => {
	setWidget(
	    <div>
		<p>Edit {exercise.name}</p>
	    </div>
	);
    }
    
    const DisplayUser = async(user_data) => {
	setWidget(
	    <div>
		<dl>
		    <dt>Username</dt>
		    <dd>{user_data.username}</dd>
		</dl>
		<dl>
		    <dt>Full Name</dt>
		    <dd>{user_data.full_name}</dd>		
		</dl>
		<dl>
		    <dt>Admin?</dt>
		    <dd>{user_data.is_admin ? 'Yes' : 'No'}</dd>		
		</dl>
		<dl>
		    <dt>Timezone</dt>
		    <dd>{user_data.timezone}</dd>		
		</dl>
	    </div>
	);
    }

    const About = async() => {
	setWidget(
	    <p>Hermes (&#x1F19;&#x3C1;&#x3BC;&#x1FC6;&#x3C2;) is a system for
	    providing audio guidance for exercise regimens and recording
	    progress with those regimens.</p>
	);
    }
    
    const Fortune = async() => {
	fetch('/api/fortune', {
	    headers: {
		'Authorization': 'Bearer ' + props.token,
	    },
	})
	.then((response) => {
	    if (!response.ok) {
		throw new Error("HTTP error! Status: ${response.status}");
	    }
	    return response.json();
	})
	.then((json) => {
	    if (json.success) {
		setWidget(
		    <div>
			<pre style={{fontSize: '14px'}}>{json.fortune}</pre>
		    </div>
		);
	    }
	    else {
		setWidget(
		    <div>
			<p>Error: {json.error}</p>
		    </div>
		);
	    }
	});
    }

    const EditRoutines = async(routines) => {
	console.log(routines);
	setWidget(
	    <div>XXX Not implemented yet XXX</div>
	);
    }
    
    const EditExercises = async(exercises) => {
	console.log(exercises);
	setWidget(
	    <div>XXX Also not implemented yet XXX</div>
	);
    }
    
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
	setMenuData(false);
    }, []);
    if (loading) return <p>Loading...</p>;
    if (!menuData) {
	setMenuData([
	    {
		img: heroImage,
		url: "#",
		submenu: [
		    { text: 'Info', url: '#', onClick: () => DisplayUser(data.user) },
		    { text: 'Change Password', url: '#', onClick: () => ChangePassForm(setWidget, props) },
		    { text: 'Wisdom', url: '#', onClick: () => Fortune() },
		    { text: 'About', url: '#', onClick: () => About() },
		    { text: 'Report An Issue', url: 'https://github.com/chardin/hermes-ui/issues/new', newWindow: true},
		    { text: 'Logout', url: '#', onClick: () => logMeOut() }
		]
	    },
	    {
		text: 'Play',
		url: '#',
		submenu: data.routines.sort((a, b) => a.name.localeCompare(b.name)).map((routine) => (
		    { text: routine.name,
		      url: '#',
		      onClick: () => PlayAudio(setWidget, setBlobUrl, setWakeLock, props, routine)
		    }))
	    },
	    {
		text: 'History',
		url: '#',
		onClick: () => GetHistoryList(setWidget, props, 0, 0)
	    },
	    {
		text: 'Edit XXX',
		url: '#',
		submenu: [
		    { text: 'Routines',
		      url: '#',
		      onClick: () => ShowRoutines(data.routines), },
		    { text: 'Exercises',
		      url: '#',
		      onClick: () => ShowExercises(data.exercises), },
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
			{widget ? widget : ''}
		    </div>
		</main>
	    </div>
	</div>
    );
    
}
export default Profile;
