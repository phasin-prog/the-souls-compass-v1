/** @type {import('next').NextConfig} */
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  // ระบุ workspace root ให้ Turbopack — เลี่ยงการสแกนหา lockfile ขึ้นไปใน parent directory
  turbopack: {
    root: __dirname,
  },
};
export default nextConfig;
