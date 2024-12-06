
import React from "react";
import Navbar from "../admincomponent/Navbar";
import EnhancedTableDemo from "../admincomponent/Table";
import CallButton from "../component/CallButton";
const AdminPage: React.FC = () => {
  return (
    <>
    <Navbar />
    <EnhancedTableDemo />
    <CallButton />
    </>
  );
};

export default AdminPage;
