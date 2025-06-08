
# Components

All components are globally registered once you `app.use()` the plugin.

| Component            | Props / Slots      | Description                             |
| -------------------- | ------------------ | --------------------------------------- |
| `AppBtn`             | `label`, `onClick` | Standard button with base styles       |
| `AppIcon`            | `name`, `size?`    | Renders an SVG icon from `iconHelper`   |
| `AppImage`           | `src`, `alt`       | `<img>` wrapper with `baseImageUrl`     |
| `AppThemeToggler`    | —                  | Switch light/dark theme                 |
| `AppLocaleToggler`   | —                  | Toggle between `locales` you provided   |
| `AppSection`         | `title`            | Card-like content section               |
| `AppDialog`          | `visible`, `onClose` | Basic modal dialog                     |
| `AppBreadcrumb`      | `items`            | Breadcrumb navigation                   |
| `AppMenu`            | `items`            | Sidebar / dropdown menu                 |
