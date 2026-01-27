import React, { useEffect, useState } from "react";
import styles from "../styles/Login.module.css";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { login, register } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import Help_Centre from "../components/Help_Center";
import OtpDiv from "../components/OtpDiv";
import { useLocation } from "react-router-dom";

function AuthPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [otpdiv, setOtpdiv] = useState(false);
  const { mode } = useParams();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const location = useLocation();
  const from = location.state?.from || "/";

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const trimmedEmail = loginEmail.trim().toLowerCase();
      const trimmedPassword = loginPassword.trim();
      const data = await login(trimmedEmail, trimmedPassword);

      console.log(data);

      toast.success("Successfully logged-in");
      navigate(from, { replace: true });
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };
  const registerHandler = async (e) => {
    e.preventDefault();
    try {
      if (!name || !signupEmail || !signupPassword) {
        return toast.error("All fields are required");
      }
      const { data } = await register(name, signupEmail, signupPassword);

      toast.success("Successfully created an account");
      navigate(from, { replace: true });
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup Failed");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (mode == "signup") {
      setIsSignUp(true);
    } else if (mode == "login") {
      setIsSignUp(false);
    } else {
      toast.warning("Wrong URl");
    }
  }, [mode]);

  return (
    <div className={styles.superContainerLogin}>
      <Help_Centre />
      {otpdiv && (
        <OtpDiv onClose={() => setOtpdiv(false)} loginEmail={loginEmail} />
      )}

      <div
        className={`${styles.containerLogin} ${
          isSignUp ? styles.rightPanelActiveLogin : ""
        }`}
      >
        {/* Sign In Form */}
        <div className={styles.signinFormLogin}>
          <form className={styles.formLogin} onSubmit={loginHandler}>
            <h1 className={styles.headingLogin}>Sign In</h1>

            <span className={styles.spanLogin}>or use your account</span>
            <input
              className={styles.inputLogin}
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input
              className={styles.inputLogin}
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />

            <a
              href="#"
              className={styles.forgotPasswordLogin}
              onClick={() => {
                if (!loginEmail) {
                  toast.error("Please enter your email first");
                  return;
                }
                setOtpdiv(true);
              }}
            >
              Forgot your password?
            </a>
            <button type="submit" className={styles.buttonLogin}>
              Sign In
            </button>
          </form>
        </div>

        {/* Sign Up Form */}
        <div className={styles.signupFormLogin}>
          <form className={styles.formLogin} onSubmit={registerHandler}>
            <h1 className={styles.headingLogin}>Create an Account</h1>
            <div className={styles.iconsContainerLogin}>
              <a href="#" className={styles.iconsLogin}>
                <i className="fa-brands fa-google"></i>
              </a>
              <a href="#" className={styles.iconsLogin}>
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className={styles.iconsLogin}>
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
            <span className={styles.spanLogin}>
              or use your email for registration
            </span>
            <input
              className={styles.inputLogin}
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className={styles.inputLogin}
              type="email"
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
            />
            <input
              className={styles.inputLogin}
              type="password"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />
            <button type="submit" className={styles.buttonLogin}>
              Sign Up
            </button>
          </form>
        </div>

        {/* Overlay */}
        <div className={styles.overlayContainerLogin}>
          <div className={styles.overlayLogin}>
            <div
              className={`${styles.overlayPanelLogin} ${styles.overlayLeftLogin}`}
            >
              <h1 className={styles.headingLogin}>Welcome Back!</h1>
              <p className={styles.paragraphLogin}>
                To keep connected with us please login with your personal info
              </p>
              <button
                className={styles.ghostLogin}
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </button>
            </div>
            <div
              className={`${styles.overlayPanelLogin} ${styles.overlayRightLogin}`}
            >
              <h1 className={styles.headingLogin}>Hello, Friend!</h1>
              <p className={styles.paragraphLogin}>
                Enter your personal details and start your journey with us
              </p>
              <button
                className={styles.ghostLogin}
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
