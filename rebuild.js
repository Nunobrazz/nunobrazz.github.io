const fs = require('fs');
const path = require('path');

const root = '/Users/nunobrazz/work/nunobrazz.github.io';
const output = path.join(root, 'assets/js/main.min.js');

const files = [
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/fitvids/dist/fitvids.min.js',
    'node_modules/jquery-smooth-scroll/jquery.smooth-scroll.min.js',
    'assets/js/plugins/jquery.greedy-navigation.js'
];

try {
    let content = '';

    console.log('Concatenating libraries...');
    files.forEach(f => {
        const p = path.join(root, f);
        console.log('Reading ' + p);
        content += fs.readFileSync(p, 'utf8') + ';\n';
    });

    console.log('Processing theme.js...');
    let theme = fs.readFileSync(path.join(root, 'assets/js/theme.js'), 'utf8');
    theme = theme.replace(/export const/g, 'const');

    console.log('Processing _main.js...');
    let main = fs.readFileSync(path.join(root, 'assets/js/_main.js'), 'utf8');
    // Remove the import statement
    main = main.replace(/import\s+\{.*\}\s+from\s+['"].*theme\.js['"];?/, '// Import removed by manual build');

    content += '\n' + theme + '\n';
    content += main;

    console.log('Writing to ' + output);
    fs.writeFileSync(output, content);
    console.log('Build successful!');
} catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
}
