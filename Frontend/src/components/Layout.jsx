import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Navbar from "./Navbar";
import FOG from "vanta/dist/vanta.fog.min";

const Layout = ({ children }) => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        FOG({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0x2c3e50, 
          backgroundAlpha: 1.0,
          color1: 0xc0392b, 
          color2: 0x2980b9, 
          colorMode: "varianceGradient",
          birdSize: 1.2,
          wingSpan: 30,
          speedLimit: 5,
          separation: 20,
          alignment: 20,
          cohesion: 20,
          quantity: 5,
        })
      );
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div className="relative flex flex-col min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white">
      <Navbar />
      <main className="flex-grow relative z-10 min-h-screen">
        <div
          ref={vantaRef}
          className="absolute top-0 left-0 w-full h-full z-[-1]"
        ></div>
        <div className="container mx-auto py-12 px-6">{children}</div>
      </main>

      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center space-y-2">
          <p className="font-semibold text-lg">
            MindWell 2025
          </p>
          <p className="text-sm">All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;

