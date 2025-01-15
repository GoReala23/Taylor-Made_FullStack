import Dashboard from '../Dashboard/Dashboard';

const Layout = ({ children }) => {
  return (
    <div className='layout'>
      <Dashboard />
      {/* <main>{children}</main> */}
    </div>
  );
};

export default Layout;
