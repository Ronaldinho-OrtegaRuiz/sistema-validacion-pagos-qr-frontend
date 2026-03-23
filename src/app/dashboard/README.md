# Rutas `app/dashboard`

Solo entran aquí **`layout.tsx`**, **`page.tsx`** y subcarpetas de **rutas** (p. ej. `stats/`).

El resto del UI del dashboard vive en **`components/`**:

| Carpeta | Contenido |
|--------|-----------|
| `components/auth/` | Protección de rutas (`AuthGuard`). |
| `components/shell/` | Layout del dashboard: sidebar, shell móvil/desktop, tiles auxiliares. |
| `components/payments/` | Listado de pagos, badges de droguería, tabla, paginación, sección principal. |

Así se separa **routing (App Router)** de **presentación y lógica de UI**.
