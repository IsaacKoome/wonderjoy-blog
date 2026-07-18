/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://wonderjoyai.com',
  exclude: ['/sitemap.xml'],
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
