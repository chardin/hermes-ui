import { PlayAudio } from './History';

export function ShowRoutines(pseudoGlobal, fn) {
    const props = pseudoGlobal.props;
    const setPanel = pseudoGlobal.setPanel;
    const setRoutines = pseudoGlobal.setRoutines;

    function functionDispatchTable(pg, r, f) {
	if (fn == 'edit') {
	    return EditRoutineForm(pg, r);
	}
	if (fn == 'play') {
	    return PlayAudio(pg, r);
	}
	console.error('Function ' + fn + 'not supported');
    }

    fetch('/api/routines', {
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
	    return json.routines;
	}
	else {
	    setPanel(
		<p>Error: {json.error}</p>
	    );
	}
    })
    .then((routines) => {    
	setRoutines(routines);
    
	routines.sort((a, b) => a.name.localeCompare(b.name));
	setPanel(
	    <div className="flexible-grid-container">
		{routines.map((routine) => (
		    <div key={routine.routine_id} className="grid-item">
			<a href='#' key={'link'+routine.routine_id} onClick={() => functionDispatchTable(pseudoGlobal, routine, fn)}>{routine.name}</a>
		    </div>
		))}
	    </div>
	);
    });
}
    
export function ShowExercises(pseudoGlobal) {
    const props = pseudoGlobal.props;
    const setPanel = pseudoGlobal.setPanel;
    const setExercises = pseudoGlobal.setExercises;

    function functionDispatchTable(pg, r, f) {
	if (fn == 'edit') {
	    return EditExerciseForm(pg, r);
	}
	if (fn == 'play') {
	    return PlayAudio(pg, r);
	}
	console.error('Function ' + fn + 'not supported');
    }

    fetch('/api/exercises', {
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
	    return json.exercises;
	}
	else {
	    setPanel(
		<p>Error: {json.error}</p>
	    );
	}
    })
    .then((exercises) => {    
	setExercises(exercises);
    
	exercises.sort((a, b) => a.name.localeCompare(b.name));
	setPanel(
	    <div className="flexible-grid-container">
		{exercises.map((exercise) => (
		    <div key={exercise.exercise_id} className="grid-item">
			<a href='#' key={'link'+exercise.exercise_id} onClick={() => EditExerciseForm(pseudoGlobal, exercise)}>{exercise.name}</a>
		    </div>
		))}
	    </div>
	);
    });
}

function EditRoutineForm(pseudoGlobal, routine) {
    const props = pseudoGlobal.props;
    const setPanel = pseudoGlobal.setPanel;

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
	setPanel(
	    <div className="form-group">
		<form id="EditRoutine" onSubmit={(e) => SaveRoutine(e, pseudoGlobal, routine)}>
		    <input
			type='hidden'
			name='routine_id'
			key='routine_id'
			defaultValue={routine.routine_id}
		    />
		    <label htmlFor="name">Name:</label>
		    <input
			name='name'
			id='name'
			key='name'
			type='text'
			defaultValue={routine.name}
			required
		    />
		    <br />
		    <h3>Exercises:</h3>
		    <table>
			<colgroup>
			    <col style={{width: 'auto'}} />
			    <col style={{width: '150px'}} />
			    <col style={{width: '150px'}} />
			    <col style={{width: '150px'}} />
			    <col style={{width: '150px'}} />
			</colgroup>
			<thead>
			    <tr>
				<th>Name</th>
				<th>Order</th>
				<th>Sets</th>
				<th>Reps</th>
				<th>Paused?</th>
			    </tr>
			</thead>
			<tbody>
			    {routine.exercises.map((exercise) => (
				<tr key={'exercise-'+exercise.exercise_id}>
				    <td>
					<p>{exercise.name}</p>
				    </td>
				    {IntegerWidget('order', exercise.exercise_id, exercise.order)}
				    {IntegerWidget('num_sets', exercise.exercise_id, exercise.num_sets)}
				    {IntegerWidget('num_reps', exercise.exercise_id, exercise.num_reps)}
				    <td>
					<input
					    name={'is_paused-' + exercise.exercise_id}
					    id={'is_paused-' + exercise.exercise_id}
					    key={'is_paused-' + exercise.exercise_id}
					    type='checkbox'
					    value='selected'
					    defaultChecked={exercise.is_paused}				    
					/>
				    </td>
				</tr>
			    ))}
			</tbody>
		    </table>			
		    <button type="submit">Save Routine</button>
		</form>
	    </div>
	);
    });
}

function EditExerciseForm(pseudoGlobal, exercise) {
    const props = pseudoGlobal.props;
    const setPanel = pseudoGlobal.setPanel;

    fetch('/api/exercise/' + exercise.exercise_id, {
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
	    return json.exercise;
	}
	else {
	    setPanel(
		<p>Error: {json.error}</p>
	    );
	}
    })
    .then((exercise) => {
	setPanel(
	    <div className="form-group">
		<form id="EditRoutine" onSubmit={(e) => SaveExercise(e, pseudoGlobal, exercise)}>
		    <input
			type='hidden'
			name='exercise_id'
			key='exercise_id'
			defaultValue={exercise.exercise_id}
		    />
		    <label htmlFor="name">Name:</label>
		    <input
			name='name'
			id='name'
			key='name'
			type='text'
			style={{ width: '100%' }}
			defaultValue={exercise.name}
			required
		    />
		    <br />
		    <label htmlFor="reference_video_url">Reference Video URL:</label>
		    <input
			name='reference_video_url'
			id='reference_video_url'
			key='reference_video_url'
			type='text'
			style={{ width: '100%' }}
			defaultValue={exercise.reference_video_url}
		    />
		    <br />
		    <label htmlFor="supplemental_desc">Supplemental Description:</label>
		    <br />
		    <textarea id='supplemental_desc'
			      name='supplemental_desc'
			      rows="5"
			      cols="40"
			      defaultValue={exercise.supplemental_desc}>
		    </textarea>
		    <br />
		    <h3>Moves:</h3>
		    <table>
			<colgroup>
			    <col style={{width: 'auto'}} />
			    <col style={{width: '150px'}} />
			    <col style={{width: '150px'}} />
			</colgroup>
			<thead>
			    <tr>
				<th>Name</th>
				<th>Order</th>
				<th>Duration (sec)</th>
			    </tr>
			</thead>
			<tbody>
			    {exercise.moves.map((move) => (
				<tr key={'move-'+move.move_id}>
				    <td>
					<input
					    name={'name-'+move.move_id}
					    id={'name-'+move.move_id}
					    key={'name-'+move.move_id}
					    type='text'
					    style={{ width: '100%' }}
					    defaultValue={move.name}
					/>
				    </td>
				    {IntegerWidget('order', move.move_id, move.order)}
				    {IntegerWidget('duration', move.move_id, move.duration)}
				</tr>
			    ))}
			</tbody>
		    </table>			
		    <h3>Properties:</h3>
		    <table>
			<colgroup>
			    <col style={{width: '300px'}} />
			    <col style={{width: 'auto'}} />
			</colgroup>
			<thead>
			    <tr>
				<th>Name</th>
				<th>Value</th>
			    </tr>
			</thead>
			<tbody>
			    {exercise.properties.map((property) => (
				<tr key={'property-'+property.name}>
				    <td>{property.name}</td>
				    <td>
					<input
					    name={'property-'+property.name}
					    id={'property-'+property.name}
					    key={'property-'+property.name}
					    type='text'
					    style={{ width: '100%' }}
					    defaultValue={property.value}
					/>
				    </td>
				</tr>
			    ))}
			</tbody>
		    </table>			
		    <button type="submit">Save Exercise</button>
		</form>
	    </div>
	);
    });
}

function IntegerWidget(baseName, id, defaultValue) {
    let elementName = baseName + '-' + id;
    return (
	<td>
	    <input
		name={elementName}
		id={elementName}
		key={elementName}
		size="2"
		type='text'
		defaultValue={defaultValue}
		required
	    />
	</td>
    );
}

function SaveRoutine(event, pseudoGlobal, routine) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());
    const props = pseudoGlobal.props;
    const setPanel = pseudoGlobal.setPanel;
    const setProfileData = pseudoGlobal.setProfileData;

    fetch('/api/save_routine', {
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
	    if (json.updated) {
		setPanel(
		    <p>Routine updated!</p>
		);
	    }
	    else {
		setPanel(
		    <p>Nothing to update!</p>
		);
	    }
	}
	else {
	    setPanel(
		<p>Error: {json.error}</p>
	    );
	}
    });
    
}
    
function SaveExercise(event, pseudoGlobal, exercise) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());
    const props = pseudoGlobal.props;
    const setPanel = pseudoGlobal.setPanel;
    const setProfileData = pseudoGlobal.setProfileData;
    
    fetch('/api/save_exercise', {
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
	    if (json.updated) {
		setPanel(
		    <p>Exercise updated!</p>
		);
	    }
	    else {
		setPanel(
		    <p>Nothing to update!</p>
		);
	    }
	}
	else {
	    setPanel(
		<p>Error: {json.error}</p>
	    );
	}
    });
    
}    
