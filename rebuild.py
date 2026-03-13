import os
import re

root = '/Users/nunobrazz/work/nunobrazz.github.io'
files = [
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/fitvids/dist/fitvids.min.js',
    'node_modules/jquery-smooth-scroll/jquery.smooth-scroll.min.js',
    'assets/js/plugins/jquery.greedy-navigation.js'
]

content = ""

for f in files:
    try:
        with open(os.path.join(root, f), 'r') as file:
            content += file.read() + ";\n"
    except Exception as e:
        print(f"Error reading {f}: {e}")
        exit(1)

# Theme.js processing
try:
    with open(os.path.join(root, 'assets/js/theme.js'), 'r') as file:
        theme = file.read()
        # Remove 'export '
        theme = theme.replace('export const', 'const')
except Exception as e:
    print(f"Error reading theme.js: {e}")
    exit(1)

# _main.js processing
try:
    with open(os.path.join(root, 'assets/js/_main.js'), 'r') as file:
        main = file.read()
        # Remove import line
        main = re.sub(r"import\s+\{.*\}\s+from\s+['\"].*theme\.js['\"];?", "// Import removed", main)
except Exception as e:
    print(f"Error reading _main.js: {e}")
    exit(1)

content += "\n" + theme + "\n"
content += main

output_path = os.path.join(root, 'assets/js/main.min.js')
try:
    with open(output_path, 'w') as file:
        file.write(content)
    print("Build complete via Python")
except Exception as e:
    print(f"Error writing output: {e}")
    exit(1)
