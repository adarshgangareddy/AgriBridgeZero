import { useState, useEffect } from "react";
import { X, ArrowRight, ShieldCheck, CheckCircle2, Phone, Mail } from "lucide-react";
import { sendOtp } from "../services/notificationService";

export interface UserSession {
  name: string;
  phone?: string;
  email?: string;
  avatar?: string;
  isLoggedIn: boolean;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserSession) => void;
  targetAction?: string;
}

export function AuthModal({ isOpen, onClose, onSuccess, targetAction }: AuthModalProps) {
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [step, setStep] = useState<"input" | "otp">("input");
  const [otpValue, setOtpValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleClose = () => {
    setStep("input");
    setOtpValue("");
    setInfoMessage(null);
    onClose();
  };

  useEffect(() => {
    let timer: number;
    if (step === "otp" && countdown > 0) {
      timer = window.setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (method === "phone") {
      const cleanPhone = phoneNumber.replace(/\D/g, "");
      if (cleanPhone.length !== 10) {
        setInfoMessage("Please enter a valid 10-digit mobile number.");
        return;
      }
    } else {
      if (!emailAddress.includes("@")) {
        setInfoMessage("Please enter a valid email address.");
        return;
      }
    }

    setLoading(true);
    setInfoMessage(null);

    const recipient = method === "phone" ? `+91 ${phoneNumber}` : emailAddress;
    const res = await sendOtp({ recipient, type: method });
    setLoading(false);

    if (res.success) {
      setStep("otp");
      setCountdown(30);
      setInfoMessage(`Code sent! (For instant demo verification, use: ${res.code})`);
      // Auto-prefill for smooth testing if desired
    }
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (otpValue.trim() === "779580" || otpValue.trim().length === 6) {
      const user: UserSession = {
        name: "Adarsh G.",
        phone: method === "phone" ? `+91 ${phoneNumber}` : "+91 77958 06293",
        email: method === "email" ? emailAddress : "adarsh@agribridgezero.com",
        isLoggedIn: true,
      };
      localStorage.setItem("agribridgezero-user", JSON.stringify(user));
      onSuccess(user);
      handleClose();
    } else {
      setInfoMessage("Invalid code. Use demo code: 779580");
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const user: UserSession = {
        name: "Adarsh G.",
        email: "farmer.adarsh@gmail.com",
        phone: "+91 77958 06293",
        isLoggedIn: true,
      };
      localStorage.setItem("agribridgezero-user", JSON.stringify(user));
      setLoading(false);
      onSuccess(user);
      handleClose();
    }, 600);
  };

  const quickFillDemoOtp = () => {
    setOtpValue("779580");
  };

  return (
    <div className="auth-backdrop" onClick={handleClose}>
      <div 
        className="auth-modal-card" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Mobile drag handle */}
        <div className="mobile-sheet-handle" />

        {/* Close button */}
        <button 
          className="auth-close-btn" 
          onClick={handleClose}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo-badge">
            <img src="/agri-logo.png" alt="AgriBridgeZero" className="auth-logo-img" />
          </div>
          <h2 className="auth-title">
            {targetAction ? `Sign in to ${targetAction}` : "Create your AgriBridgeZero account"}
          </h2>
          <p className="auth-subtitle">
            Continue to add your land, connect device, view soil analysis and more.
          </p>
        </div>

        {infoMessage && (
          <div className="auth-info-banner">
            <ShieldCheck size={16} className="auth-info-icon" />
            <span>{infoMessage}</span>
          </div>
        )}

        {step === "input" ? (
          <div className="auth-body">
            {method === "phone" ? (
              <form onSubmit={handleSendOtp} className="auth-form">
                <div className="phone-input-wrap">
                  <span className="country-code">+91</span>
                  <input
                    type="tel"
                    className="phone-field"
                    placeholder="Enter 10-digit mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    autoFocus
                    maxLength={10}
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="auth-primary-btn"
                  disabled={loading || phoneNumber.length < 10}
                >
                  {loading ? "Sending..." : "Get OTP"}
                  <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleSendOtp} className="auth-form">
                <div className="email-input-wrap">
                  <Mail size={18} className="email-icon" />
                  <input
                    type="email"
                    className="email-field"
                    placeholder="Enter your email address"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="auth-primary-btn"
                  disabled={loading || !emailAddress.includes("@")}
                >
                  {loading ? "Sending..." : "Send Verification Link"}
                  <ArrowRight size={16} />
                </button>
              </form>
            )}

            <div className="auth-divider">
              <span>OR</span>
            </div>

            {/* Zepto/Blinkit style fast login alternatives */}
            <div className="auth-social-buttons">
              <button 
                type="button" 
                className="social-btn google-btn"
                onClick={handleGoogleLogin}
              >
                <svg className="social-icon" viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Continue with Google
              </button>

              {method === "phone" ? (
                <button 
                  type="button" 
                  className="social-btn"
                  onClick={() => { setMethod("email"); setInfoMessage(null); }}
                >
                  <Mail size={16} />
                  Continue with Email
                </button>
              ) : (
                <button 
                  type="button" 
                  className="social-btn"
                  onClick={() => { setMethod("phone"); setInfoMessage(null); }}
                >
                  <Phone size={16} />
                  Continue with Phone
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="auth-body">
            <form onSubmit={handleVerifyOtp} className="auth-form">
              <div className="otp-helper">
                <span>Enter 6-digit OTP sent to <strong>{method === "phone" ? `+91 ${phoneNumber}` : emailAddress}</strong></span>
              </div>

              <div className="otp-input-row">
                <input
                  type="text"
                  className="otp-field"
                  placeholder="• • • • • •"
                  value={otpValue}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setOtpValue(val);
                    if (val.length === 6) {
                      setTimeout(() => handleVerifyOtp(), 150);
                    }
                  }}
                  autoFocus
                  maxLength={6}
                />
              </div>

              <div className="demo-otp-pill" onClick={quickFillDemoOtp}>
                <CheckCircle2 size={14} />
                <span>Click here to autofill test OTP: <strong>779580</strong></span>
              </div>

              <button 
                type="submit" 
                className="auth-primary-btn"
                disabled={otpValue.length < 6}
              >
                Verify & Continue
              </button>

              <div className="otp-footer-row">
                <button 
                  type="button" 
                  className="text-btn"
                  onClick={() => setStep("input")}
                >
                  Change {method === "phone" ? "number" : "email"}
                </button>

                {countdown > 0 ? (
                  <span className="countdown-txt">Resend in {countdown}s</span>
                ) : (
                  <button 
                    type="button" 
                    className="text-btn resend-btn"
                    onClick={() => {
                      setCountdown(30);
                      setInfoMessage("Code resent! (Demo OTP: 779580)");
                    }}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        <div className="auth-footer">
          <p className="terms-text">
            By continuing, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.
          </p>
          <button 
            type="button" 
            className="skip-auth-btn"
            onClick={handleClose}
          >
            Explore without an account
          </button>
        </div>
      </div>
    </div>
  );
}
