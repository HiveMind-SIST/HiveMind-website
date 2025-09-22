import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import NavBar from "@/components/Navigation";
import ClickSpark from "@/components/ClickSpark";
import React from "react";

const Home = () => {
  return (
    <ClickSpark
      sparkColor="#fbbf24"
      sparkSize={12}
      sparkRadius={20}
      sparkCount={10}
      duration={500}
    >
      <div>
        <NavBar />
        <Hero />
        <Footer />
      </div>
    </ClickSpark>
  );
};

export default Home;
