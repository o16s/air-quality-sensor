# Device Manager — Plan

## Intent

Move from a single-device companion app to a fleet management dashboard. Multiple devices of different types deployed across locations, not all WebUSB — some will push data from remote servers (Postgres, InfluxDB). Users need to organize, compare, and track devices over time.

## Navigation Restructure

**Current:**
```
Sidebar: Overview | History | [Report] | Help
         (1 device)  (1 device)
```

**Proposed:**
```
Sidebar: Devices | [Report] | Help
              |
         Fleet view (all devices / folder)
              | click device
         Device detail (= current Overview + History merged)
```

Overview and History are not separate pages — they're two views of the same device. Merge into "Device Detail" and add a fleet-level "Devices" page.

---

## 1. Devices Page (Fleet View)

Replaces current "Overview" page in sidebar. Always visible (even with 0 devices).

### a) Overview Tab — Aggregate Dashboard

- **Status cards**: Total devices, Online, Offline, Active in last 24h
- **Metric summary widgets**: One card per metric across devices in current view
  - Metric name + icon
  - Number of devices reporting this metric
  - Average value (mean of latest reading per device)
  - Min / Max across fleet
  - Status badge (from `AIR_QUALITY_THRESHOLDS`)
- Widgets scoped: "All Devices" shows all, a folder shows only its members
- Clicking a metric widget opens detail view (nice-to-have, not MVP)

### b) List Tab — Device Table

- Columns: Name, Model, Type (PM/CO2), Status (online dot), Last Seen, Measurements, Folder, Actions
- Sortable columns
- Row click → navigate to device detail
- Device image thumbnail (`img/{model}.jpg`)
- Bulk actions (later): delete data, move to folder

### c) Empty State

When no devices exist:
- "No devices yet"
- "Connect a USB device" button
- (Later) "Add remote device" button

---

## 2. Folders

### Data Model

New IndexedDB store `deviceFolders`:
```
{ id: string, name: string, color: string, order: number, createdAt: number }
```

Device-to-folder: add `folderId` to existing `deviceMetadata` (schemaless, no DB version bump).

### Sidebar Integration

```
Devices
  All Devices          <- fleet overview for all
  [folder] Office      <- fleet overview filtered to folder
  [folder] Outdoor
  + Create Folder
```

### Behavior

- Selecting a folder scopes Devices page (Overview + List) to folder members
- A device belongs to 0 or 1 folder (unassigned = visible under "All Devices" only)
- CRUD via "Manage Folders" dialog
- Deleting a folder unassigns devices (doesn't delete them)
- Drag-drop reorder (nice-to-have)

### Folders vs Tags

Tags = flat metadata for filtering within a view. Folders = hierarchy in sidebar for spatial navigation. Both coexist.

---

## 3. Device Detail View

Replaces current "History" page + parts of "Overview". Reached by clicking a device row or device in switcher dropdown.

### Header

Device name, model image, serial, status dot, type badge, last seen, edit button.
- Connected: Sync Data, Settings, Disconnect buttons
- Offline: "Last synced: ..." and reconnect button

### Sections (stacked vertically)

1. **Live data cards** (only if connected) — sensor cards with sparklines
2. **History chart** — ECharts history view
3. **Measurement table** — log table
4. **Events timeline**
5. **Heatmap**

Same as current UI, but namespaced to a specific device and reachable via fleet navigation.

---

## 4. Data Model Expansion

### Expanded deviceMetadata fields (schemaless, no version bump)

Current: `{serial, name, tags, model, deviceType, updatedAt}`

Add fields:
```
{
  serial,         // existing - primary key
  name,           // existing - user-assigned name
  tags,           // existing - array of strings
  model,          // existing - firmware-reported model
  deviceType,     // existing - LOG_TYPE integer
  updatedAt,      // existing
  folderId,       // NEW - reference to deviceFolders store
  source,         // NEW - 'webusb' | 'manual' | 'postgres' | 'influxdb'
  lastSeen,       // NEW - epoch timestamp of last data received
  firstSeen,      // NEW - epoch timestamp of first connection
  description,    // NEW - user-entered notes
  location,       // NEW - free-text location label
}
```

- `lastSeen` updated on every log download and live data fetch
- `firstSeen` set once on first connection
- `source` defaults to `'webusb'` for current devices

### New IndexedDB stores (single DB version bump)

All three stores created in one migration (DB version 3 → 4). This is the foundation for both fleet management and the event detection pipeline.

**deviceFolders:**
```
{ id: string, name: string, color: string, order: number, createdAt: number }
```

**events:**
```
{
  id,               // auto-increment
  deviceSerial,     // which device
  metric,           // which metric (e.g. 'pm25', 'co2')
  startTime,        // epoch ms — event start
  endTime,          // epoch ms — event end
  duration,         // ms (endTime - startTime)
  peak,             // peak value during event
  peakTime,         // epoch ms — when peak occurred
  severity,         // 'low' | 'moderate' | 'high' | 'severe'
  detectionMethod,  // 'mad' | 'ewma' | 'iqr' | 'threshold' | 'manual'
  baseline,         // baseline value at detection time
  maxZScore,        // peak deviation in MAD units (or equivalent)
  status,           // 'suggested' | 'confirmed' | 'dismissed'
  label,            // user-assigned label (e.g. 'cooking', 'traffic')
  notes,            // free-text annotation
  userCreated,      // boolean — true if manually created
  createdAt,        // epoch ms
  updatedAt,        // epoch ms
}
Indexes: deviceSerial, [deviceSerial, startTime], status
```

**detectionConfig:**
```
{
  id,               // auto-increment
  deviceSerial,     // which device (or '*' for global default)
  metric,           // which metric
  algorithm,        // 'mad' | 'ewma' | 'iqr'
  params,           // algorithm-specific: { threshold, windowSize, minDuration, ... }
  enabled,          // boolean
}
```

---

## 5. Future: Non-WebUSB Devices

Not in scope for first implementation, but data model accommodates it.

|                  | WebUSB Device                        | Remote Device                              |
|------------------|--------------------------------------|--------------------------------------------|
| **How added**    | Auto-detected on USB connect         | User enters details (serial, name, type, connection string) |
| **Data source**  | USB protocol (binary)                | API fetch from Postgres/InfluxDB           |
| **Online status**| USB connected                        | Last data within threshold (e.g. 5 min)    |
| **Live data**    | 10s auto-refresh from USB            | Poll interval from remote server           |
| **Sync**         | Download all logs from flash         | Incremental fetch (since timestamp)        |

Device Detail view works the same regardless of source — renders from IndexedDB logs. Difference is only in how data gets into IndexedDB.

**"Add Device" flow (future):**
1. Choose source: USB / Postgres / InfluxDB / Manual
2. Remote: enter connection details, test, import
3. Manual: enter serial, name, type, paste CSV/JSON

---

## 6. Event Detection & Analysis Pipeline

Builds on the `events` and `detectionConfig` stores from section 4. Progresses from persistence to configurable detection to visualization to ML.

### Phase 1: Event Persistence (depends on data model)

Wire the existing MAD-based detection (`events.js`) into the new `events` store so detected events survive page reloads.

- Auto-detected events written to IndexedDB with `status: 'suggested'`
- User-created events written with `userCreated: true`, `status: 'confirmed'`
- Events queryable by device, time range, status
- Existing `eventsUI.js` reads from store instead of re-detecting on every page load
- Event CRUD: confirm, dismiss, label, add notes, delete

### Phase 2: Configurable Detection (depends on Phase 1)

Replace the single hardcoded MAD algorithm with a pluggable detection system.

- **Algorithms:**
  - MAD (Median Absolute Deviation) — current implementation, robust to outliers
  - EWMA (Exponentially Weighted Moving Average) — adaptive to drift, good for slow-changing baselines
  - IQR (Interquartile Range) — simple, distribution-free
- **Per-device/metric configuration** via `detectionConfig` store:
  - Algorithm selection
  - Threshold multiplier (e.g. 3x MAD vs 5x MAD)
  - Window size (number of recent readings for baseline)
  - Minimum event duration (filter transient spikes)
- **Settings UI**: Detection config panel in device settings modal
- **Dependency**: `simple-statistics` npm package for robust statistical functions

### Phase 3: Chart Visualization (depends on Phases 1-2)

Overlay detection results on the ECharts history chart.

- **Confidence bands**: Rolling mean +/- k*std rendered as stacked area (semi-transparent)
- **Event markArea overlays**: Severity-colored bands over event time ranges, togglable via button
- **Threshold reference lines**: Horizontal markLines for metrics with `AIR_QUALITY_THRESHOLDS` entries
- **ECharts imports**: Add `MarkAreaComponent` + `MarkLineComponent` to chart setup
- **Toggle button**: Show/hide overlays (events, bands, thresholds) independently

### Phase 4: Training Data & ML (future)

Export labeled event data for external ML pipelines, and optionally run lightweight models in-browser.

- **Training data export**: Labeled events as CSV/JSON
  - Format: `(timestamp, metric, value, event_label, severity, user_notes)`
  - Includes context window around each event (configurable padding)
- **Optional: Isolation Forest** (`isolation-forest-js`) for multivariate anomaly detection
- **Optional: TensorFlow.js** autoencoder for learned anomaly profiles
- These are stretch goals — the export alone is valuable for feeding external tools

---

## Not Building Yet

- Map view (GPS data sparse in current devices)
- Grid view (useful at 50+ devices, not at 5)
- Rules/Alerts (threshold notifications)
- Multi-select / bulk operations
- Real-time aggregation across folders (start with per-device latest, aggregate on demand)
- Metric detail modal (device detail view covers this)

---

## Implementation Order

Data model first. Everything else builds on it.

### Foundation

1. **Data model** — Single DB migration (v3 → v4) creating all new stores (`deviceFolders`, `events`, `detectionConfig`) and expanding `deviceMetadata` fields (`folderId`, `source`, `lastSeen`, `firstSeen`, `description`, `location`). One migration covers both fleet management and event pipeline needs.

### Fleet Management

2. **Devices page (List tab)** — Device table with metadata columns. Row click → sets `selectedDeviceSerial`, navigates to detail.
3. **Device Detail page** — Merge Overview + History into one page scoped to selected device. Wire up existing widgets.
4. **Sidebar restructure** — Replace Overview/History nav items with Devices. Add folder items dynamically.

### Event Pipeline

5. **Event persistence** — Auto-detected events (from existing MAD logic) persisted to `events` store. Events survive page reloads. Basic CRUD (confirm, dismiss, label).
6. **Configurable detection** — Algorithm selection UI (MAD/EWMA/IQR), per-device/metric params, `detectionConfig` store. Add `simple-statistics` dependency.
7. **Chart overlays** — Confidence bands, event markArea, threshold markLines on ECharts chart. Import `MarkAreaComponent` + `MarkLineComponent`.

### Fleet Intelligence

8. **Devices page (Overview tab)** — Status cards + metric summary widgets with aggregation across devices.
9. **Folder CRUD** — Create/rename/delete/reorder folders. Assign devices to folders. Folder scoping for Devices page.

### Event Interaction

10. **Event annotation UI** — Dismiss suggested events, label confirmed events, create custom events from chart selection, add notes.

### Future

11. **Training data export** — Labeled events as CSV/JSON for external ML pipelines.
12. **ML-based detection** — Isolation Forest or TensorFlow.js autoencoder (stretch goals).

Steps 1-4 = structural. Steps 5-7 = event pipeline. Steps 8-10 = intelligence layer. Steps 11-12 = future.

---

## Open Questions

- **Sidebar style**: Folder tree permanently in sidebar (like Datacake) or compact icon sidebar with folders inside Devices page?
- **Device detail layout**: All sections on one long page, or tabs within the detail view?
- **Page naming**: "Devices" vs "Fleet" vs keep "Overview" for fleet view?
