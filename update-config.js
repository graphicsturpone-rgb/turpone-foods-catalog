const fs = require('fs');
let config = fs.readFileSync('admin/config.yml', 'utf8');

// Add i18n global config after branch
config = config.replace(
  'branch: main\n',
  'branch: main\n\ni18n:\n  structure: multiple_folders\n  locales: [en, fr, es]\n  default_locale: en\n'
);

// Add i18n to recipes collection and fields
config = config.replace(
  'collections:\n  - name: "recipes"\n    label: "Recipes"\n    folder: "content/recipes"\n    create: true\n    slug: "{{slug}}"\n    fields:',
  'collections:\n  - name: "recipes"\n    label: "Recipes"\n    folder: "content/recipes"\n    create: true\n    slug: "{{slug}}"\n    i18n: true\n    fields:'
);

// Add i18n: true to translatable fields
config = config.replace(/\{label: "Title", name: "title", widget: "string"\}/, '{label: "Title", name: "title", widget: "string", i18n: true}');
config = config.replace(/\{label: "Recipe Paragraph \(Under Image\)", name: "body", widget: "markdown"\}/, '{label: "Recipe Paragraph (Under Image)", name: "body", widget: "markdown", i18n: true}');
config = config.replace(/\{label: "Ingredients", name: "ingredients", widget: "list", field: \{label: "Ingredient", name: "ingredient", widget: "string"\}\}/, '{label: "Ingredients", name: "ingredients", widget: "list", i18n: true, field: {label: "Ingredient", name: "ingredient", widget: "string"}}');
config = config.replace(/\{label: "Instructions", name: "instructions", widget: "list", field: \{label: "Step", name: "step", widget: "markdown"\}\}/, '{label: "Instructions", name: "instructions", widget: "list", i18n: true, field: {label: "Step", name: "step", widget: "markdown"}}');
config = config.replace(/\{label: "Nutrition Information", name: "nutrition", widget: "markdown", required: false\}/, '{label: "Nutrition Information", name: "nutrition", widget: "markdown", required: false, i18n: true}');

fs.writeFileSync('admin/config.yml', config, 'utf8');
console.log('Config updated');
