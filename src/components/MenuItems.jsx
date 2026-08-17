import { useState } from 'react';
import Dropdown from './Dropdown';

function itemCode(item, dropdown, depthLevel) {
    let displayElement = '';
    if (item.img) {
	displayElement = <img src={item.img} />;
    }
    if (item.text) {
	displayElement = displayElement + item.text;
    }
    if (! displayElement) {
	return <p>XXX</p>;
    }
    
    if (item.submenu) {
	return (
		<>
		    <button type="button" aria-haspopup="menu" aria-expanded={dropdown ? "true" : "false"}>
			{displayElement}{' '}
			{depthLevel > 0 ? <span>&nbsp;</span> : <span>&raquo;</span>}
		    </button>
		    <Dropdown 
			submenus={item.submenu} 
			dropdown={dropdown} 
			depthLevel={depthLevel} 
		    />
		</>);
    }
    if (item.url) {
	if (item.newWindow) {
	    return (
		<a href={item.url} onClick={item.onClick} target="_blank" rel="noopener noreferrer"> {displayElement} </a>
	    );
	}
	return (
	    <a href={item.url} onClick={item.onClick}> {displayElement} </a>
	);
    }
    else {
	return (
	    {displayElement}
	);
    }
}

const MenuItems = ({ items, depthLevel }) => {
    const [dropdown, setDropdown] = useState(false);

    return (
	<li 
	    className="menu-items"
	    onMouseEnter={() => setDropdown(true)}
	    onMouseLeave={() => setDropdown(false)}
	>
	    {itemCode(items, dropdown, depthLevel)}
	</li>
    );
};

export default MenuItems;
