// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://lichen.squion.com',
	integrations: [
		starlight({
			title: 'Lichen',
			description: '轻量级服务器监控，专为独立开发者和小团队设计',
			logo: {
				light: './src/assets/logo-light.svg',
				dark: './src/assets/logo-dark.svg',
				replacesTitle: false,
			},
			favicon: '/favicon.ico',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/squion/lichen' },
			],
			customCss: ['./src/styles/custom.css'],
			head: [
				{
					tag: 'meta',
					attrs: { name: 'keywords', content: '服务器监控,轻量监控,独立开发者,自托管,告警,Docker监控' },
				},
			],
			sidebar: [
				{
					label: '快速开始',
					items: [
						{ label: '5 分钟上手', slug: 'guides/quickstart' },
						{ label: '安装 Agent', slug: 'guides/install-agent' },
					],
				},
				{
					label: '部署指南',
					items: [
						{ label: 'Docker 自托管', slug: 'guides/deploy-docker' },
						{ label: 'Cloudflare Workers', slug: 'guides/deploy-cloudflare' },
					],
				},
				{
					label: '功能详解',
					items: [
						{ label: '告警配置', slug: 'guides/alerts' },
						{ label: '通知渠道', slug: 'guides/notifications' },
						{ label: '团队协作', slug: 'guides/teams' },
					],
				},
				{
					label: '参考',
					items: [
						{ label: 'Agent 配置', slug: 'reference/agent-config' },
						{ label: 'API 文档', slug: 'reference/api' },
					],
				},
				{
					label: '更新日志',
					slug: 'changelog',
				},
			],
			defaultLocale: 'root',
			locales: {
				root: { label: '简体中文', lang: 'zh-CN' },
			},
		}),
	],
});
