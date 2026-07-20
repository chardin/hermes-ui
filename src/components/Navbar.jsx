import MenuItems from './MenuItems';

const Navbar = ({ data }) => {
  return (
    <nav className="navbar">
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
