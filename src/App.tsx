import { useState } from "react";
import {
  MapContainer,
  Polygon,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BatteryMedium,
  Bell,
  ChevronDown,
  CircleHelp,
  CloudSun,
  Crosshair,
  Database,
  Eye,
  EyeOff,
  Gauge,
  Layers3,
  Leaf,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Phone,
  Plus,
  Radio,
  Search,
  Settings2,
  Sprout,
  Thermometer,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { demoLands, type Land } from "./data/demo";
import "./App.css";
import "leaflet/dist/leaflet.css";

const navItems = [
  { label: "Overview", icon: Gauge },
  { label: "My Lands", icon: MapPin, active: true },
  { label: "Soil intelligence", icon: Activity },
  { label: "Device", icon: Radio },
  { label: "AI advisor", icon: Sprout },
  { label: "History", icon: Database },
];

const nutrientBars = [
  { label: "Nitrogen", value: 42, max: 80, status: "Medium", tone: "medium" },
  { label: "Phosphorus", value: 18, max: 45, status: "Low", tone: "low" },
  { label: "Potassium", value: 110, max: 160, status: "Good", tone: "good" },
];

function MapFocus({ land }: { land: Land }) {
  const map = useMap();
  map.flyTo(land.coordinates[0], 15, { duration: 0.7 });
  return null;
}
function MapClicker({
  enabled,
  onClick,
}: {
  enabled: boolean;
  onClick: (point: [number, number]) => void;
}) {
  useMapEvents({
    click(event) {
      if (enabled) onClick([event.latlng.lat, event.latlng.lng]);
    },
  });
  return null;
}

type AuthUser = {
  name: string;
  email: string;
  phone: string;
};

const demoUser: AuthUser = {
  name: "Adarsh",
  email: "adarsh@example.com",
  phone: "+91 77958 06293",
};

function getSavedUser(): AuthUser | null {
  try {
    const saved = localStorage.getItem("agribridgezero-user");
    return saved ? (JSON.parse(saved) as AuthUser) : null;
  } catch {
    return null;
  }
}

function AuthScreen({ onLogin }: { onLogin: (user: AuthUser) => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (method === "phone" && !otpSent) {
      if (identifier.replace(/\D/g, "").length !== 10) {
        setError("Enter a valid 10-digit Indian mobile number.");
        return;
      }
      setOtpSent(true);
      return;
    }
    if (method === "phone" && otp !== "779580") {
      setError("For this demo, use OTP 779580.");
      return;
    }
    if (
      method === "email" &&
      (!identifier.includes("@") || password.length < 6)
    ) {
      setError(
        "Enter a valid email and a password with at least 6 characters.",
      );
      return;
    }
    const user = {
      name: mode === "signup" ? name.trim() || "Adarsh" : "Adarsh",
      email: method === "email" ? identifier : demoUser.email,
      phone: method === "phone" ? `+91 ${identifier}` : demoUser.phone,
    };
    localStorage.setItem("agribridgezero-user", JSON.stringify(user));
    onLogin(user);
  };

  return (
    <div className="auth-shell">
      <div className="auth-art">
        <div className="auth-orbit orbit-one" />
        <div className="auth-orbit orbit-two" />
        <div className="auth-brand">
          <div className="logo-symbol">
            <Leaf size={30} />
            <span />
          </div>
          <strong>
            Agri<span>BridgeZero</span>
          </strong>
        </div>
        <div className="auth-art-copy">
          <span>PRECISION AGRICULTURE / 01</span>
          <h1>
            Know your soil.
            <br />
            <em>Grow with clarity.</em>
          </h1>
          <p>
            One connected view of your land, soil intelligence, and next best
            action.
          </p>
        </div>
        <div className="auth-stats">
          <div>
            <strong>2.4k</strong>
            <span>acres monitored</span>
          </div>
          <div>
            <strong>98.6%</strong>
            <span>data confidence</span>
          </div>
        </div>
      </div>
      <div className="auth-panel">
        <div className="auth-panel-top">
          <div className="mobile-brand">
            <div className="logo-symbol">
              <Leaf size={22} />
              <span />
            </div>
            <strong>
              Agri<span>BridgeZero</span>
            </strong>
          </div>
          <span className="secure-label">
            <LockKeyhole size={12} /> Secure access
          </span>
        </div>
        <div className="auth-form-wrap">
          <div className="auth-kicker">WELCOME TO YOUR FARM INTELLIGENCE</div>
          <h2>
            {mode === "login"
              ? "Welcome back, Adarsh."
              : "Create your farm account."}
          </h2>
          <p className="auth-subtitle">
            {mode === "login"
              ? "Sign in to continue to your lands and soil profile."
              : "Start building a clearer picture of every acre."}
          </p>
          <div className="auth-tabs">
            <button
              className={method === "email" ? "selected" : ""}
              onClick={() => {
                setMethod("email");
                setOtpSent(false);
              }}
            >
              Email
            </button>
            <button
              className={method === "phone" ? "selected" : ""}
              onClick={() => {
                setMethod("phone");
                setOtpSent(false);
              }}
            >
              Indian phone number
            </button>
          </div>
          <form onSubmit={submit}>
            {mode === "signup" && (
              <label>
                Full name
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Adarsh Sharma"
                  autoComplete="name"
                />
                <UserRound size={16} />
              </label>
            )}
            <label>
              {method === "email" ? "Email address" : "Mobile number"}
              <div className="input-with-prefix">
                {method === "phone" && <span>+91</span>}
                <input
                  value={identifier}
                  onChange={(event) =>
                    setIdentifier(
                      event.target.value.replace(/[^0-9]/g, "").slice(0, 10),
                    )
                  }
                  type={method === "email" ? "email" : "tel"}
                  placeholder={
                    method === "email" ? "you@example.com" : "77958 06293"
                  }
                  autoComplete={method === "email" ? "email" : "tel"}
                />
              </div>
              <span className="field-icon">
                {method === "email" ? <Mail size={16} /> : <Phone size={16} />}
              </span>
            </label>
            {method === "email" && (
              <label>
                Password
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label="Show password"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </label>
            )}
            {method === "phone" && otpSent && (
              <label>
                Verification code
                <input
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  inputMode="numeric"
                  placeholder="6-digit OTP"
                  autoComplete="one-time-code"
                />
                <span className="field-icon">
                  <LockKeyhole size={16} />
                </span>
              </label>
            )}
            {error && <p className="auth-error">{error}</p>}
            {method === "phone" && otpSent && (
              <p className="otp-hint">
                Demo OTP sent to +91 {identifier}. Use <strong>779580</strong>.
              </p>
            )}
            <button className="auth-submit" type="submit">
              {method === "phone" && !otpSent
                ? "Send verification code"
                : mode === "login"
                  ? "Sign in to dashboard"
                  : "Create account"}
              <ArrowUpRight size={16} />
            </button>
          </form>
          {method === "email" && mode === "login" && (
            <button className="forgot-link">Forgot password?</button>
          )}
          <p className="auth-switch">
            {mode === "login"
              ? "New to AgriBridgeZero?"
              : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError("");
              }}
            >
              {mode === "login" ? "Create account" : "Sign in"}
            </button>
          </p>
          <p className="demo-login">
            <span /> Demo account: Adarsh · 77958 06293
          </p>
        </div>
        <div className="auth-footer">
          <span>© 2026 AgriBridgeZero</span>
          <span>Privacy · Terms · Help</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState<AuthUser | null>(() => getSavedUser());
  const [selectedLand, setSelectedLand] = useState(demoLands[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [draftPoints, setDraftPoints] = useState<[number, number][]>([]);
  const [mapMode, setMapMode] = useState<"street" | "satellite">("street");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  if (!user) return <AuthScreen onLogin={setUser} />;
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const signOut = () => {
    localStorage.removeItem("agribridgezero-user");
    setUser(null);
  };
  const selectLand = (land: Land) => {
    setSelectedLand(land);
    setIsDrawing(false);
    setDraftPoints([]);
  };
  const startDrawing = () => {
    setIsDrawing(true);
    setDraftPoints([]);
  };
  const saveDraft = () => {
    if (draftPoints.length >= 3) {
      setIsDrawing(false);
      setDraftPoints([]);
    }
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? "is-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Leaf size={18} />
            <span />
          </div>
          <span>
            Agri<span>BridgeZero</span>
          </span>
        </div>
        <button
          className="workspace-switcher"
          onClick={() =>
            setSelectedLand(
              selectedLand.id === demoLands[0].id ? demoLands[1] : demoLands[0],
            )
          }
        >
          <div className="workspace-icon">G</div>
          <div>
            <strong>{selectedLand.name}</strong>
            <small>{selectedLand.location}</small>
          </div>
          <ChevronDown size={15} />
        </button>
        <div className="nav-label">Workspace</div>
        <nav>
          {navItems.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              className={active ? "nav-item active" : "nav-item"}
              onClick={() => setMobileNavOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === "AI advisor" && <span className="new-tag">NEW</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-spacer" />
        <div className="device-mini">
          <div className="device-mini-top">
            <span className="status-dot" />
            <span>ABZ-001</span>
            <span className="device-online">ONLINE</span>
          </div>
          <div className="device-mini-copy">
            Last sync 21:42{" "}
            <span>
              <BatteryMedium size={13} /> 84%
            </span>
          </div>
          <div className="signal-bars">
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
        <button className="nav-item">
          <Settings2 size={18} />
          <span>Settings</span>
        </button>
        <button
          className="profile"
          onClick={() => setProfileOpen((open) => !open)}
        >
          <div className="avatar">{initials}</div>
          <div>
            <strong>{user.name}</strong>
            <small>Farm owner</small>
          </div>
          <MoreDots />
        </button>
        {profileOpen && (
          <div className="profile-menu">
            <div className="profile-menu-head">
              <div className="avatar">{initials}</div>
              <div>
                <strong>{user.name}</strong>
                <small>{user.phone}</small>
              </div>
            </div>
            <button>
              <UserRound size={15} /> Profile details
            </button>
            <button onClick={signOut}>
              <LogOut size={15} /> Sign out
            </button>
          </div>
        )}
      </aside>
      <main className="main-content">
        <header className="topbar">
          <button
            className="icon-button menu-button"
            onClick={() => setMobileNavOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            <Menu size={20} />
          </button>
          <div className="breadcrumb">
            <span>My Lands</span>
            <span>/</span>
            <strong>{selectedLand.name}</strong>
          </div>
          <div className="top-actions">
            <div className="live-pill">
              <span className="pulse" /> Live device data
            </div>
            <button className="icon-button" aria-label="Help">
              <CircleHelp size={19} />
            </button>
            <button
              className="icon-button notification"
              aria-label="Notifications"
            >
              <Bell size={19} />
              <i />
            </button>
            <button
              className="top-avatar"
              onClick={() => setProfileOpen((open) => !open)}
            >
              {initials}
            </button>
          </div>
        </header>
        <div className="page-content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" /> LAND INTELLIGENCE
              </div>
              <h1>Your farm, understood.</h1>
              <p>See what your soil is telling you today.</p>
            </div>
            <div className="heading-actions">
              <span className="demo-badge">
                <span /> DEMO DATA · DEVICE SCHEMA READY
              </span>
              <button className="primary-button" onClick={startDrawing}>
                <Plus size={17} /> Add land
              </button>
            </div>
          </div>
          <section className="map-layout">
            <div className="map-wrap">
              <MapContainer
                center={[13.068, 77.8]}
                zoom={14}
                zoomControl={false}
                className="map"
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url={
                    mapMode === "street"
                      ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  }
                />
                {demoLands.map((land) => (
                  <Polygon
                    key={land.id}
                    positions={land.coordinates as LatLngExpression[]}
                    pathOptions={{
                      color:
                        land.id === selectedLand.id ? "#c5f36a" : "#91b36a",
                      fillColor:
                        land.id === selectedLand.id ? "#a7dc53" : "#7a9d59",
                      fillOpacity: land.id === selectedLand.id ? 0.34 : 0.18,
                      weight: land.id === selectedLand.id ? 3 : 1.5,
                    }}
                    eventHandlers={{ click: () => selectLand(land) }}
                  />
                ))}
                {draftPoints.length > 0 && (
                  <Polygon
                    positions={draftPoints as LatLngExpression[]}
                    pathOptions={{
                      color: "#f6c660",
                      fillColor: "#f6c660",
                      fillOpacity: 0.25,
                      dashArray: "5 5",
                    }}
                  />
                )}
                <MapClicker
                  enabled={isDrawing}
                  onClick={(point) =>
                    setDraftPoints((points) => [...points, point])
                  }
                />
                <MapFocus land={selectedLand} />
              </MapContainer>
              <div className="map-scrim" />
              <div className="map-toolbar">
                <div className="map-search">
                  <Search size={17} />
                  <input
                    placeholder="Search your lands"
                    aria-label="Search your lands"
                  />
                </div>
                <button
                  className="map-control"
                  onClick={() =>
                    setMapMode(mapMode === "street" ? "satellite" : "street")
                  }
                >
                  <Layers3 size={16} />{" "}
                  {mapMode === "street" ? "Satellite" : "Street"}
                </button>
                <button
                  className="map-control icon-only"
                  aria-label="Use current location"
                >
                  <Crosshair size={17} />
                </button>
              </div>
              <div className="map-legend">
                <span>
                  <i className="legend-land selected" /> Selected land
                </span>
                <span>
                  <i className="legend-land" /> Other land
                </span>
                <span>
                  <i className="legend-scan" /> Scan point
                </span>
              </div>
              <div className="map-zoom">
                <button aria-label="Zoom in">+</button>
                <button aria-label="Zoom out">−</button>
              </div>
              <div className="map-location-label">
                <MapPin size={13} />
                <span>Hoskote, Karnataka</span>
              </div>
              {isDrawing && (
                <div className="draw-helper">
                  <span className="draw-icon">
                    <Plus size={15} />
                  </span>
                  <div>
                    <strong>Draw your land boundary</strong>
                    <small>
                      Click the map to place points · {draftPoints.length}{" "}
                      selected
                    </small>
                  </div>
                  <button
                    className="save-draft"
                    onClick={saveDraft}
                    disabled={draftPoints.length < 3}
                  >
                    Save land
                  </button>
                  <button
                    className="cancel-draft"
                    onClick={() => setIsDrawing(false)}
                    aria-label="Cancel drawing"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
            <aside className="land-panel">
              <div className="panel-kicker">
                <span>SELECTED LAND</span>
                <button aria-label="More land actions">
                  <MoreDots />
                </button>
              </div>
              <div className="land-title-row">
                <div>
                  <h2>{selectedLand.name}</h2>
                  <p>
                    <MapPin size={13} /> {selectedLand.location}
                  </p>
                </div>
                <div className="health-ring">
                  <div>
                    <strong>68</strong>
                    <small>/100</small>
                  </div>
                </div>
              </div>
              <div className="health-line">
                <span className="attention-dot" /> Soil condition{" "}
                <strong>{selectedLand.status}</strong>
              </div>
              <div className="land-meta">
                <div>
                  <span>AREA</span>
                  <strong>
                    {selectedLand.areaAcres} <small>acres</small>
                  </strong>
                </div>
                <div>
                  <span>CROP</span>
                  <strong>{selectedLand.crop}</strong>
                </div>
                <div>
                  <span>LAST SCAN</span>
                  <strong>{selectedLand.lastScan}</strong>
                </div>
              </div>
              <div className="panel-divider" />
              <div className="section-heading">
                <div>
                  <span className="section-eyebrow">CURRENT SCAN</span>
                  <h3>Soil profile</h3>
                </div>
                <button className="text-button">
                  View full profile <ArrowUpRight size={14} />
                </button>
              </div>
              <div className="metric-grid">
                <Metric
                  icon={<Gauge />}
                  label="pH level"
                  value="6.4"
                  unit="balanced"
                  tone="green"
                />
                <Metric
                  icon={<CloudSun />}
                  label="Moisture"
                  value="31.5"
                  unit="%"
                  tone="amber"
                />
                <Metric
                  icon={<Zap />}
                  label="EC"
                  value="0.72"
                  unit="dS/m"
                  tone="green"
                />
                <Metric
                  icon={<Thermometer />}
                  label="Temperature"
                  value="25.4"
                  unit="°C"
                  tone="neutral"
                />
              </div>
              <div className="panel-divider" />
              <div className="section-heading nutrient-heading">
                <div>
                  <span className="section-eyebrow">
                    CROP: {selectedLand.crop.toUpperCase()}
                  </span>
                  <h3>Key nutrients</h3>
                </div>
                <button
                  className="chevron-button"
                  aria-label="Expand nutrients"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
              <div className="nutrient-list">
                {nutrientBars.map((nutrient) => (
                  <div className="nutrient-row" key={nutrient.label}>
                    <div className="nutrient-label">
                      <span>{nutrient.label}</span>
                      <strong className={nutrient.tone}>
                        {nutrient.status}
                      </strong>
                    </div>
                    <div className="bar-track">
                      <span
                        className={`bar-fill ${nutrient.tone}`}
                        style={{
                          width: `${Math.min((nutrient.value / nutrient.max) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <small>{nutrient.value} mg/kg</small>
                  </div>
                ))}
              </div>
              <div className="ai-note">
                <div className="ai-spark">✦</div>
                <div>
                  <strong>AI insight</strong>
                  <p>
                    Phosphorus is below the recommended range for tomatoes.
                    Consider a correction before the next growth stage.
                  </p>
                  <button>
                    Explore recommendation <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            </aside>
          </section>
          <section className="lower-grid">
            <div className="overview-strip">
              <div className="strip-title">
                <span className="section-eyebrow">FARM AT A GLANCE</span>
                <h3>Today’s signal</h3>
                <p>From your latest device scan</p>
              </div>
              <Signal
                icon={<Activity />}
                label="Soil scans"
                value="28"
                detail="+4 this month"
              />
              <Signal
                icon={<Radio />}
                label="Devices online"
                value="2 / 2"
                detail="All systems normal"
              />
              <Signal
                icon={<AlertTriangle />}
                label="Active alerts"
                value="3"
                detail="1 needs attention"
                alert
              />
            </div>
            <div className="scan-card">
              <div className="scan-card-top">
                <div>
                  <span className="section-eyebrow">DEVICE ACTIVITY</span>
                  <h3>
                    AgriBridgeZero <span>ABZ-001</span>
                  </h3>
                </div>
                <span className="connected">
                  <i /> Connected
                </span>
              </div>
              <div className="scan-visual">
                <div className="scan-wave">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <div className="scan-status">
                  <strong>Ready to scan</strong>
                  <small>Last scan completed at 21:42</small>
                </div>
                <button className="scan-button">
                  <Radio size={16} /> Start soil scan
                </button>
              </div>
            </div>
          </section>
        </div>
        <footer>
          <span>
            <span className="footer-dot" /> System operational
          </span>
          <span>
            Data updates in real time ·{" "}
            <button>
              English <ChevronDown size={12} />
            </button>
          </span>
        </footer>
      </main>
    </div>
  );
}

function MoreDots() {
  return (
    <span className="more-dots">
      <i />
      <i />
      <i />
    </span>
  );
}
function Metric({
  icon,
  label,
  value,
  unit,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  tone: string;
}) {
  return (
    <div className="metric">
      <div className={`metric-icon ${tone}`}>{icon}</div>
      <span>{label}</span>
      <strong>
        {value} <small>{unit}</small>
      </strong>
    </div>
  );
}
function Signal({
  icon,
  label,
  value,
  detail,
  alert = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  alert?: boolean;
}) {
  return (
    <div className="signal">
      <div className={`signal-icon ${alert ? "alert" : ""}`}>{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}

export default App;
