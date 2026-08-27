export function ShowRoutines(pseudoGlobal, routines) {
    const props = pseudoGlobal.props;
    const setPanel = pseudoGlobal.setPanel;
    
    routines.sort((a, b) => a.name.localeCompare(b.name));
    setPanel(
	<div className="flexible-grid-container">
	    {routines.map((routine) => (
		<div key={routine.routine_id} className="grid-item">
		    <a href='#' key={'link'+routine.routine_id} onClick={() => EditRoutineForm(pseudoGlobal, routine)}>{routine.name}</a>
		</div>
	    ))}
	</div>
    );
}
    
export function ShowExercises(pseudoGlobal, exercises) {
    const props = pseudoGlobal.props;
    const setPanel = pseudoGlobal.setPanel;

    exercises.sort((a, b) => a.name.localeCompare(b.name));
    setPanel(
	<div className="flexible-grid-container">
	    {exercises.map((exercise) => (
		<div key={exercise.exercise_id} className="grid-item">
		    <a href='#' onClick={() => EditExercise(pseudoGlobal, exercise)}>{exercise.name}</a>
		</div>
	    ))}
	</div>
    );
}

function EditRoutineForm(pseudoGlobal, routine) {
    const props = pseudoGlobal.props;
    const setPanel = pseudoGlobal.setPanel;

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

function decrementInteger(event, elementName) {
    console.log(elementName);
}

function SaveRoutine(event, pseudoGlobal, routine) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());
    const props = pseudoGlobal.props;
    const setPanel = pseudoGlobal.setPanel;
    
    console.log(formValues);
    
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
    
function EditExercise(pseudoGlobal, exercise) {
    const props = pseudoGlobal.props;
    const setPanel = pseudoGlobal.setPanel;

    setPanel(
	<div>
	    <p>Edit {exercise.name}</p>
	</div>
    );
}
    
function EditRoutines(pseudoGlobal, routines) {
    const props = pseudoGlobal.props;
    const setPanel = pseudoGlobal.setPanel;

    console.log(routines);
    setPanel(
	<div>XXX Not implemented yet XXX</div>
    );
}
    
function EditExercises(pseudoGlobal, exercises) {
    const props = pseudoGlobal.props;
    const setPanel = pseudoGlobal.setPanel;

    console.log(exercises);
    setPanel(
	<div>XXX Also not implemented yet XXX</div>
    );
}   
