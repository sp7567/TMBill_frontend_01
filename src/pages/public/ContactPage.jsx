const ContactPage = () => {
  return (
    <div className="page-container" style={{ maxWidth: 800, margin: "0 auto", color: "var(--text-primary)" }}>
      <h1 style={{ fontSize: "3rem", fontWeight: "800", marginBottom: "2rem" }}>
        Contact Us
      </h1>
      <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)", marginBottom: "2rem" }}>
        Have questions? We would love to hear from you. Reach out to our support
        team and we will get back to you as soon as possible.
      </p>
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <strong style={{ display: "block", marginBottom: "0.5rem" }}>
            Email:
          </strong>
          <span style={{ color: "var(--text-secondary)" }}>
            support@foodhub.com
          </span>
        </div>
        <div>
          <strong style={{ display: "block", marginBottom: "0.5rem" }}>
            Phone:
          </strong>
          <span style={{ color: "var(--text-secondary)" }}>
            +1 (555) 123-4567
          </span>
        </div>
        <div>
          <strong style={{ display: "block", marginBottom: "0.5rem" }}>
            Address:
          </strong>
          <span style={{ color: "var(--text-secondary)" }}>
            123 Food Street, Culinary City, USA
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
