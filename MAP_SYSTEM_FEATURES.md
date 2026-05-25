# ⚠️ DEPRECATED → See [docs/FEATURES.md](./docs/FEATURES.md) § Map & Locator

# Facility Map & Locator System - Phase 2

## ✅ Implemented Features

### 1. **Interactive Map with Leaflet**
- ✅ OpenStreetMap tiles integration
- ✅ Full RTL support for Persian interface
- ✅ Responsive design (mobile + desktop)
- ✅ Dynamic map bounds based on filtered venues
- ✅ Smooth zoom and pan controls
- ✅ Custom styled controls matching theme

### 2. **Custom Venue Markers**
- ✅ Type-based marker icons:
  - 🏟️ Stadium (Red)
  - 🏋️ Gym (Blue)
  - 🏊 Pool (Cyan)
  - 🎾 Court (Amber)
  - ⚽ Field (Green)
  - 🏃 Track (Purple)
  - 🏀 Arena (Pink)
  - 📍 Other (Gray)
- ✅ Status-based styling:
  - Active: Full opacity
  - Maintenance: Pulsing animation
  - Closed: Grayscale + reduced opacity
- ✅ Hover effects with scale animation
- ✅ Pin-drop style markers with shadow

### 3. **Rich Marker Popups**
- ✅ Venue name and type
- ✅ Status badge (Active/Maintenance/Closed)
- ✅ Location address
- ✅ Capacity information
- ✅ Utilization rate percentage
- ✅ University affiliation
- ✅ "View Details" button
- ✅ "Book Now" button (for active venues)
- ✅ Persian formatting throughout

### 4. **Advanced Filtering System**
- ✅ **Search Bar**: Search by venue name or address
- ✅ **Venue Type Filter**: Multi-select checkboxes
  - Stadium, Gym, Pool, Court, Field, Track, Arena, Other
- ✅ **Status Filter**: Multi-select checkboxes
  - Active, Maintenance, Closed, Reserved
- ✅ **University Filter**: Multi-select by institution
- ✅ **Accessibility Filter**: Filter venues with accessibility features
- ✅ Active filter count badge
- ✅ Clear all filters button
- ✅ Real-time filtering with instant map updates

### 5. **Heatmap Layer**
- ✅ Toggle-able utilization heatmap
- ✅ Color gradient (Blue → Green → Yellow → Orange → Red)
- ✅ Based on venue utilization rates
- ✅ Configurable radius and blur
- ✅ Smooth opacity transitions

### 6. **Statistics Dashboard**
- ✅ Total venues count
- ✅ Active venues count
- ✅ Average utilization percentage
- ✅ Number of universities
- ✅ Persian digit formatting
- ✅ Icon-based visual indicators

### 7. **Booking Integration**
- ✅ Direct booking from map popup
- ✅ Pre-filled venue selection
- ✅ Full booking form integration
- ✅ Conflict detection
- ✅ Toast notifications

### 8. **Responsive Design**
- ✅ Mobile-friendly sidebar toggle
- ✅ Adaptive layout (sidebar collapses on mobile)
- ✅ Touch-friendly map controls
- ✅ Responsive statistics cards
- ✅ Full-screen map option

### 9. **RTL & Persian Support**
- ✅ Right-to-left layout
- ✅ Persian labels and text
- ✅ Persian digit conversion
- ✅ Vazirmatn font integration
- ✅ RTL-aware controls positioning

### 10. **Performance Optimizations**
- ✅ Dynamic imports to avoid SSR issues
- ✅ Lazy loading of map components
- ✅ Efficient filtering with useMemo
- ✅ Optimized re-renders
- ✅ Loading skeleton states

## 📁 File Structure

```
lib/
├── map-utils.ts              # Map utilities and helpers
└── types.ts                  # TypeScript types (existing)

components/
├── map/
│   ├── venue-map.tsx         # Main map component with markers
│   ├── map-filters.tsx       # Sidebar filters component
│   └── heatmap-layer.tsx     # Heatmap overlay layer
└── ui/
    └── skeleton.tsx          # Loading skeleton component

app/
├── map/
│   └── page.tsx              # Main map page
└── globals.css               # Leaflet custom styles

types/
└── leaflet-heat.d.ts         # TypeScript declarations for leaflet.heat

```

## 🎨 Custom Styling

### Marker Design
- Pin-drop shape with rounded top
- 40x40px size with 3px white border
- Drop shadow for depth
- Rotation animation on hover
- Status-based visual feedback

### Popup Design
- Rounded corners (12px)
- Card-style with border
- Theme-aware colors
- Compact 280px width
- Action buttons at bottom

### Map Controls
- Themed zoom buttons
- Rounded corners
- Smooth hover transitions
- RTL-aware positioning

## 🔧 Technical Implementation

### Dependencies
- `leaflet` - Core mapping library
- `react-leaflet` - React bindings for Leaflet
- `leaflet.heat` - Heatmap plugin
- `@types/leaflet` - TypeScript types

### Key Features
1. **Dynamic Imports**: Prevents SSR issues with Leaflet
2. **Custom Icons**: L.divIcon with HTML/CSS for flexibility
3. **Bounds Calculation**: Auto-fit map to show all filtered venues
4. **Filter State Management**: React state with useMemo optimization
5. **Theme Integration**: Uses CSS variables for dark/light mode

## 📊 Map Utilities

### `getMarkerColor(type)`
Returns color based on venue type

### `getMarkerIcon(type)`
Returns emoji icon for venue type

### `createVenueIcon(venue)`
Creates custom Leaflet DivIcon with status styling

### `calculateBounds(venues)`
Calculates map bounds to fit all venues

### `filterVenues(venues, filters)`
Applies multiple filters to venue list

### `generateHeatmapData(venues)`
Converts venues to heatmap data points

## 🎯 Usage

### View Map
1. Navigate to `/map` page
2. Map loads with all venues
3. Click markers to see details
4. Use filters to narrow results

### Filter Venues
1. Use search bar for text search
2. Check venue types to filter
3. Select status filters
4. Choose universities
5. Toggle accessibility filter

### Book Venue
1. Click on venue marker
2. Click "رزرو" button in popup
3. Fill booking form
4. Submit request

### View Heatmap
1. Click "نقشه حرارتی" button
2. See utilization density overlay
3. Toggle off to return to markers

## 🌟 Highlights

- **Clean Modern UI**: Card-based design with smooth animations
- **Intuitive Navigation**: Easy-to-use filters and search
- **Rich Information**: Comprehensive venue details in popups
- **Seamless Integration**: Direct booking from map
- **Performance**: Optimized rendering and filtering
- **Accessibility**: Keyboard navigation and screen reader support

## 📱 Responsive Breakpoints

- **Mobile** (< 768px): Collapsible sidebar, full-width map
- **Tablet** (768px - 1024px): Side-by-side layout
- **Desktop** (> 1024px): Full sidebar + map layout

## 🎨 Color Scheme

### Venue Types
- Stadium: `#ef4444` (Red)
- Gym: `#3b82f6` (Blue)
- Pool: `#06b6d4` (Cyan)
- Court: `#f59e0b` (Amber)
- Field: `#22c55e` (Green)
- Track: `#a855f7` (Purple)
- Arena: `#ec4899` (Pink)
- Other: `#6b7280` (Gray)

### Heatmap Gradient
- 0.0: `#3b82f6` (Blue - Low)
- 0.3: `#22c55e` (Green)
- 0.5: `#eab308` (Yellow)
- 0.7: `#f97316` (Orange)
- 1.0: `#ef4444` (Red - High)

## 🚀 Future Enhancements (Optional)

- [ ] Clustering for dense marker areas
- [ ] Route planning between venues
- [ ] Street view integration
- [ ] Satellite/terrain map layers
- [ ] Custom map styles
- [ ] Venue photos in popups
- [ ] Distance calculation from user location
- [ ] Favorite venues marking
- [ ] Share map view URL
- [ ] Export venue list
- [ ] Print map functionality
- [ ] Offline map caching

## 📦 Manual Installation Required

Please install these packages manually:
```bash
npm install leaflet react-leaflet leaflet.heat @types/leaflet
# or
pnpm add leaflet react-leaflet leaflet.heat @types/leaflet
```

## ✨ Key Achievements

✅ Full-featured interactive map with OpenStreetMap
✅ Custom venue markers with type-based icons
✅ Rich popups with booking integration
✅ Advanced multi-criteria filtering
✅ Utilization heatmap overlay
✅ Complete RTL and Persian support
✅ Responsive mobile-first design
✅ Theme-aware styling (dark/light mode)
✅ Performance optimized with lazy loading
✅ Seamless integration with booking system
