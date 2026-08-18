export function ShowRoutines(setWidget, props, routines) {
    console.log(routines);
    routines.sort((a, b) => a.name.localeCompare(b.name));
    setWidget(
	<div className="flexible-grid-container">
	    {routines.map((routine) => (
		<div key={routine.routine_id} className="grid-item">
		    <a href='#' key={'link'+routine.routine_id} onClick={() => EditRoutineForm(setWidget, routine)}>{routine.name}</a>
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

export function EditRoutineForm(setWidget, routine) {
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
		{routine.exercises.map((exercise) => (
		    <>
			<label htmlFor='exercise_name'>{exercise.name}</label>
			<input
			    id={exercise.exercise_id}
			    key={exercise.exercise_id}
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
