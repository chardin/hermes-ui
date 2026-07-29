import MenuItems from './MenuItems';
import heroImage from '../assets/hero.png';

const Navbar = ({ data }) => {
  return (
    <nav className="navbar">
	    <img 
		src={heroImage} 
		alt="Hero Background" 
		fetchPriority="high" 
	    />
      <ul className="menus">
        {data.map((menu, index) => {
          const depthLevel = 0;
          return <MenuItems items={menu} key={index} depthLevel={depthLevel} />;
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
