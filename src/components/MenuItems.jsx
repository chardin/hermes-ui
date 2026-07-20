import { useState } from 'react';
import Dropdown from './Dropdown';

const MenuItems = ({ items, depthLevel }) => {
  const [dropdown, setDropdown] = useState(false);

  return (
    <li 
      className="menu-items"
      onMouseEnter={() => setDropdown(true)}
      onMouseLeave={() => setDropdown(false)}
    >
      {items.submenu ? (
        <>
          <button type="button" aria-haspopup="menu" aria-expanded={dropdown ? "true" : "false"}>
            {items.title}{' '}
            {depthLevel > 0 ? <span>&raquo;</span> : <span className="arrow" />}
          </button>
          <Dropdown 
            submenus={items.submenu} 
            dropdown={dropdown} 
            depthLevel={depthLevel} 
          />
        </>
      ) : (
        <a href={items.url}>{items.title}</a>
      )}
    </li>
  );
};

export default MenuItems;
