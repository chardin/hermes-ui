import { JsonView, allExpanded, darkStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

const expandToSecondLevel = (level) => level < 2;

function RecordHistory(pseudoGlobal, routine_id) {
    const props = pseudoGlobal.props;
    const setPanel = pseudoGlobal.setPanel;

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
	    HistoryItem(pseudoGlobal, json.history_id);
	}
	else {
	    setPanel(
		<p>Error: {json.error}</p>
	    );
	}
    });
}

export function HistoryItem(pseudoGlobal, history_id) {
    const props = pseudoGlobal.props;
    const setPanel = pseudoGlobal.setPanel;

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
	    let notesVal = json.data.notes || '';
	    setPanel(
		<div>
		    <dl>
			<dt>Name</dt>
			<dd>{json.data.name}</dd>
			<dt>Date and time</dt>
			<dd>{json.data.exercise_dt}</dd>
			<dt>Notes</dt>
			<dd>
			    <form onSubmit={(e) => saveNotes(e, pseudoGlobal)}>
				<input type='hidden' name='history_id' value={json.history_id} />
				<textarea id='notes'
					  name='notes'
					  rows="5"
					  cols="40"
					  defaultValue={notesVal}>
				</textarea>
				<br />
				<button type='submit'>Update</button>
			    </form>
			</dd>
		    </dl>
		    <p>Exercise data:</p>
		    <JsonView data={json.data.exercises} shouldExpandNode={expandToSecondLevel} style={darkStyles} />
		    <button onClick={() => ConfirmDeleteHistoryItem(pseudoGlobal, json.history_id)}>Delete</button>
		</div>
	    );
	}
	else {
	    setPanel(
		<div>
		    <p>Error: {json.error}</p>
		</div>
	    );
	}
    });
}

function saveNotes(e, pseudoGlobal) {
    e.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());
    const props = pseudoGlobal.props;
    const setPanel = pseudoGlobal.setPanel;
    
    fetch('/api/save_notes', {
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
	    HistoryItem(pseudoGlobal, formValues.history_id);
	}
	else {
	    setPanel(
		<p>Error: {json.error}</p>
	    );
	}
    });    
   
}
    
function ConfirmDeleteHistoryItem(pseudoGlobal, history_id) {
    const props = pseudoGlobal.props;
    const setPanel = pseudoGlobal.setPanel;
    setPanel(
	<div>
	    <p>Delete history item?</p>
	    <br />
	    <button onClick={() => DeleteHistoryItem(pseudoGlobal, history_id)}>Delete</button>
	    &nbsp;
	    <button onClick={() => GetHistoryList(pseudoGlobal, 0, 0)}>Cancel</button>
	</div>
    );
}
    
function DeleteHistoryItem(pseudoGlobal, history_id) {
    const props = pseudoGlobal.props;
    const setPanel = pseudoGlobal.setPanel;

    fetch('/api/delete_history/' + history_id, {
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
	    GetHistoryList(pseudoGlobal, 0, 0);
	}
	else {
	    setPanel(
		<div>
		    <p>Error: {json.error}</p>
		</div>
	    );
	}
    });
}
    
export function GetHistoryList(pseudoGlobal, page_num, num_rows) {
    const props = pseudoGlobal.props;
    const setPanel = pseudoGlobal.setPanel;
    
    fetch('/api/routine_history/' + page_num + '/' + num_rows, {
	headers: {
	    'Authorization': 'Bearer ' + props.token,
	},
    })
    .then((response) => response.json())
    .then((json) => {
	if (json.success) {
	    setPanel(
		<div>
		    <table style={{ width: '100%'}}>
			<thead>
			    <tr>
				<th>Date</th>
				<th>Routine</th>
				<th>Details</th>
				<th>Delete?</th>
			    </tr>
			</thead>
			<tbody>
			    {json.history.map((entry) => (
				<tr key={entry.history_id}>
				    <td>{entry.datetime}</td>
				    <td>{entry.name}</td>
				    <td><button onClick={() => HistoryItem(pseudoGlobal, entry.history_id)}>Details</button></td>
				    <td><button onClick={() => ConfirmDeleteHistoryItem(pseudoGlobal, entry.history_id)}>Delete</button></td>
				</tr>
			    ))}
			</tbody>
			<tfoot>
			    <tr>
				<th>
				    {page_num > 0 ? (
					<div><button onClick={() => GetHistoryList(pseudoGlobal, page_num - 1, num_rows)}>&larr;</button></div>
				    ) : (
					' ')
				    }
				</th>
				<th>&nbsp;</th>
				<th>
				    {json.next_page ? (
					<div><button onClick={() => GetHistoryList(pseudoGlobal, page_num + 1, num_rows)}>&rarr;</button></div>
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
	    setPanel(
		<div>
		    <p>Error: {json.error}</p>
		</div>
	    );
	}
    });
}

export function PlayAudio(pseudoGlobal, routine) {
    const props = pseudoGlobal.props;
    const setPanel = pseudoGlobal.setPanel;
    const setBlobUrl = pseudoGlobal.setBlobUrl;
    const setWakeLock = pseudoGlobal.setWakeLock;
    
    setPanel(
	<div>
	    <p>Fetching...</p>
	</div>
    );
        fetch('/api/routine/' + routine.routine_id, {
	method: 'GET',	    
	headers: {
	    'Authorization': 'Bearer ' + props.token,
	},
    })
    .then((response) => {
	if (!response.ok) {
	    setPanel(
		<div>
		    <p><b>Error:</b> Status code {response.status}: {response.statusText || 'No further message'}</p>
		</div>
	    );
	}
	return response.json();
    })
    .then((json) => {
	if (json.success) {
	    return json.routine;
	}
	else {
	    setPanel(
		<p>Error: {json.error}</p>
	    );
	}
    })
    .then((routine) => {    
	fetch(routine.audio_path, {
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
		let routineFilename = routine.name + '.mp3';
		setPanel(
		    <div>
			<h1 style={{ textAlign: 'center', color: '#EDE8E4' }}>{routine.name}</h1>
			<audio controls src={blobUrl} onPlay={()=>requestWakeLock(setWakeLock)} onEnded={() => RecordHistory(pseudoGlobal, routine.routine_id)} />
			<h2 style={{ textAlign: 'center', color: '#EDE8E4' }}>or <a href={blobUrl} download={routineFilename} type="audio/mpeg" style={{ color: '#83CEEC' }}>download the audio</a></h2>
		    </div>
		);
	    }
	})
    });
}

function requestWakeLock(setWakeLock) {
    if (!('wakeLock' in navigator)) {
	alert('Wake Lock API is not supported.');
	return;
    }
    try {
	navigator.wakeLock.request('screen')
	.then(lock => {
	    setWakeLock(lock);
	})
    } catch (err) {
	console.error(`${err.name}, ${err.message}`);
    }
}

