import { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

import styles from "./app.module.scss";

export function App() {
  const [colors, setColors] = useState({
    background: "black",
    widget: "#1a1e1f",
    text: "#121313",
  });
  const [showColorPicker, setShowColorPicker] = useState({
    background: false,
    widget: false,
    text: false,
  });
  const colorPickerBackgroundRef = useRef<HTMLDivElement>(null);
  const colorPickerWidgetRef = useRef<HTMLDivElement>(null);
  const colorPickerTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const pickerBackground = colorPickerBackgroundRef.current;
      const pickerWidget = colorPickerWidgetRef.current;
      const pickerText = colorPickerTextRef.current;

      if (
        pickerBackground &&
        !pickerBackground.contains(event.target as Node) &&
        showColorPicker.background
      ) {
        setShowColorPicker({ ...showColorPicker, background: false });
      } else if (
        pickerWidget &&
        !pickerWidget.contains(event.target as Node) &&
        showColorPicker.widget
      ) {
        setShowColorPicker({ ...showColorPicker, widget: false });
      } else if (pickerText && !pickerText.contains(event.target as Node) && showColorPicker.text) {
        setShowColorPicker({ ...showColorPicker, text: false });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPicker]);

  const showBackgroundPicker = () => {
    setShowColorPicker((prev) => ({ ...prev, background: !prev.background }));
  };

  const showWidgetPicker = () => {
    setShowColorPicker((prev) => ({ ...prev, widget: !prev.widget }));
  };

  const showTextPicker = () => {
    setShowColorPicker((prev) => ({ ...prev, text: !prev.text }));
  };

  const changeColor = (newColor: string, type: string) => {
    setColors({ ...colors, [type]: newColor });
  };

  //todo maybe group them in one function
  return (
    <>
      <div className={styles.groupPickerContainer}>
        <div className={styles.backgroundPickerGroup}>
          <div
            onClick={showBackgroundPicker}
            className={styles.picker}
            style={{ background: colors.background }}
          ></div>
          <p style={{ color: "white" }}>Background</p>
          {showColorPicker.background && (
            <div
              ref={colorPickerBackgroundRef}
              style={{ position: "absolute", right: "50px", top: "20px" }}
            >
              <HexColorPicker
                color={colors.background}
                onChange={(newColor) => changeColor(newColor, "background")}
                style={{ width: "200px", height: "200px" }}
              />
            </div>
          )}
        </div>

        <div className={styles.widgetPickerGroup}>
          <div
            onClick={showWidgetPicker}
            className={styles.picker}
            style={{ background: colors.widget }}
          ></div>
          <p style={{ color: "white" }}>Widgets</p>
          {showColorPicker.widget && (
            <div
              ref={colorPickerWidgetRef}
              style={{ position: "absolute", right: "50px", top: "20px" }}
            >
              <HexColorPicker
                color={colors.widget}
                onChange={(newColor) => changeColor(newColor, "widget")}
                style={{ width: "200px", height: "200px" }}
              />
            </div>
          )}
        </div>

        <div className={styles.textPickerGroup}>
          <div
            onClick={showTextPicker}
            className={styles.picker}
            style={{ background: colors.text }}
          ></div>
          <p style={{ color: "white" }}>Text</p>
          {showColorPicker.text && (
            <div
              ref={colorPickerTextRef}
              style={{ position: "absolute", right: "50px", top: "20px" }}
            >
              <HexColorPicker
                color={colors.text}
                onChange={(newColor) => changeColor(newColor, "text")}
                style={{ width: "200px", height: "200px" }}
              />
            </div>
          )}
        </div>
      </div>
      <h1>GIGACHAD COLOR PICKER</h1>
    </>
  );
}
