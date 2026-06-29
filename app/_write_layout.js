const fs = require("fs");
const path = "C:/Users/User/Desktop/the-souls-compass-v1-main/app/layout.tsx";

const content = `import type { Metadata } from "next";
import {
  Inter,
  IBM_Plex_Serif,
  IBM_Plex_Sans_Thai,
  Noto_Sans_Thai,
  Noto_Serif_Thai,
  Playfair_Display,
  Cinzel,
} from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AccentController } from "@/components/accent-controller";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Tabbar } from "@/components/tabbar";
import { Fab } from "@/components/fab";
import { SkipToContent } from "@/components/skip-to-content";
import { QuickOpen } from "@/components/quick-open";

// \u2014\u2014 Dynamic Typography (\u0e2a\u0e2d\u0e07\u0e20\u0e32\u0e29\u0e32: \u0e2d\u0e31\u0e07\u0e01\u0e24\u0e29\u0e02\u0e36\u0e49\u0e19\u0e01\u0e48\u0e2d\u0e19 \u2192 \u0e44\u0e17\u0e22) \u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014
`;

fs.writeFileSync(path, content, "utf8");
console.log("Done writing part 1");
