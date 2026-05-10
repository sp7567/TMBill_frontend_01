const AboutPage = () => {
  return (
    <div className="page-container" style={{ maxWidth: 800, margin: "0 auto", color: "var(--text-primary)" }}>
      <h1 style={{ fontSize: "3rem", fontWeight: "800", marginBottom: "2rem" }}>
        About Us
      </h1>
      <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)", lineHeight: "1.8", marginBottom: "1.5rem" }}>
        At FoodHub, we believe that food brings people together. Our mission is
        to connect hungry customers with the best local restaurants, offering a
        seamless and delightful dining experience from order to delivery.
      </p>
      <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)", lineHeight: "1.8" }}>
        Whether you are craving a quick snack or a gourmet meal, we have got you
        covered. Partnering with top-rated eateries, we ensure quality, speed,
        and happiness with every bite.
      </p>
    </div>
  );
};

export default AboutPage;
