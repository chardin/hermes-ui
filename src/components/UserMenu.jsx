export function DisplayUser(setWidget, user_data) {
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
	    <dl>
		<dt>Admin?</dt>
		<dd>{user_data.is_admin ? 'Yes' : 'No'}</dd>		
	    </dl>
	    <dl>
		<dt>Timezone</dt>
		<dd>{user_data.timezone}</dd>		
	    </dl>
	</div>
    );
}

export function About(setWidget) {
    setWidget(
	<p>Hermes (&#x1F19;&#x3C1;&#x3BC;&#x1FC6;&#x3C2;) is a system for
	    providing audio guidance for exercise regimens and recording
	progress with those regimens.</p>
    );
}
    
export function Fortune(setWidget, props) {
    fetch('/api/fortune', {
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
		    <pre style={{fontSize: '14px'}}>{json.fortune}</pre>
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

