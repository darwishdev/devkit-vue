import { tailwindConfig } from '@devkit/tailwindconfig'

export default {
  ...tailwindConfig,
  // override or extend any fields you need here:
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      // your custom theme tokens
    }
  }
}
