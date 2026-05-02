import { useState } from 'react'
import axios from 'axios';

function Profile(props) {

    const [profileData, setProfileData] = useState(null)
    function getData() {
	axios({
	    method: 'GET',
	    url: '/api/profile',
	    headers: {
		Authorization: 'Bearer ' + props.token
	    }
	})
        .then((response) => {
	    const res = response.data
	    console.log(res)
	    res.access_token && props.setToken(res.access_token)
	    setProfileData(({
		username: res.user.username,
		fullName: res.user.full_name}))
	}).catch((error) => {
	    if (error.response) {
		console.log(error.response)
		console.log(error.response.status)
		console.log(error.response.headers)
	    }
	})}

    return (
	<div className='Profile'>

            <p>To get your profile details: </p><button onClick={getData}>Click me</button>
            {profileData && <div>
				<p>Username: {profileData.username}</p>
				<p>Full name: {profileData.fullName}</p>
			    </div>
            }

	</div>
    );
}

export default Profile;
