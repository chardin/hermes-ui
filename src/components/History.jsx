import { JsonView, allExpanded, darkStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

const expandToSecondLevel = (level) => level < 2;

export function RecordHistory(setWidget, props, routine_id) {
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
	    HistoryItem(setWidget, props, json.history_id);
	}
	else {
	    setWidget(
		<p>Error: {json.error}</p>
	    );
	}
    });
}

export function HistoryItem(setWidget, props, history_id) {
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
	    setWidget(
		<div>
		    <dl>
			<dt>Name</dt>
			<dd>{json.data.name}</dd>
			<dt>Date and time</dt>
			<dd>{json.data.exercise_dt}</dd>
			<dt>Notes</dt>
			<dd>
			    <form onSubmit={(e) => saveNotes(e, setWidget, props)}>
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
		    <button onClick={() => ConfirmDeleteHistoryItem(setWidget, props, json.history_id)}>Delete</button>
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

function saveNotes(e, setWidget, props) {
    e.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());
    
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
	    HistoryItem(setWidget, props, formValues.history_id);
	}
	else {
	    setWidget(
		<p>Error: {json.error}</p>
	    );
	}
    });    
   
}
    
export function ConfirmDeleteHistoryItem(setWidget, props, history_id) {
    setWidget(
	<div>
	    <p>Delete history item?</p>
	    <br />
	    <button onClick={() => DeleteHistoryItem(setWidget, props, history_id)}>Delete</button>
	    &nbsp;
	    <button onClick={() => GetHistoryList(setWidget, props, 0, 0)}>Cancel</button>
	</div>
    );
}
    
function DeleteHistoryItem(setWidget, props, history_id) {
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
	    GetHistoryList(setWidget, props, 0, 0);
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
    
export function GetHistoryList(setWidget, props, page_num, num_rows) {
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
				<th>Delete?</th>
			    </tr>
			</thead>
			<tbody>
			    {json.history.map((entry) => (
				<tr key={entry.history_id}>
				    <td>{entry.datetime}</td>
				    <td>{entry.name}</td>
				    <td><button onClick={() => HistoryItem(setWidget, props, entry.history_id)}>Details</button></td>
				    <td><button onClick={() => ConfirmDeleteHistoryItem(setWidget, props, entry.history_id)}>Delete</button></td>
				</tr>
			    ))}
			</tbody>
			<tfoot>
			    <tr>
				<th>
				    {page_num > 0 ? (
					<div><button onClick={() => GetHistoryList(setWidget, props, page_num - 1, num_rows)}>&larr;</button></div>
				    ) : (
					' ')
				    }
				</th>
				<th>&nbsp;</th>
				<th>
				    {json.next_page ? (
					<div><button onClick={() => GetHistoryList(setWidget, props, page_num + 1, num_rows)}>&rarr;</button></div>
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

export function PlayAudio(setWidget, setBlobUrl, setWakeLock, props, routine){
    setWidget(
	<div>
	    <p>Fetching...</p>
	</div>
    );
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
	    setWidget(
		<div>
		    <h1 style={{ textAlign: 'center', color: '#EDE8E4' }}>{routine.name}</h1>
		    <audio controls src={blobUrl} onPlay={()=>requestWakeLock(setWakeLock)} onEnded={() => RecordHistory(setWidget, props, routine.routine_id)} />
		    <h2 style={{ textAlign: 'center', color: '#EDE8E4' }}>or <a href={blobUrl} download={routineFilename} type="audio/mpeg" style={{ color: '#83CEEC' }}>download the audio</a></h2>
		</div>
	    );
	}
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

