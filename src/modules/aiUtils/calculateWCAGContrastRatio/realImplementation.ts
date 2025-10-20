import Color from "colorjs.io";

/**
 * Calculates the relative luminance of a color according to WCAG 2.1
 * @param color - Color in any format supported by colorjs.io
 * @returns Relative luminance value between 0 and 1
 */
export const calculateRelativeLuminance = (color: string): number => {
  try {
    const colorObj = new Color(color);
    const srgb = colorObj.to("srgb");
    const [r, g, b] = [srgb.r, srgb.g, srgb.b];

    const gammaCorrect = (value: number): number => {
      if (value <= 0.03928) {
        return value / 12.92;
      }
      return Math.pow((value + 0.055) / 1.055, 2.4);
    };

    const rLinear = gammaCorrect(r);
    const gLinear = gammaCorrect(g);
    const bLinear = gammaCorrect(b);

    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  // TODO dont catch here - handle errors in the component or error boundary to display something
  // meaningful to the user instead of displaying wrong results
  } catch (error) {
    console.error(`Error calculating luminance for color ${color}:`, error);
    return 0;
  }
};


/**
 * Calculates the WCAG contrast ratio between two colors
 * @param color1 - First color in any format supported by colorjs.io
 * @param color2 - Second color in any format supported by colorjs.io
 * @returns Contrast ratio between 1 and 21
 */
export const calculateWCAGContrastRatio = (
  color1: string,
  color2: string
): number => {
  const luminance1 = calculateRelativeLuminance(color1);
  const luminance2 = calculateRelativeLuminance(color2);
  
  if ((luminance1 === 0 && color1 !== '#000000' && color1 !== '#000') ||
      (luminance2 === 0 && color2 !== '#000000' && color2 !== '#000')) {
    return 1;
  }
  
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

