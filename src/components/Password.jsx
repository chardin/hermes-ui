export function ChangePassForm(pseudoGlobal) {
    const props = pseudoGlobal.props;
    const setPanel = pseudoGlobal.setPanel;
    setPanel(
	<div>
	    <form id="ChangePass" onSubmit={(e) => ChangePass(e, pseudoGlobal)}>
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

function ChangePass(event, pseudoGlobal) {
    event.preventDefault();
    const props = pseudoGlobal.props;
    const setPanel = pseudoGlobal.setPanel;
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
	    setPanel(
		<p>Password changed!</p>
	    );
	}
	else {
	    setPanel(
		<p>Error: {json.error}</p>
	    );
	}
    });
}
