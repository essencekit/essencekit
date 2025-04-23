import { transformSync } from 'esbuild';

/**
 * Minifies:
 *  • <script>…</script> blocks via esbuild.loader="js"
 *  • <style>…</style> blocks via esbuild.loader="css"
 *  • then does a lightweight HTML collapse (comments & inter‑tag whitespace)
 *    ─ while **preserving the exact whitespace inside <pre>, <code>, <textarea> blocks**.
 */
export default function esbuildMinifyPostProcess(html /*, meta, outPath */) {

    /* ──────────────────────────────────────────────────────────────
       0.  Freeze whitespace‑sensitive blocks so later replacements
           can’t touch them.  We’ll restore them at the very end.
    ────────────────────────────────────────────────────────────── */
    const protectedBlocks = [];
    html = html.replace(
        /<(pre|code|textarea)\b[^>]*>[\s\S]*?<\/\1>/gi,
        block => {
            protectedBlocks.push(block);
            return `§§${protectedBlocks.length - 1}§§`;   // placeholder
        }
    );

    /* ──────────────────────────────────────────────────────────────
       1.  Inline‑minify each <script>…</script>
    ────────────────────────────────────────────────────────────── */
    html = html.replace(
        /<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
        (_, attrs, js) => {
            const { code } = transformSync(js, { loader: 'js', minify: true });
            return `<script${attrs}>${code}</script>`;
        }
    );

    /* ──────────────────────────────────────────────────────────────
       2.  Inline‑minify each <style>…</style>
    ────────────────────────────────────────────────────────────── */
    html = html.replace(
        /<style\b([^>]*)>([\s\S]*?)<\/style>/gi,
        (_, attrs, css) => {
            const { code } = transformSync(css, { loader: 'css', minify: true });
            return `<style${attrs}>${code}</style>`;
        }
    );

    /* ──────────────────────────────────────────────────────────────
       3.  Final HTML cleanup: strip comments + collapse whitespace
           (now safe because the sensitive blocks are placeholders)
    ────────────────────────────────────────────────────────────── */
    html = html
        .replace(/<!--[\s\S]*?-->/g, '')   // remove HTML comments
        .replace(/>\s+</g, '><')           // collapse between tags
        .replace(/\s{2,}/g, ' ')           // collapse runs of spaces/newlines
        .trim();

    /* ──────────────────────────────────────────────────────────────
       4.  Restore the frozen blocks
    ────────────────────────────────────────────────────────────── */
    return html.replace(/§§(\d+)§§/g, (_, i) => protectedBlocks[i]);
}