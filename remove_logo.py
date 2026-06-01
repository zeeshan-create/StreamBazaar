import os
import re

path = r'client\src\components\AdminDashboard.jsx'
with open(path, 'r', encoding='utf-8') as f:
    code = f.read()

# Use regex to find and remove the Game Logo block safely
pattern = r'<div className="admin-form-group" style=\{\{ marginBottom: 0 \}\}>\s*<label style=\{\{ fontSize: \'0\.85rem\' \}\}>Game Logo / Cover URL<\/label>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>'

# Wait, we only want to remove the specific Game Logo admin-form-group block:
target_pattern = r'<div className="admin-form-group" style=\{\{ marginBottom: 0 \}\}>\s*<label style=\{\{ fontSize: \'0\.85rem\' \}\}>Game Logo / Cover URL<\/label>\s*<input\s*className="admin-form-input"\s*placeholder="https://\.\.\. \(Optional\)"\s*value=\{plan\.image \|\| \'\'\}\s*onChange=\{e => \{\s*const newPlans = \[\.\.\.editForm\.plans\];\s*newPlans\[idx\] = \{ \.\.\.newPlans\[idx\], image: e\.target\.value \};\s*setEditForm\(\{...editForm, plans: newPlans\}\);\s*\}\}\s*\/>\s*<\/div>'

# Find all occurrences
matches = re.findall(target_pattern, code)
print(f"Found {len(matches)} occurrences to remove.")

# Replace
code = re.sub(target_pattern, '', code)

# Fix the grid div
grid_pattern = r"<div style=\{\{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' \}\}>"
new_grid = r"<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>"
code = re.sub(grid_pattern, new_grid, code)

with open(path, 'w', encoding='utf-8') as f:
    f.write(code)

print("Done.")
