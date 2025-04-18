import { transformSync } from 'esbuild';

/**
 * Minifies:
 *  • <script>…</script> blocks via esbuild.loader="js"
 *  • <style>…</style> blocks via esbuild.loader="css"
 *  • then does a lightweight HTML collapse (comments & inter‑tag whitespace)
 */
export default function esbuildMinifyPostProcess(html /*, meta, outPath */) {
    // Inline‑minify each <script>…</script>
    html = html.replace(
        /<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
        (_, attrs, js) => {
            const { code } = transformSync(js, { loader: 'js', minify: true });
            return `<script${attrs}>${code}</script>`;
        }
    );

    // Inline‑minify each <style>…</style>
    html = html.replace(
        /<style\b([^>]*)>([\s\S]*?)<\/style>/gi,
        (_, attrs, css) => {
            const { code } = transformSync(css, { loader: 'css', minify: true });
            return `<style${attrs}>${code}</style>`;
        }
    );

    // Final HTML cleanup: strip comments + collapse whitespace
    return html
        .replace(/<!--[\s\S]*?-->/g, '')   // remove HTML comments
        .replace(/>\s+</g, '><')           // collapse between tags
        .replace(/\s{2,}/g, ' ')           // collapse runs of spaces/newlines
        .trim();
}