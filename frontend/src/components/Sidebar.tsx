import { Link } from 'react-router-dom';
import { sidebarData } from '../utils/sidebarData';

export const Sidebar = () => {
  return (
    <div className='sidebar'>
      <nav className='nav-menu'>
        <ul className='nav-menu-items'>
          {sidebarData.map((item) =>
            <li key={item.id} className={item.className}>
              <Link to={item.path}>{item.title}</Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  )
};