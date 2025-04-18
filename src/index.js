import path from 'path';
import dotenv from 'dotenv';
import loadModule from './Core/utils/loadModule.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const appRoot = path.resolve(process.cwd(), 'src/App');
const coreRoot = path.resolve(process.cwd(), 'src/Core');

const Renderer = await loadModule('Compiler/Renderer.js', appRoot, coreRoot);

export default Renderer;

export const build = async (env = 'dev') => {
    await Renderer.renderAll(env);
};

// Allow direct execution via node index.js (useful for quick CLI testing)
if (import.meta.url === `file://${process.argv[1]}`) {
    const env = process.argv[2] || 'dev';
    build(env).then(() => {
        console.log(`✅ Build completed successfully for "${env}" environment!`);
    }).catch(error => {
        console.error('❌ Error during build:', error);
        process.exit(1);
    });
}