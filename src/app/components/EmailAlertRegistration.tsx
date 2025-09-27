"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MapPin,
  Shield,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  AtSign,
  Bug,
  Send,
} from "lucide-react";

export default function EmailAlertRegistration() {
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Debug function to check registered users
  const checkDebugInfo = async () => {
    try {
      const response = await fetch("/api/register-sms-alerts");
      const data = await response.json();
      setDebugInfo(data);
      console.log("🔍 Debug Info:", data);
    } catch (error) {
      console.error("Debug failed:", error);
    }
  };

  const getLocation = () => {
    setError("");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Location error:", error);
          setError("Please enable location access for emergency alerts");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setError("Geolocation is not supported by this browser");
    }
  };

  const registerForAlerts = async () => {
    if (!email || !location) {
      setError("Please provide email address and location");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log(`📧 Registering email: "${email}"`);

      const response = await fetch("/api/register-sms-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          latitude: location.lat,
          longitude: location.lng,
          location: `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsRegistered(true);
        setVerificationSent(data.verificationSent);
        setDemoMode(data.demoMode);
        setRegisteredEmail(email.toLowerCase().trim());
        console.log(`✅ Registration successful for email: ${email}`);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const testDangerAlert = async () => {
    try {
      const response = await fetch("/api/test-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "simulate_threat",
          impactLat: location?.lat || 28.6139, // Delhi default
          impactLng: location?.lng || 77.209,
          name: "TEST ASTEROID EMERGENCY",
          threatLevel: "HIGH",
          diameter: 950,
          timeToImpact: "6.2 hours",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(
          `🚨 ${result.message}\n\n${
            demoMode
              ? "Check browser console for demo messages."
              : "Check your Gmail inbox for emergency alert!"
          }`
        );
      } else {
        alert("❌ Test failed. Check console for details.");
      }
    } catch (error) {
      console.error("Test failed:", error);
      alert("❌ Test failed due to network error.");
    }
  };

  const testPersonalAlert = async () => {
    if (!registeredEmail) {
      alert("❌ No email address stored. Please register first.");
      return;
    }

    try {
      const response = await fetch("/api/test-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "test_alert",
          email: registeredEmail,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(
          `✅ ${result.message}\n\n${
            demoMode
              ? "Check browser console for demo messages."
              : "Check your Gmail inbox for test email!"
          }`
        );
      } else {
        alert(`❌ ${result.message || "Test failed"}`);
      }
    } catch (error) {
      console.error("Personal test failed:", error);
      alert("❌ Test failed due to network error.");
    }
  };

  const testGmailDirectly = async () => {
    if (!registeredEmail) {
      alert("❌ No email address registered. Please register first.");
      return;
    }

    try {
      const response = await fetch("/api/test-gmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registeredEmail,
          subject: "🧪 Direct Gmail Test - DefendEarth",
          message: `This is a direct test of Gmail + Nodemailer delivery.

Email: ${registeredEmail}
Time: ${new Date().toLocaleString()}
Location: ${location?.lat.toFixed(4)}, ${location?.lng.toFixed(4)}

If you receive this email, the system is working perfectly!

DefendEarth System - Powered by Gmail SMTP`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(
          `✅ ${result.message}\n\nDirect Gmail test successful! Check your inbox.`
        );
        console.log("Gmail test result:", result);
      } else {
        alert(`❌ Gmail Test Failed: ${result.message}`);
        console.error("Gmail test failed:", result);
      }
    } catch (error) {
      console.error("Direct Gmail test failed:", error);
      alert("❌ Test failed due to network error.");
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br mt-7 from-blue-900/40 to-purple-900/20 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Mail className="w-8 h-8 text-blue-400" />
          <span className="text-2xl">📧</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-blue-400">
            Gmail Emergency Alerts
          </h3>
          <p className="text-gray-300 text-sm">
            Powered by Nodemailer + Gmail SMTP - Beautiful HTML Emails
          </p>
        </div>
      </div>

      {/* Demo Mode Banner */}
      {demoMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-purple-900/20 border border-purple-500/50 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 text-purple-300">
            <Info className="w-5 h-5" />
            <span className="font-semibold">
              Demo Mode - Gmail not configured
            </span>
          </div>
          <p className="text-purple-200 text-sm mt-1">
            Add Gmail credentials to send real beautiful HTML emails. Check
            console for simulated messages.
          </p>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {!isRegistered ? (
          <motion.div
            key="registration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                📧 Email Address for Emergency Alerts
              </label>
              <div className="relative">
                <AtSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="your@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1 space-y-1">
                <p>• Beautiful HTML emergency email alerts</p>
                <p>• Professional Gmail SMTP delivery</p>
                <p>• Rich formatting with safety instructions</p>
                <p>• Completely free via your Gmail account</p>
              </div>
            </div>

            <button
              onClick={getLocation}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <MapPin className="w-5 h-5" />
              {location ? "✅ Location Obtained" : "📍 Get My Location"}
            </button>

            {location && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-green-900/20 border border-green-700 rounded-lg p-3"
              >
                <div className="text-sm text-green-300 font-semibold">
                  📍 Location Confirmed
                </div>
                <div className="text-xs text-gray-300">
                  Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                </div>
                <div className="text-xs text-green-400 mt-1">
                  You'll receive alerts for threats within 1000km of this
                  location
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-900/20 border border-red-700 rounded-lg p-3"
              >
                <div className="flex items-center gap-2 text-red-300">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              </motion.div>
            )}

            <button
              onClick={registerForAlerts}
              disabled={!email || !location || loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-[1.02]"
            >
              {loading ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  Registering...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  📧 Register for Gmail Alerts
                </>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-green-400 mb-2">
              ✅ Registration Successful!
            </h4>

            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 mb-4">
              <p className="text-green-300 font-semibold mb-2">
                📧 Beautiful Welcome Email Sent via Gmail!
              </p>
              <p className="text-gray-300 text-sm mb-2">
                {demoMode
                  ? "Demo mode: Check console for simulated HTML welcome email content."
                  : "Check your Gmail inbox for a stunning HTML welcome message with system details and beautiful formatting."}
              </p>
              <div className="text-xs text-gray-400">
                Registered: {registeredEmail}
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 mb-4">
              <p className="text-gray-300 text-sm mb-2">
                <strong>🛡️ Gmail Protection Active!</strong> System monitors
                threats every 2 minutes.
              </p>
              <div className="text-xs text-gray-400 space-y-1">
                <div>📧 Email Provider: Gmail + Nodemailer</div>
                <div>🎨 Rich HTML alerts with animations & styling</div>
                <div>🛰️ NASA data monitoring: Active</div>
                <div>🚨 Emergency alerts: Professional HTML formatting</div>
                <div>
                  📍 Location: {location?.lat.toFixed(4)},{" "}
                  {location?.lng.toFixed(4)}
                </div>
                <div>🔄 Check interval: Every 2 minutes</div>
              </div>
            </div>

            {/* Test Buttons */}
            <div className="space-y-3">
              <button
                onClick={testDangerAlert}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-[1.02]"
              >
                <Zap className="w-5 h-5" />
                🚨 Test EMERGENCY Alert {demoMode ? "(Demo)" : "(Gmail)"}
              </button>

              <button
                onClick={testPersonalAlert}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-2 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-[1.01]"
              >
                🧪 Test Personal Alert {demoMode ? "(Demo)" : "(Gmail)"}
              </button>

              <button
                onClick={testGmailDirectly}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-[1.01]"
              >
                <Send className="w-4 h-4" />
                📡 Direct Gmail Test
              </button>

              <button
                onClick={checkDebugInfo}
                className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Bug className="w-4 h-4" />
                🔍 Debug System Status
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-400 space-y-1">
              <p>
                <strong>Emergency Alert:</strong> Simulates asteroid threat with
                beautiful HTML email
              </p>
              <p>
                <strong>Personal Alert:</strong> Tests system with professional
                HTML formatting
              </p>
              <p>
                <strong>Direct Gmail Test:</strong> Tests raw Gmail SMTP
                functionality
              </p>
              <p>
                <strong>Debug Status:</strong> Shows registered users and system
                info
              </p>
            </div>

            {/* Debug Info Display */}
            {debugInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 bg-gray-800/50 border border-gray-600 rounded-lg p-3 text-left"
              >
                <div className="text-xs text-gray-300">
                  <div className="font-semibold text-blue-400 mb-2">
                    System Status:
                  </div>
                  <div>
                    <strong>Total Users:</strong> {debugInfo.totalUsers || 0}
                  </div>
                  <div>
                    <strong>Verified Users:</strong>{" "}
                    {debugInfo.verifiedUsers || 0}
                  </div>
                  <div>
                    <strong>Demo Mode:</strong>{" "}
                    {debugInfo.demoMode ? "Yes" : "No"}
                  </div>
                  <div>
                    <strong>Email Provider:</strong>{" "}
                    {debugInfo.emailProvider || "Unknown"}
                  </div>
                  <div>
                    <strong>Email Available:</strong>{" "}
                    {debugInfo.emailAvailable ? "Yes" : "No"}
                  </div>
                  <div>
                    <strong>Monitoring:</strong>{" "}
                    {debugInfo.monitoringActive ? "Active" : "Inactive"}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
