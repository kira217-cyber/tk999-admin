import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";
import CustomSidebar from "./Sidebar";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "../../routes/AppRoutes";
import { AuthProvider } from "../../AuthContext/AuthContext";

export default function DemoSidebar() {


  return (
    <AuthProvider>
      <Router>
        <CustomSidebar />
        
      </Router>
    </AuthProvider>
  );
}
