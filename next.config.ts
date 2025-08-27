import type { NextConfig } from "next";

const dev = process.env.NODE_ENV !== 'production';

const cspHeader = `
	default-src 'self';
  	base-uri 'none';
  	object-src 'none';
  	frame-ancestors 'none';
  	script-src 'self' 'unsafe-inline' ${dev ? "'unsafe-eval'" : ''};
  	style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  	img-src 'self' data: blob:;
  	font-src 'self' https://fonts.gstatic.com;
  	connect-src 'self';
  	form-action 'self';
  	upgrade-insecure-requests;
	`.replace(/\s{2,}/g, ' ').trim();


const securityHeaders = [
	{key: 'Content-Security-Policy', value: cspHeader},
	{key: 'X-Frame-Options', value: 'DENY'},
	{key: 'X-Content-Type-Options', value: 'nosniff'},
	{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
	{ key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
];


const nextConfig: NextConfig = {
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: securityHeaders
			}
		];
	},

	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'localhost'
			}
		]
	}
};

export default nextConfig;
