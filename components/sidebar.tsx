const Sidebar = (): JSX.Element => {
  return (
    <div
      style={{ backgroundColor: "#30313f" }}
      className="sidebar sidebar-dark"
    >
      <div className="sidebar-header">
        <div className="autofit-row sidebar-section">
          <div className="autofit-col autofit-col-expand">
            <div className="component-title"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
