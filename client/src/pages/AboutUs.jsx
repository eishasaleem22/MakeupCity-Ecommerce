import React from "react";

function AboutUs() {
  return (
    <main style={styles.page}>
      {/* =========================
          HERO SECTION
      ========================= */}

      <section style={styles.heroSection}>
        <div style={styles.heroOverlay}>
          <p style={styles.smallHeading}>
            WELCOME TO MAKEUP CITY
          </p>

          <h1 style={styles.heroTitle}>
            Beauty You Can Trust.
          </h1>

          <p style={styles.heroText}>
            Bringing you authentic, original and carefully selected
            beauty products for the past 5 years.
          </p>
        </div>
      </section>

      {/* =========================
          OUR STORY
      ========================= */}

      <section style={styles.section}>
        <div style={styles.contentContainer}>
          <div style={styles.textColumn}>
            <p style={styles.sectionLabel}>
              OUR STORY
            </p>

            <h2 style={styles.sectionTitle}>
              Five Years of Beauty, Trust & Quality
            </h2>

            <p style={styles.paragraph}>
              Makeup City was created with one simple goal:
              to make authentic and high-quality beauty products
              easily accessible to everyone.
            </p>

            <p style={styles.paragraph}>
              For the past five years, we have been working
              passionately to bring our customers a carefully
              selected collection of makeup and beauty products
              from trusted and original brands.
            </p>

            <p style={styles.paragraph}>
              We understand how important it is to know that the
              products you purchase are genuine. That is why
              authenticity, quality and customer satisfaction have
              always remained at the heart of Makeup City.
            </p>

            <p style={styles.paragraph}>
              From everyday essentials to products for creating
              your perfect glam look, we aim to make your beauty
              shopping experience simple, reliable and enjoyable.
            </p>
          </div>

          <div style={styles.storyCard}>
            <div style={styles.storyIcon}>
              💄
            </div>

            <h3 style={styles.cardTitle}>
              Beauty With Confidence
            </h3>

            <p style={styles.cardText}>
              We believe that makeup is more than just cosmetics.
              It is a way to express yourself, feel confident and
              celebrate your individuality.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          WHY MAKEUP CITY
      ========================= */}

      <section style={styles.whySection}>
        <div style={styles.contentContainerColumn}>
          <p style={styles.sectionLabel}>
            WHY MAKEUP CITY?
          </p>

          <h2 style={styles.sectionTitleCenter}>
            What We Stand For
          </h2>

          <p style={styles.introText}>
            We are committed to providing a shopping experience
            built around quality, authenticity and customer trust.
          </p>

          <div style={styles.featuresGrid}>
            {/* Authentic Products */}

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                ✓
              </div>

              <h3 style={styles.featureTitle}>
                Authentic Products
              </h3>

              <p style={styles.featureText}>
                We focus on providing original and authentic
                beauty products so you can shop with confidence.
              </p>
            </div>

            {/* Quality */}

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                ♡
              </div>

              <h3 style={styles.featureTitle}>
                Quality First
              </h3>

              <p style={styles.featureText}>
                Every product is selected with quality and
                customer satisfaction in mind.
              </p>
            </div>

            {/* Customer Trust */}

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                ★
              </div>

              <h3 style={styles.featureTitle}>
                Customer Trust
              </h3>

              <p style={styles.featureText}>
                Building long-term relationships with our
                customers is one of the most important parts
                of what we do.
              </p>
            </div>

            {/* Beauty */}

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                ✨
              </div>

              <h3 style={styles.featureTitle}>
                Beauty For Everyone
              </h3>

              <p style={styles.featureText}>
                We believe everyone deserves access to products
                that help them feel confident and beautiful.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          OUR PROMISE
      ========================= */}

      <section style={styles.promiseSection}>
        <div style={styles.promiseContainer}>
          <p style={styles.sectionLabel}>
            OUR PROMISE
          </p>

          <h2 style={styles.promiseTitle}>
            Your Trust Means Everything To Us
          </h2>

          <p style={styles.promiseText}>
            For five years, we have continued to grow with our
            customers. Our promise is to keep bringing you
            authentic products, maintaining high standards of
            quality and providing an experience you can rely on.
          </p>

          <p style={styles.promiseText}>
            Whether you are looking for your everyday makeup
            essentials or something special for your next look,
            Makeup City is here to make beauty shopping easier
            and more enjoyable.
          </p>

          <div style={styles.signature}>
            With Love, <strong>Makeup City</strong> 💗
          </div>
        </div>
      </section>

      {/* =========================
          FINAL CTA
      ========================= */}

      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>
          Ready to Find Your Perfect Beauty Products?
        </h2>

        <p style={styles.ctaText}>
          Explore our collection of authentic beauty products
          and discover something you'll love.
        </p>

        <a
          href="/#products"
          style={styles.ctaButton}
          className="checkout-button-hover"
        >
          Explore Products
        </a>
      </section>
    </main>
  );
}

const styles = {
  page: {
    backgroundColor: "#fff",
  },

  // ==========================================
  // HERO
  // ==========================================

  heroSection: {
    minHeight: "390px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "60px 20px",
    boxSizing: "border-box",
    background:
      "linear-gradient(135deg, #fce4ec 0%, #fff5f8 50%, #f8bbd0 100%)",
  },

  heroOverlay: {
    maxWidth: "750px",
  },

  smallHeading: {
    color: "#d81b60",
    fontSize: "14px",
    fontWeight: "700",
    letterSpacing: "3px",
    marginBottom: "15px",
  },

  heroTitle: {
    color: "#333",
    fontSize: "48px",
    margin: "0 0 20px",
    fontWeight: "700",
  },

  heroText: {
    color: "#666",
    fontSize: "18px",
    lineHeight: "1.7",
    margin: 0,
  },

  // ==========================================
  // GENERAL SECTION
  // ==========================================

  section: {
    padding: "80px 20px",
    backgroundColor: "#fff",
  },

  contentContainer: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1.4fr 0.8fr",
    gap: "70px",
    alignItems: "center",
  },

  contentContainerColumn: {
    maxWidth: "1100px",
    margin: "0 auto",
    textAlign: "center",
  },

  textColumn: {
    textAlign: "left",
  },

  sectionLabel: {
    color: "#d81b60",
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "2px",
    marginBottom: "10px",
  },

  sectionTitle: {
    color: "#333",
    fontSize: "34px",
    lineHeight: "1.25",
    margin: "0 0 25px",
  },

  sectionTitleCenter: {
    color: "#333",
    fontSize: "34px",
    lineHeight: "1.25",
    margin: "0 0 15px",
  },

  paragraph: {
    color: "#666",
    fontSize: "15px",
    lineHeight: "1.8",
    marginBottom: "17px",
  },

  // ==========================================
  // STORY CARD
  // ==========================================

  storyCard: {
    backgroundColor: "#fce4ec",
    borderRadius: "18px",
    padding: "45px 35px",
    textAlign: "center",
    boxShadow: "0 8px 25px rgba(216,27,96,0.08)",
  },

  storyIcon: {
    width: "75px",
    height: "75px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    fontSize: "35px",
  },

  cardTitle: {
    color: "#333",
    fontSize: "22px",
    marginBottom: "15px",
  },

  cardText: {
    color: "#666",
    fontSize: "14px",
    lineHeight: "1.7",
    margin: 0,
  },

  // ==========================================
  // WHY SECTION
  // ==========================================

  whySection: {
    backgroundColor: "#fff8fa",
    padding: "80px 20px",
  },

  introText: {
    maxWidth: "650px",
    margin: "0 auto 45px",
    color: "#777",
    fontSize: "15px",
    lineHeight: "1.7",
  },

  featuresGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "25px",
    textAlign: "center",
  },

  featureCard: {
    backgroundColor: "#fff",
    padding: "30px 22px",
    borderRadius: "12px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
  },

  featureIcon: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    backgroundColor: "#fce4ec",
    color: "#d81b60",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 18px",
    fontSize: "23px",
    fontWeight: "bold",
  },

  featureTitle: {
    color: "#333",
    fontSize: "18px",
    marginBottom: "10px",
  },

  featureText: {
    color: "#777",
    fontSize: "14px",
    lineHeight: "1.7",
    margin: 0,
  },

  // ==========================================
  // PROMISE
  // ==========================================

  promiseSection: {
    padding: "85px 20px",
    backgroundColor: "#fff",
  },

  promiseContainer: {
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "center",
  },

  promiseTitle: {
    color: "#333",
    fontSize: "34px",
    margin: "0 0 25px",
  },

  promiseText: {
    color: "#666",
    fontSize: "15px",
    lineHeight: "1.8",
    marginBottom: "15px",
  },

  signature: {
    marginTop: "30px",
    color: "#d81b60",
    fontSize: "17px",
    fontStyle: "italic",
  },

  // ==========================================
  // CTA
  // ==========================================

  ctaSection: {
    backgroundColor: "#d81b60",
    color: "#fff",
    textAlign: "center",
    padding: "65px 20px",
  },

  ctaTitle: {
    fontSize: "30px",
    margin: "0 0 15px",
  },

  ctaText: {
    fontSize: "15px",
    lineHeight: "1.7",
    margin: "0 auto 25px",
    maxWidth: "600px",
  },

  ctaButton: {
    display: "inline-block",
    backgroundColor: "#fff",
    color: "#d81b60",
    textDecoration: "none",
    padding: "12px 28px",
    borderRadius: "25px",
    fontSize: "15px",
    fontWeight: "700",
  },
};

export default AboutUs;