// app/page.jsx
"use client";
import NavBar from "@components/NavBar";

const Home = () => {
  
  return (
      <>
        <NavBar/>
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <h1 className="text-4xl font-bold text-blue-500">Hello Tailwind with Next.js!</h1>
        </div>
      </>
  );
};

export default Home;
