import React from "react";

const Hero = () => {
  return (
    <div style={styles.hero}>
      
      {/* Background image overlay */}
      <div style={styles.heroOverlay}></div>

      <div style={styles.content}>
        <h1 style={styles.title}>Glow Like Never Before ✨</h1>

        <p style={styles.subtitle}>
          Discover premium beauty, cosmetics & skincare essentials curated for you.
        </p>

      </div>

    </div>
  );
};



const styles = {
  hero: {
    position: "relative",
    backgroundImage: `url("/images/hero-image.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    padding: "80px 20px",
    textAlign: "center",
    marginBottom: "40px",
    overflow: "hidden",
  },

  // Pink transparent layer over the image
  heroOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(252, 228, 236, 0.55)",
    zIndex: 1,
  },

  // Keeps the text above the image and overlay
  content: {
    position: "relative",
    zIndex: 2,
    maxWidth: "700px",
    margin: "0 auto",
  },

  title: {
    fontSize: "42px",
    color: "#880e4f",
    marginBottom: "15px",
  },

  subtitle: {
    fontSize: "18px",
    color: "#563667",
    marginBottom: "25px",
  },

  btn: {
    backgroundColor: "#880e4f",
    color: "#fff",
    padding: "12px 30px",
    textDecoration: "none",
    borderRadius: "30px",
    fontWeight: "bold",
    display: "inline-block",
  },
};
export default Hero;