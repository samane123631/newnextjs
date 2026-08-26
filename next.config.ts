import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.20"],
};

export default withNextIntl(nextConfig);