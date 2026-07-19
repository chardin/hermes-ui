import React, { useState, useEffect, useCallback } from 'react'
import "react-bootstrap-submenu/dist/index.css"
import { Navbar, Nav } from "react-bootstrap";
import { NavDropdownMenu, DropdownSubmenu, MenuItem } from 'react-bootstrap-submenu';
import 'react-bootstrap-submenu/dist/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
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
	.then((json) => {
	    console.log(json);
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
    
    }, []);
    if (loading) return <p>Loading...</p>;
    return (
	<div className='Profile'>
            <div style={{ display: 'flex', height: '100vh', minHeight: '100vh' }}>
		    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="#home">Brand</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          
          <NavDropdownMenu title="Dropdown" id="basic-nav-dropdown">
            <MenuItem href="#action/3.1">Action</MenuItem>
            <MenuItem href="#action/3.2">Another action</MenuItem>
            
            <DropdownSubmenu title="Submenu Level 1">
              <MenuItem href="#action/3.3">Submenu Action</MenuItem>
              <MenuItem href="#action/3.4">Another Submenu Action</MenuItem>
            </DropdownSubmenu>
            
          </NavDropdownMenu>
        </Nav>
	  </Navbar.Collapse>
    </Navbar>
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
