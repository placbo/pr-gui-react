module.exports = {
  plugins: [],
  extends: [
    "react-app", // Create React App base settings
    "eslint:recommended", // recommended ESLint rules
  ],
  rules: {
    "no-console": 0, //TODO: 1
    "no-debugger": 1,
    "no-unused-vars": 0,
    "@typescript-eslint/no-unused-vars": 1,
    "no-undef": 0,
  },
};
