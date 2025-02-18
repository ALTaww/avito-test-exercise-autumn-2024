import React from "react";
import { A, ComponentContainer } from "../templates";
import GitHubIcon from "@mui/icons-material/GitHub";
import "../css/footer.css";

const Footer = () => {
  return (
    <footer>
      <ComponentContainer>
        <div className="footer">
          <div className="footer__container">
            <div className="footer__logo">
              <A href="https://github.com/ALTaww">
                <GitHubIcon color="action" />
                ALTaww
              </A>
            </div>
          </div>
        </div>
      </ComponentContainer>
    </footer>
  );
};

export default Footer;
