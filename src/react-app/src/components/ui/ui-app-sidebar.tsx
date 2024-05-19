import { Link } from "react-router-dom";
import { useLayoutStore } from "../../core/states/layout-states";
import { useEffect } from "react";

interface SidebarParentMenu {
  key: string;
  location: string;
  name: string;
  children?: SidebarChildMenu[]
}

interface SidebarChildMenu {
  key: string;
  name: string;
  route: string;
}

interface UIAppSidebarProps {
  location: string;
  items: SidebarParentMenu[];
};

export default function UIAppSidebar(props: UIAppSidebarProps) {
  const { selectedSidebarMenu, setSelectedSidebarMenu } = useLayoutStore();

  return (
    <aside style={{minHeight: '80vh'}} className="menu box">
      {props.items.filter((x) => x.location === props.location).map((item: SidebarParentMenu) => [
        <span key={item.key}>
          <p className="menu-label">{item.name}</p>
          <ul className="menu-list">
            {item.children?.map((child: SidebarChildMenu) => (
              <li key={child.key}>
                <Link to={child.route}
                  className={`${selectedSidebarMenu === child.key ? 'is-active' : ''}`}
                  onClick={() => setSelectedSidebarMenu(child.key)}>
                  {child.name}
                </Link>
              </li>
            ))}
          </ul>
          <br />
          </span>
      ])}
    </aside>
  );
}

export type { SidebarParentMenu, SidebarChildMenu };