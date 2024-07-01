import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { autolinkConfig } from './plugins/rehype-autolink-config';
import rehypeSlug from 'rehype-slug';
import astroI18next from 'astro-i18next';
import alpinejs from '@astrojs/alpinejs';
import AstroPWA from '@vite-pwa/astro';
import icon from 'astro-icon';
import starlight from '@astrojs/starlight';
import axios from 'axios';

async function fetchGrammar() {
    const url = 'https://raw.githubusercontent.com/kneorain/helix-highlighter/main/syntaxes/helix.tmLanguage.json';
    const response = await axios.get(url);
    return response.data;
}

const grammar = await fetchGrammar();

export default defineConfig({
    site: 'https://helix-lang.com',
    vite: {
        define: {
            __DATE__: `'${new Date().toISOString()}'`
        }
    },
    integrations: [
        tailwind(),
        sitemap(),
        astroI18next(),
        alpinejs(),
        AstroPWA({
            mode: 'production',
            base: '/',
            scope: '/',
            includeAssets: ['favicon.svg'],
            registerType: 'autoUpdate',
            manifest: {
                name: 'Helix Website - This is the website for the Helix Programming Language',
                short_name: 'Helix',
                theme_color: '#ffffff',
                icons: [
                    { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
                    { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
                    { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
                ]
            },
            workbox: {
                navigateFallback: '/404',
                globPatterns: ['*.js']
            },
            devOptions: {
                enabled: false,
                navigateFallbackAllowlist: [/^\/404$/],
                suppressWarnings: true
            }
        }),
        icon(),
        starlight({
            title: 'Helix',

            logo: {
                src: "/public/logo.svg",
                replacesTitle: false,
            },
            editLink: {
                baseUrl: 'https://github.com/kneorain/helix-site/edit/main/docs/',
            },
            social: {
                github: 'https://github.com/kneorain/helix',
            },
            customCss: ["/src/styles/docstyle.css"],
            expressiveCode: {
                themes: ['one-dark-pro', 'one-light'],
                shiki: {
                    langs: [
                        grammar
                    ],
                },
                styleOverrides: { borderRadius: '0.2rem' },
            },
            sidebar: [
                {
                    label: 'Welcome To Helix',
                    link: 'docs',
                },
                {
                    label: 'Introduction',
                    link: 'docs/introduction',
                },
                {
                    label: 'Installation',
                    link: 'docs/installation',
                },
                {
                    label: 'Getting Started',
                    autogenerate: { directory: 'docs/getting-started' },
                },
                {
                    label: 'Language',
                    badge: 'New',
                    autogenerate: { directory: 'docs/language' },
                },
                {
                    label: 'Examples',
                    badge: 'New',
                    autogenerate: { directory: 'docs/examples' },
                },
                {
                    label: 'Reference',
                    autogenerate: { directory: 'docs/reference' },
                },
                {
                    label: 'Appendix',
                    badge: 'New',
                    autogenerate: { directory: 'docs/appendix' },
                },
            ],
            tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 },
            lastUpdated: true,
            disable404Route: true,
        })
    ],
    markdown: {
        rehypePlugins: [
            rehypeSlug,
            // This adds links to headings
            [rehypeAutolinkHeadings, autolinkConfig]
        ]
    },
    experimental: {
        contentCollectionCache: true
    }
});
