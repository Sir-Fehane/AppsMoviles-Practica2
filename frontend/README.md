# Cine App Mobile (React Native + Expo)

Aplicación móvil desarrollada con **React Native** y **Expo** para la gestión y simulación interactiva de salas de cine para todas las películas registradas en el backend.

## Funcionalidades Principales

1. **Cartelera y Catálogo de Películas:**
   - Lista todas las películas con su título, director, categoría y duración formateada.
   - Búsqueda en tiempo real por título o nombre del director.
   - Filtro horizontal dinámico por categorías.
   - Conexión directa a la API de **FastAPI** con respaldo offline automático (*fallback mock data*) si el backend aún no está iniciado.

2. **Detalle Completo de cada Película:**
   - Ficha técnica completa (director, categoría, duración en minutos y horas).
   - Sinopsis descriptiva de la película.
   - Datos de la sala asignada (ej. *IMAX Láser*, *Macro XE*, *VIP Lounge*), precio de entrada y horarios de función disponibles.
   - Acceso con un toque al simulador de sala.

3. **Simulador Interactivo de Sala de Cine:**
   - Visualización estilizada de la pantalla de cine (*PANTALLA*) con efecto de iluminación neón.
   - Matriz interactiva de asientos por filas (A, B, C, D, E, F) y columnas (1 a 8).
   - Selector de horarios de función (ej. 16:00, 18:30, 21:00).
   - Estados de asientos:
     - 🟩 **Seleccionado:** Elegido por el usuario en tiempo real.
     - ⬛ **Disponible:** Listo para ser reservado.
     - 🟥 **Ocupado:** No disponible (bloqueado).
     - 🟨 **Fila VIP:** Asientos preferenciales.
   - Cálculo automático del monto total según la cantidad de boletos.
   - Emisión de **Boleto Digital Simulado** con código QR, desglose de asientos y confirmación de reserva.

---

## Estructura del Frontend

```text
frontend/
├── src/
│   ├── api/
│   │   └── api.js              # Cliente HTTP hacia FastAPI con fallback
│   ├── components/
│   │   ├── CinemaRoom.js       # Simulador de sala y asientos
│   │   ├── Header.js           # Encabezado con estado de conexión y config de IP
│   │   ├── MovieCard.js        # Tarjeta de película
│   │   ├── MovieDetailModal.js # Pantalla de detalle de película
│   │   └── TicketModal.js      # Boleto digital simulado
│   ├── data/
│   │   └── mockMovies.js       # Datos de respaldo para pruebas sin backend
│   └── theme/
│       └── colors.js           # Paleta de colores Dark Cinema
├── App.js                      # Componente principal y gestión de estado
├── app.json                    # Configuración de Expo
├── package.json                # Dependencias de npm
└── README.md                   # Esta documentación
```

---

## Cómo Ejecutar la App

### 1. Instalar dependencias
Entra a la carpeta `frontend` y ejecuta:
```bash
cd frontend
npm install
```

### 2. Iniciar el servidor de desarrollo de Expo
```bash
npx expo start
```
O con npm:
```bash
npm start
```

### 3. Probar en tu dispositivo:
- **En tu celular (Android / iOS):**
  1. Instala la app **Expo Go** desde Google Play Store o Apple App Store.
  2. Escanea el código QR que aparecerá en tu terminal con la cámara (iOS) o desde Expo Go (Android).
  3. Asegúrate de que tu celular y computadora estén en la misma red Wi-Fi.

- **En el Navegador Web:**
  Presiona la tecla `w` en la terminal para abrir la versión Web.

- **En Emulador Android:**
  Presiona la tecla `a` en la terminal.

---

## Conexión con el Backend (FastAPI)

En el encabezado de la app verás un indicador:
- Si dice **API Online**, está consumiendo directamente los datos de tu MySQL vía FastAPI.
- Si dice **Simulación**, está usando datos de prueba locales.

Puedes tocar el botón de engranaje (⚙️) en cualquier momento dentro de la app para ajustar la IP de tu backend según tu entorno:
- **Navegador web o simulador iOS:** `http://localhost:8000`
- **Emulador de Android Studio:** `http://10.0.2.2:8000`
- **Dispositivo móvil físico (Wi-Fi):** `http://<IP_DE_TU_PC>:8000` (ej: `http://192.168.1.45:8000`)
