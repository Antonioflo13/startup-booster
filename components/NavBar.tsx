import ClayNav from "@clayui/nav";
const Navbar = (): JSX.Element => {
  return (
    <ClayNav className="px-4 py-3 bg-white">
      <ClayNav.Item>
        <div className="text-7">Liferay</div>
        <div className="text-3 text-secondary">liferay-portal</div>
      </ClayNav.Item>
    </ClayNav>
  );
};

export default Navbar;
