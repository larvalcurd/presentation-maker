/** @type {import("stylelint").Config} */
export default {
  extends: [
    "stylelint-config-standard",
    "stylelint-prettier/recommended"
  ],
  plugins: ["stylelint-prettier"],
  ignoreFiles: ["node_modules/**", "dist/**"]
};
