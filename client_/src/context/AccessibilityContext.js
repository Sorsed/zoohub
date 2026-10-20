import React, { createContext, useContext, useState, useEffect } from "react";

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
};

const STORAGE_KEY = "zoohub_accessibility_settings";

const defaultSettings = {
  isAccessible: false,
  fontSize: "large", // 'large' (20px), 'xlarge' (24px), 'huge' (28px)
  colorScheme: "white-black", // 'white-black', 'black-white', 'blue-cyan', 'brown-beige'
  hideImages: false, // true / false
  letterSpacing: "normal", // 'normal', 'medium', 'large'
  speechEnabled: false,
};

export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fontSize === "normal") parsed.fontSize = "large";
        return { ...defaultSettings, ...parsed };
      }
    } catch (e) {
      console.error("Failed to load accessibility settings:", e);
    }
    return defaultSettings;
  });

  // Persist to localStorage whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save accessibility settings:", e);
    }

    // Apply or remove body classes
    const body = document.body;

    if (settings.isAccessible) {
      body.classList.add("accessibility-mode");

      // Font size classes
      body.classList.remove("font-normal", "font-large", "font-xlarge", "font-huge");
      body.classList.add(`font-${settings.fontSize || "large"}`);

      // Color scheme classes
      body.classList.remove(
        "scheme-white-black",
        "scheme-black-white",
        "scheme-blue-cyan",
        "scheme-brown-beige"
      );
      body.classList.add(`scheme-${settings.colorScheme}`);

      // Hide images
      if (settings.hideImages) {
        body.classList.add("hide-images");
      } else {
        body.classList.remove("hide-images");
      }

      // Letter spacing
      body.classList.remove("spacing-normal", "spacing-medium", "spacing-large");
      body.classList.add(`spacing-${settings.letterSpacing}`);
    } else {
      // Remove all accessibility classes
      body.classList.remove(
        "accessibility-mode",
        "font-normal",
        "font-large",
        "font-xlarge",
        "scheme-white-black",
        "scheme-black-white",
        "scheme-blue-cyan",
        "scheme-brown-beige",
        "hide-images",
        "spacing-normal",
        "spacing-medium",
        "spacing-large"
      );
    }
  }, [settings]);

  // Speech synthesis for text selection
  useEffect(() => {
    if (!settings.isAccessible || !settings.speechEnabled) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      return;
    }

    const handleMouseUp = () => {
      const selectedText = window.getSelection()?.toString().trim();
      if (selectedText && selectedText.length > 1 && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(selectedText);
        utterance.lang = "ru-RU";
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [settings.isAccessible, settings.speechEnabled]);

  const toggleAccessible = () => {
    setSettings((prev) => ({
      ...prev,
      isAccessible: !prev.isAccessible,
      fontSize: !prev.isAccessible && (!prev.fontSize || prev.fontSize === "normal") ? "large" : prev.fontSize,
    }));
  };

  const setFontSize = (fontSize) => {
    setSettings((prev) => ({ ...prev, fontSize }));
  };

  const setColorScheme = (colorScheme) => {
    setSettings((prev) => ({ ...prev, colorScheme }));
  };

  const setHideImages = (hideImages) => {
    setSettings((prev) => ({ ...prev, hideImages }));
  };

  const setLetterSpacing = (letterSpacing) => {
    setSettings((prev) => ({ ...prev, letterSpacing }));
  };

  const setSpeechEnabled = (speechEnabled) => {
    setSettings((prev) => ({ ...prev, speechEnabled }));
  };

  const resetSettings = () => {
    setSettings({
      ...defaultSettings,
      isAccessible: true, // keep accessibility mode on, reset options
    });
  };

  return (
    <AccessibilityContext.Provider
      value={{
        ...settings,
        toggleAccessible,
        setFontSize,
        setColorScheme,
        setHideImages,
        setLetterSpacing,
        setSpeechEnabled,
        resetSettings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};
