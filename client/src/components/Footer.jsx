import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>© 2026 MakeupCity E-Commerce. All rights reserved.</p>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#eeecec",
    color: "#525050",
    textAlign: "center",
    padding: "30px 20px",
    marginTop: "60px",
  },
};

export default Footer;