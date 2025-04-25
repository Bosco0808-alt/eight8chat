import type { NextConfig } from "next";
import { promises as fs } from "fs";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  async webpack(config) {
    const sourcePath = path.join(
      process.cwd(),
      "node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node"
    );
    const destinationPath = path.join(
      process.cwd(),
      "generated/prisma/libquery_engine-rhel-openssl-3.0.x.so.node"
    );

    // Ensure the destination directory exists
    await fs.mkdir(path.dirname(destinationPath), { recursive: true });

    // Copy the file
    await fs.copyFile(sourcePath, destinationPath);

    return config;
  },
};

export default nextConfig;
