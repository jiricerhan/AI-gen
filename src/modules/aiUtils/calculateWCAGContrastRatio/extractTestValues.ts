import { calculateWCAGContrastRatio } from './realImplementation';

// Test color pairs to extract values for AI implementation testing
const testColorPairs = [
  // Black and white - perfect contrast
  { color1: '#000000', color2: '#FFFFFF', description: 'Black and white' },

  // Common web colors
  { color1: '#FFFFFF', color2: '#000000', description: 'White and black (reversed)' },
  { color1: '#FF0000', color2: '#FFFFFF', description: 'Red and white' },
  { color1: '#00FF00', color2: '#000000', description: 'Green and black' },
  { color1: '#0000FF', color2: '#FFFFFF', description: 'Blue and white' },

  // Gray shades
  { color1: '#777777', color2: '#FFFFFF', description: 'Gray and white' },
  { color1: '#CCCCCC', color2: '#000000', description: 'Light gray and black' },
  { color1: '#333333', color2: '#FFFFFF', description: 'Dark gray and white' },

  // WCAG threshold examples
  { color1: '#767676', color2: '#FFFFFF', description: 'AA Large minimum (3:1)' },
  { color1: '#595959', color2: '#FFFFFF', description: 'AA Normal minimum (4.5:1)' },
  { color1: '#4D4D4D', color2: '#FFFFFF', description: 'AAA Large minimum (4.5:1)' },
  { color1: '#3C3C3C', color2: '#FFFFFF', description: 'AAA Normal minimum (7:1)' },

  // Brand colors
  { color1: '#1DA1F2', color2: '#FFFFFF', description: 'Twitter blue and white' },
  { color1: '#4267B2', color2: '#FFFFFF', description: 'Facebook blue and white' },
  { color1: '#FF5700', color2: '#FFFFFF', description: 'Reddit orange and white' },
];

function extractTestValues() {
  console.log('WCAG Contrast Ratio Test Values\n');
  console.log('='.repeat(80));
  console.log('\n');

  testColorPairs.forEach(({ color1, color2, description }) => {
    const ratio = calculateWCAGContrastRatio(color1, color2);
    console.log(`${description}`);
    console.log(`  Colors: ${color1} / ${color2}`);
    console.log(`  Ratio: ${ratio.toFixed(2)}`);
    console.log('');
  });

  console.log('='.repeat(80));
  console.log('\nJSON format for test data:\n');

  const jsonData = testColorPairs.map(({ color1, color2, description }) => ({
    description,
    color1,
    color2,
    expectedRatio: parseFloat(calculateWCAGContrastRatio(color1, color2).toFixed(2))
  }));

  console.log(JSON.stringify(jsonData, null, 2));
}

// Run if executed directly
if (require.main === module) {
  extractTestValues();
}

export { extractTestValues };
