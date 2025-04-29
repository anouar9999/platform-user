'use client'
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Image from "next/image";

export default function Loading() {
  return (
    <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100vh",
      backgroundColor: "#05050f",
      position: "relative",
      overflow: "hidden",
    }}
  >

  <div className="logo-container">
    <div className="mb-6 md:mb-8 flex justify-center">
      
    <div className="flex flex-col  justify-center items-center h-screen">
    <Image
      src="https://moroccogamingexpo.ma/wp-content/uploads/2024/02/Logo-MGE-2025-white.svg"
      alt="Brand Logo"
      width={350}
      height={100}
      className="cut-corners"
    />
<div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-primary">

    </div>
  
</div>ssssssssssssssssssssssssssssssssssssss
    
  </div>

    </div>
  </Box>
  );
};

