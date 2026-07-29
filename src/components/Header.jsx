import axios from 'axios';

function Header(props) {

    function logMeOut() {
	axios({
	    method: 'POST',
	    url: '/api/invalidate',
	})
	.then((response) => {
	    props.token()
	}).catch((error) => {
	    if (error.response) {
		console.log('response = ' + error.response);
		console.log('status = ' + error.response.status);
		console.log('headers = ' + error.response.headers);
	    }
	})}

    return(
        <header className='App-header'>
            <button onClick={logMeOut}> 
                Logout
            </button>
        </header>
    )
}

export default Header;
