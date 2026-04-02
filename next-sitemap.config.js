/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://wonderjoyai.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  outDir: './public',
}