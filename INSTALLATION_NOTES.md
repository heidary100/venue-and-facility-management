# Installation Notes - Phase 2

## ⚠️ Manual Installation Required

The following packages need to be installed manually for the Map system to work:

### Using npm:
```bash
npm install leaflet react-leaflet leaflet.heat @types/leaflet
```

### Using pnpm (recommended):
```bash
pnpm add leaflet react-leaflet leaflet.heat @types/leaflet
```

### Using yarn:
```bash
yarn add leaflet react-leaflet leaflet.heat @types/leaflet
```

## 📦 Already Installed Packages

The following packages were successfully installed for the Booking system:
- ✅ `react-big-calendar`
- ✅ `date-fns-jalali`
- ✅ `@hookform/resolvers` (already present)
- ✅ `zod` (already present)

## 🚀 Running the Application

After installing the map packages, you can run:

```bash
npm run dev
# or
pnpm dev
```

Then visit:
- **Booking System**: http://localhost:3000/bookings
- **Map System**: http://localhost:3000/map

## ✅ Build Verification

The build has been tested and passes successfully:
```bash
npm run build
```

All routes are properly generated and ready for production.

## 📝 Notes

1. **Leaflet CSS**: Already imported in `app/globals.css`
2. **Custom Styles**: All custom map styles are in `app/globals.css`
3. **Type Definitions**: Custom types for `leaflet.heat` are in `types/leaflet-heat.d.ts`
4. **SSR Handling**: Map components use dynamic imports to avoid SSR issues

## 🎯 What's Working

- ✅ Booking system fully functional
- ✅ Calendar with Persian dates
- ✅ Conflict detection
- ✅ My Bookings page
- ✅ Cancellation system
- ⏳ Map system (needs manual package installation)
- ⏳ Venue markers and popups (needs manual package installation)
- ⏳ Heatmap layer (needs manual package installation)

## 🔧 Troubleshooting

If you encounter issues after installing the packages:

1. **Clear Next.js cache**:
   ```bash
   rm -rf .next
   npm run build
   ```

2. **Verify package installation**:
   ```bash
   npm list leaflet react-leaflet
   ```

3. **Check for peer dependency warnings**: These are usually safe to ignore

## 📞 Support

If you encounter any issues:
1. Check that all packages are installed
2. Verify Node.js version (should be 18+)
3. Clear cache and rebuild
4. Check browser console for errors
