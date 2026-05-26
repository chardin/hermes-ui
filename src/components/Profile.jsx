import { useState, useEffect } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';

function Profile(props) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
	fetch('http://localhost:5000/api/profile', {
	    headers: {
		Authorization: 'Bearer ' + props.token
	    }
	})
        .then((response) => response.json())
	.then((json) => {
	    setData(json);
	    setLoading(false);})
	.catch((error) => console.error('Error fetching data:', error));
    }, []);
    if (loading) return <p>Loading...</p>;
    return (
	<div className='Profile'>
         <div>
	     <p>Username: {data.user.username}</p>
	     <p>Full name: {data.user.full_name}</p>
	     <Sidebar backgroundColor="#284177">
		 <Menu>
		     <SubMenu label="Routines" backgroundColor="#284177">
			 {data.routines.map((routine) => (
			     <MenuItem backgroundColor="#284177"> {routine.name} </MenuItem>
			 ))}
		     </SubMenu>
		 </Menu>
	     </Sidebar>
	 </div>

	</div>
    );
    
}
export default Profile;
