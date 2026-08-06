import { useState } from 'react';
import Dropdown from './Dropdown';

function itemCode(item, dropdown, depthLevel) {
    if (item.submenu) {
	return (
		<>
		    <button type="button" aria-haspopup="menu" aria-expanded={dropdown ? "true" : "false"}>
			{item.title}{' '}
			{depthLevel > 0 ? <span>&nbsp;</span> : <span>&raquo;</span>}
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
	    <a href={item.url} onClick={item.onClick}><img src={item.img} /></a>
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
