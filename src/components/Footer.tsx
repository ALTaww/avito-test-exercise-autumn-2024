import React from "react";
import { A, ComponentContainer } from "../templates";
import GitHubIcon from "@mui/icons-material/GitHub";
import "../css/footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="footer">
        <ComponentContainer>
          <div className="footer__container">
            <div className="footer__logo">
              <A href="https://github.com/ALTaww">
                <GitHubIcon color="action" />
                ALTaww
              </A>
            </div>
          </div>
        </ComponentContainer>
      </div>
    </footer>
  );
};

export default Footer;
