import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import "./index.css";
import Home from "./components/Home";
import Navbar from "./components/NavBar";
import Footer from "./components/footer";
import Matches from "./components/Matches";
import News from "./components/News";
import Players from "./components/Players";
import SignIn from "./components/SignIn";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LeagueTable from "./components/table";
import NewsDetails from "./components/NewsDetails";




function App() {
  return (
    <div className="App">
      <div className="content font-josefin px-6 md:px-8">
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetails />} />
          <Route path="/players" element={<Players />} />
          <Route path="/table" element={<LeagueTable />} />
          <Route path="/admin/signin" element={<SignIn />} />
        </Routes>
        <Footer/>
      </div>
    </div>
  );
}

export default App;
// /admin/signin