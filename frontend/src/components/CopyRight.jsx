import "../assets/css/footer-copyright.css";

const CopyRight = () => {
  return (
    <div className="footer-copyright">
      <span>
        Lagsi &copy; CopyRight 2023 - All right reserved{" "}
        <span className="separator"> &nbsp;-&nbsp; </span>{" "}
        <span className="nexo-creative">
          Desarrollado por:{" "}
          <a className="footer-link" href="https://www.ciberprotection.com">
            &nbsp;
            <img
              className="logo-powered"
              src="/old-logo-ciber-protection-sas.png"
            />
            &nbsp; Ciber Protection S.A.S.
          </a>
        </span>
      </span>
    </div>
  );
};

export default CopyRight;
