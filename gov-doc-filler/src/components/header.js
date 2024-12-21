import React from 'react';

const Header = ({ toggleSidebar, sidebarVisible }) => (
  <div className="header">
    <h1>Document Filler</h1>
    <button className="toggle-sidebar" onClick={toggleSidebar}>
      {sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
    </button>
  </div>
);

export default Header;
