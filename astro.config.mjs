import alpinejs from '@astrojs/alpinejs';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';
import AstroPWA from '@vite-pwa/astro';
import astroI18next from 'astro-i18next';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';
import axios from 'axios';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import { autolinkConfig } from './plugins/rehype-autolink-config';

async function fetchGrammar() {
    const url = 'https://raw.githubusercontent.com/helixlang/helix-lsp/lsp-v1/public/syntaxes/helix.tmLanguage.json';
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
                baseUrl: 'https://github.com/helixlang/helix-site/edit/new-template/src/content/docs/docs/',
            },
            social: {
                github: 'https://github.com/helixlang/helix-lang',
            },
            customCss: ["/src/styles/docstyle.css"],
            expressiveCode: {
                themes: ['github-dark-default', 'github-light-default'],
                shiki: {
                    langs: [
                        grammar
                    ],
                },
                // border color should be #0b0e12
                styleOverrides: { borderRadius: '0.3rem', borderWidth: '0rem', borderColor: '#0b0e12', gutterBorderColor: '#0b0e12', codeSelectionBackground: '#0b0e12', scrollbarThumbHoverColor: '#0b0e12', scrollbarThumbColor: '#0b0e12' },
            },
            sidebar: [
                {
                    label: 'Welcome',
                    link: 'docs',
                },
                {
                    label: 'Philosophy',
                    link: 'docs/philosophy',
                },
                {
                    label: "Getting Started",
                    autogenerate: { "directory": "docs/getting-started" }
                },
                {
                    label: "Language",
                    autogenerate: { "directory": "docs/language" }
                },
                {
                    label: "Tooling",
                    autogenerate: { "directory": "docs/tooling" }
                },
                {
                    label: "Examples",
                    "badge": "New",
                    autogenerate: { "directory": "docs/examples" }
                },
                {
                    label: "Reference",
                    autogenerate: { "directory": "docs/reference" }
                },
                {
                    label: "Contributing",
                    autogenerate: { "directory": "docs/contributing" }
                },
                {
                    label: "FAQ",
                    autogenerate: { "directory": "docs/faq" }
                }
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
