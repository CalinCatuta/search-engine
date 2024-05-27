import React from "react";
import Results from "../components/Results.tsx";
import Search from "../components/Search.tsx";
import Footer from "../components/Footer.tsx";
import "../scss/rezults.scss";
const Rezultate = () => {
  return (
    <div className="rezult-page">
      <Search />
      <Results />
      <Footer />
    </div>
  );
};
export default Rezultate;
