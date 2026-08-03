import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom';
import { JsonView, allExpanded, darkStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import Navbar from './Navbar';
import heroImage from '../assets/hero-small.png';

function Profile(props) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [widget, setWidget] = useState(false);
    const [blobUrl, setBlobUrl] = useState(null);
    const [wakeLock, setWakeLock] = useState(null);
    const [menuData, setMenuData] = useState(null);
    
    const expandToSecondLevel = (level) => level < 2;

    const logMeOut = async() => {
	fetch('/api/invalidate', {
	    method: 'POST',
	})
	.then((response) => {
	    props.token()
	})
	.catch((error) => {
	    if (error.response) {
		console.log('response = ' + error.response);
		console.log('status = ' + error.response.status);
		console.log('headers = ' + error.response.headers);
	    }
	})
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
	    </div>
	);
    }

    const ChangePassForm = async() => {
	setWidget(
	    <div>
		<form id="ChangePass" onSubmit={ChangePass}>
		    <label>Current Password:</label>
		    <input
			type="password"
			id="current_password"
			name="current_password"
			required></input>
		    <br />
		    <label>New Password:</label>
		    <input
			type="password"
			id="new_password"
			name="new_password"
			required></input>
		    <br />
		    <label>Confirm New Password:</label>
		    <input
			type="password"
			id="confirm_password"
			name="confirm_password"
			required></input>
		    <br />
		    <button type="submit">Update Password</button>
		</form>
	    </div>
	);
    }

    const ChangePass = async() => {
	event.preventDefault();
	const form = event.target;
	const formData = new FormData(form);

	const formValues = Object.fromEntries(formData.entries());
	
    	fetch('/api/change_password', {
	    method: 'POST',	    
	    headers: {
		'Authorization': 'Bearer ' + props.token,
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	    },
	    body: JSON.stringify(formValues),
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
		    <p>Password changed!</p>
		);
	    }
	    else {
		setWidget(
		    <p>Error: {json.error}</p>
		);
	    }
	});
    }
    
    const requestWakeLock = async () => {
	if (!('wakeLock' in navigator)) {
	    alert('Wake Lock API is not supported.');
	    return;
	}
	try {
	    const lock = await navigator.wakeLock.request('screen');
	    setWakeLock(lock);
	} catch (err) {
	    console.error(`${err.name}, ${err.message}`);
	}
    };

    const RecordHistory = async(routine_id) => {
	fetch('/api/record_history/' + routine_id, {
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
		    <p>Saved!</p>
		);
	    }
	    else {
		setWidget(
		    <p>Error: {json.error}</p>
		);
	    }
	});
    }

    const HistoryItem = async(history_id) => {
	fetch('/api/history_detail/' + history_id, {
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
			<dl>
			    <dt>Name</dt>
			    <dd>{json.data.name}</dd>
			    <dt>Notes</dt>
			    <dd>{json.data.notes ? json.data.notes : 'None'}</dd>
			</dl>
			<p>Exercise data:</p>
			<JsonView data={json.data.exercises} shouldExpandNode={expandToSecondLevel} style={darkStyles} />
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
    
    function PlayAudio(routine_path, routine_id){
	setWidget(
	    <div>
		<p>Fetching...</p>
	    </div>
	);
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
			<audio controls src={blobUrl} onPlay={requestWakeLock} onEnded={() => RecordHistory(routine_id)} />
		    </div>
		);
	    }
	});
    };

    const GetHistoryList = async(page_num, num_rows) => {
	fetch('/api/routine_history/' + page_num + '/' + num_rows, {
	    headers: {
		'Authorization': 'Bearer ' + props.token,
	    },
	})
	.then((response) => response.json())
	.then((json) => {
	    if (json.success) {
		setWidget(
		    <div>
			<table style={{ width: '100%'}}>
			    <thead>
				<tr>
				    <th>Date</th>
				    <th>Routine</th>
				    <th>Details</th>
				</tr>
			    </thead>
			    <tbody>
				{json.history.map((entry) => (
				    <tr key={entry.history_id}>
					<td>{entry.datetime}</td>
					<td>{entry.name}</td>
					<td><button onClick={() => HistoryItem(entry.history_id)}>Details</button></td>
				    </tr>
				))}
			    </tbody>
			    <tfoot>
				<tr>
				    <th>
					{page_num > 0 ? (
					    <div><button onClick={() => GetHistoryList(page_num - 1, num_rows)}>&larr;</button></div>
					) : (
					    ' ')
					}
				    </th>
				    <th>&nbsp;</th>
				    <th>
					{json.next_page ? (
					    <div><button onClick={() => GetHistoryList(page_num + 1, num_rows)}>&rarr;</button></div>
					) : (
					    ' '
					)}
				    </th>
				</tr>
			    </tfoot>
			</table>
			
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
		onClick: () => setWidget(<div></div>)
	    },
	    {
		title: 'User',
		url: '#',
		submenu: [
		    { title: 'Info', url: '#', onClick: () => DisplayUser(data.user) },
		    { title: 'Change Password', url: '#', onClick: () => ChangePassForm() }
		]
	    },
	    {
		title: 'Play',
		url: '#',
		submenu: data.routines.map((routine) => (
		    { title: routine.name,
		      url: '#',
		      onClick: () => PlayAudio(routine.audio_path, routine.routine_id)
		    }))
	    },
	    {
		title: 'History',
		url: '#',
		onClick: () => GetHistoryList(0, 0)
	    },
	]);
    }
    
    return (
	<div className='Profile'>
            <div style={{ display: 'block', height: '100vh', minHeight: '100vh' }}>
		<Navbar data={menuData} />
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
