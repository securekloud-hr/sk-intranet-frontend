import { Outlet } from "react-router-dom";

const IntranetLayout = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Intranet Section</h1>
      <Outlet />
    </div>
  );
};

export default IntranetLayout;
