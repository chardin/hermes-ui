export function ShowRoutines(setWidget, props, routines) {
    routines.sort((a, b) => a.name.localeCompare(b.name));
    setWidget(
	<div className="flexible-grid-container">
	    {routines.map((routine) => (
		<div key={routine.routine_id} className="grid-item">
		    <a href='#' key={'link'+routine.routine_id} onClick={() => EditRoutineForm(setWidget, props, routine)}>{routine.name}</a>
		</div>
	    ))}
	</div>
    );
}
    
export function ShowExercises(setWidget, props, exercises) {
    exercises.sort((a, b) => a.name.localeCompare(b.name));
    setWidget(
	<div className="flexible-grid-container">
	    {exercises.map((exercise) => (
		<div key={exercise.exercise_id} className="grid-item">
		    <a href='#' onClick={() => EditExercise(setWidget, props, exercise)}>{exercise.name}</a>
		</div>
	    ))}
	</div>
    );
}

export function EditRoutineForm(setWidget, props, routine) {
    setWidget(
	<div className="form-group">
	    <form id="EditRoutine" onSubmit={(e) => SaveRoutine(e, setWidget, props)}>
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
				<input
				    name={'name-'+exercise.exercise_id}
				    id={'name-'+exercise.exercise_id}
				    key={'name-'+exercise.exercise_id}
				    type='text'
				    defaultValue={exercise.name}
				/>
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
    return (
	<td>
	    <button>-</button>
	    <input
		name={baseName + '-' + id}
		id={baseName + '-' + id}
		key={baseName + '-' + id}
		size="2"
		type='text'
		defaultValue={defaultValue}
		required
	    />
	    <button>+</button>
	</td>
    );
}	

export function SaveRoutine(event, setWidget, props) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());
    
    console.log(formValues);
}
    
export function EditExercise(setWidget, props, exercise) {
    setWidget(
	<div>
	    <p>Edit {exercise.name}</p>
	</div>
    );
}
    
export function EditRoutines(setWidget, props, routines) {
    console.log(routines);
    setWidget(
	<div>XXX Not implemented yet XXX</div>
    );
}
    
export function EditExercises(setWidget, props, exercises) {
    console.log(exercises);
    setWidget(
	<div>XXX Also not implemented yet XXX</div>
    );
}   
