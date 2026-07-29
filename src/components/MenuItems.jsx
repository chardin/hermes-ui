import { useState } from 'react';
import Dropdown from './Dropdown';

function itemCode(item, dropdown, depthLevel) {
    if (item.submenu) {
	return (
		<>
		    <button type="button" aria-haspopup="menu" aria-expanded={dropdown ? "true" : "false"}>
			{item.title}{' '}
			{depthLevel > 0 ? <span>&raquo;</span> : <span className="arrow" />}
		    </button>
		    <Dropdown 
			submenus={item.submenu} 
			dropdown={dropdown} 
			depthLevel={depthLevel} 
		    />
		</>);
    }
    if (item.img) {
	return (
	    <img src={item.img} />
	);
    }
    if (item.text) {
	return (
	    <p>{item.text}</p>
	);
    }
    if (item.url) {
	return (
	    <a href={item.url} onClick={item.onClick}> {item.title} </a>
	);
    }

    console.error(item);
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
