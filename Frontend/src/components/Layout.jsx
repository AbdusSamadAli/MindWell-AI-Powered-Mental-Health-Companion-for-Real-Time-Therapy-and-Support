import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Navbar from "./Navbar";
import FOG from "vanta/dist/vanta.fog.min";
import * as THREE from "three";

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
          backgroundAlpha: 1.0,
          color1: 0xc0392b,
          color2: 0x2980b9,
          colorMode: "varianceGradient",
        })
      );
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden">
      <div ref={vantaRef} className="fixed inset-0 -z-10 w-screen h-screen m-0 p-0" />

      <header className="w-full">
        <Navbar />
      </header>

      <main className="flex-1 w-full">{children}</main>

      <footer className="bg-[#1e293b] text-white py-6 w-screen mt-4">
        <div className="container mx-auto text-center space-y-2">
          <p className="font-semibold text-lg">MindWell 2025</p>
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
