import React, { useState, useEffect, useCallback } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import { JsonView, allExpanded, darkStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';


function Profile(props) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [widget, setWidget] = useState(false);
    const [blobUrl, setBlobUrl] = useState(null);
    const [wakeLock, setWakeLock] = useState(null);
    
    const expandToSecondLevel = (level) => level < 2;

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
	    setWidget(
		<p>Saved!</p>
	    );
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
		if (!json.success) {
		    throw new Error(json.error);
		}
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
	    });
    }
    
    const PlayAudio = async(event, routine_path, routine_id) => {
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

    const GetHistoryList = async(event, page_num, num_rows) => {
	fetch('/api/routine_history/' + page_num + '/' + num_rows, {
	    headers: {
		'Authorization': 'Bearer ' + props.token,
	    },
	})
	    .then((response) => response.json())
	    .then((entries) => {
		if (entries) {
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
				    {entries.map((entry) => (
					<tr key={entry.history_id}>
					    <td>{entry.datetime}</td>
					    <td>{entry.name}</td>
					    <td><button onClick={() => HistoryItem(entry.history_id)}>Details</button></td>
					</tr>
				    ))}
				</tbody>
			    </table>
			    
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
			<SubMenu label="Play Routine">
			    {data.routines.map((routine) => (
				<MenuItem key={routine.audio_path} onClick={(event) => {PlayAudio(event, routine.audio_path, routine.routine_id)}}> {routine.name} </MenuItem>
			    ))}
			</SubMenu>
			<SubMenu label="Edit Data">
			    <SubMenu label="Routines">
				{data.routines.map((routine) => (
				    <MenuItem key={routine.audio_path}> {routine.name} </MenuItem>
				))}
			    </SubMenu>	
			</SubMenu>
			<MenuItem key='history_list' onClick={(event) => {GetHistoryList(event, 0, 0)}}> Past History </MenuItem>
			
		    </Menu>
		</Sidebar>
		<main style={{ flexGrow: 1, padding: '20px', overflowY: 'auto' }}>
		    <p>Welcome, {data.user.full_name}</p>

		    <div>
			{widget ? widget : ''}
		    </div>
		</main>
	    </div>
	</div>
    );
    
}
export default Profile;
