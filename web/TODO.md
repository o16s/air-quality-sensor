# OctaView — Plan

## Vision

One dashboard to see all your sensors — whether they're plugged in, wireless, or in the cloud — without needing to know how any of it works.

**Target users**: Researchers, farmers, facility operators, citizen scientists. Not IT-trained. They think in terms of "my sensor at location X", not protocols or databases.

## Design Principles

1. **The user adds "a sensor", not "a connection type"** — plug something in and it appears; click "Add sensor" for everything else. The connection type is a property of the sensor, not the user's problem.
2. **Every device looks the same once added** — whether it came from USB, BLE, or InfluxDB, the sensor card, chart, export, and history are identical.
3. **Sync is invisible** — USB downloads logs explicitly, BLE streams, InfluxDB polls. The user just sees data appear. A status indicator shows "live" vs "last seen 2h ago".
4. **Gateways are invisible** — users manage the sensors behind a gateway, not the gateway itself.
5. **InfluxDB setup needs a wizard** — non-IT users can't fill in URLs and map fields. Use connection links, QR codes, or auto-discovery with preview values so users recognize their data.
6. **Images are just another reading** — a camera's timeline shows thumbnails where a CO2 sensor shows a number.

## Killer Feature: Generative UI

A prompt-driven dashboard builder. The user types a sentence, the system hydrates a curated set of web components, and the result is a shareable URL.

- "Show me CO2 and temperature in the greenhouse this week"
- "Compare sensor A and sensor B side by side"
- "What happened last night in building 3?"

**How it works**: The LLM does not generate HTML. It returns a layout descriptor (small JSON) that specifies which components to render with which data queries. Web components hydrate from that descriptor. This is constrained generation against a known schema — reliable and fast.

```
User prompt → LLM → layout JSON → web components hydrate → live dashboard
```

**Shareable views**: The layout JSON is small enough to encode in a URL fragment. A facility manager generates a view, copies the link, sends it to their boss. The boss opens it and sees live data.

**Offline consideration**: LLM calls need internet. Options: local model (llama.cpp in Electron), or generative UI is a "connected" feature while standard nav works offline.

**Requirements for this to work**:
- Response under 2 seconds (fast model or pre-cached patterns)
- Always show what was selected with one-click corrections (don't force re-prompting)
- Generative UI is the fast path, not the only path — standard click-through nav must exist

## Device Categories

| Category | Data Flow | User Experience |
|----------|-----------|-----------------|
| **USB data logger** | Plug in, download stored logs, see live readings, change settings, flash firmware | Fully supported today |
| **BLE sensor** | Scan nearby, streams while in range | "Add sensor" → scan → appears in fleet |
| **IoT gateway** | One box brokers many sensors, always connected | Sensors behind it appear individually |
| **Timeseries DB** (InfluxDB, Postgres) | App polls or queries the DB, maps buckets/fields to a device | Wizard: connection link or auto-discover, user confirms field mapping by recognizing preview values |
| **Camera / image** | Produces images alongside or instead of scalars | Thumbnails in timeline, full-size on click |
| **Phone-as-sensor** | Scan QR from dashboard, phone opens web page, streams via WebRTC | No app install, shows up as another device |

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

### Key conceptual shift

Today: **device type = log format = connection method** (all USB, log type determines parser).

After: **device type** (what it measures) and **connection type** (how data arrives) are orthogonal. A CO2 sensor can be USB or BLE. An InfluxDB bucket can map to any metric set. A phone is just a device type with camera + GPS metrics and a WebRTC connection type.

### Expanded deviceMetadata fields (schemaless, no version bump)

Current: `{serial, name, tags, model, deviceType, updatedAt}`

Add fields:
```
{
  serial,           // existing - primary key
  name,             // existing - user-assigned name
  tags,             // existing - array of strings
  model,            // existing - firmware-reported model
  deviceType,       // existing - LOG_TYPE integer
  updatedAt,        // existing
  folderId,         // NEW - reference to deviceFolders store
  connectionType,   // NEW - 'usb' | 'ble' | 'gateway-child' | 'influxdb' | 'phone'
  connectionConfig, // NEW - type-specific (see below)
  parentDevice,     // NEW - serial of parent gateway (null for standalone)
  lastSeen,         // NEW - epoch timestamp of last data received
  firstSeen,        // NEW - epoch timestamp of first connection
  status,           // NEW - 'online' | 'offline' | 'stale'
  description,      // NEW - user-entered notes
  location,         // NEW - free-text location label
}
```

`connectionConfig` varies by type but the user never sees it:
- USB: `{}` (nothing extra, same as today)
- BLE: `{ bleAddress, serviceUUID }`
- Gateway child: `{ gatewaySerial, sensorIndex }`
- InfluxDB: `{ url, token, bucket, fieldMap: { "temp_c": "temperature", "rh": "humidity" } }`
- Phone: `{ pairingCode, signalingInfo }`

- `connectionType` defaults to `'usb'` for current devices
- `lastSeen` updated on every log download and live data fetch
- `firstSeen` set once on first connection

### New IndexedDB stores (single DB version bump)

All four stores created in one migration (DB version 3 → 4). Foundation for fleet management, event pipeline, and image support.

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

**media** (for camera/image devices):
```
{
  id,               // auto-increment
  deviceSerial,     // which device
  timestamp,        // epoch ms
  mimeType,         // 'image/jpeg', 'image/png'
  blob,             // image data
  thumbnailBlob,    // smaller version for timeline/table display
}
Indexes: deviceSerial, timestamp, [deviceSerial, timestamp]
```

Log records from camera devices reference media by ID:
```js
{ timestamp, deviceSerial, logType, temperature: 23.5, mediaId: 42 }
```

Scalars and images coexist in the same timeline. Charts show temperature, tables show a thumbnail. Same query, same `logs` store — just an optional `mediaId` field.

---

## 5. Connection Types

All connection types feed the same `logs` store with flat records. Downstream code (charts, tables, exports, events) is identical regardless of source.

| Connection | How Added | Data Flow | Sync Model |
|------------|-----------|-----------|------------|
| **USB** | Auto-detected on plug-in | Binary protocol over WebUSB | Explicit: "Download logs" button |
| **BLE** | "Add sensor" → scan nearby | GATT characteristic notifications | Implicit: streams while in range |
| **Gateway** | "Add sensor" → gateway detected, child sensors appear individually | Gateway forwards child data over MQTT/HTTP | Implicit: always connected |
| **InfluxDB / Postgres** | Wizard: connection link, QR code, or auto-discover on LAN | App queries DB, maps fields to metrics | Implicit: periodic poll |
| **Phone** | Scan QR code from dashboard → phone opens web page | WebRTC stream (camera, GPS, sensors) | Implicit: streams while page open |
| **Manual** | Paste CSV/JSON or enter readings | User import | One-time or repeated |

Device Detail view works the same regardless of source — renders from IndexedDB logs. Difference is only in how data gets into IndexedDB.

**"Add Sensor" flow** (unified):
- Plug something in → it appears (USB, as today)
- Click "Add sensor" → scan nearby (BLE)
- Click "Add sensor" → "I have a data source" → guided wizard (InfluxDB, gateway, phone)
- The user never picks a "connection type" — the flow guides them based on what they have

**InfluxDB wizard** (non-IT users can't fill in URLs and tokens):
- Option A: "Ask your IT person for a connection link" (URL with token embedded, or QR code)
- Option B: Auto-discover InfluxDB on local network
- Then: show discovered measurements with preview values so user recognizes their data ("oh, 23.5 is the greenhouse temperature")
- User confirms mapping, device appears in fleet like any other sensor

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
- BLE connection layer (Web Bluetooth API)
- Gateway MQTT/HTTP broker
- InfluxDB/Postgres query adapter + wizard UI
- Phone-as-sensor (WebRTC signaling, QR pairing)
- Camera/image capture and media store
- Generative UI prompt box + layout descriptor schema + component hydration
- Shareable dashboard URLs (layout JSON in URL fragment)
- PDF report generation with custom branding
- OPC UA / Modbus TCP connectors

---

## Implementation Order

Data model first. Everything else builds on it. Connection types after fleet management is solid. Generative UI last (needs the component library to exist first).

### Phase 1: Foundation

1. **Data model** — Single DB migration (v3 → v4) creating all new stores (`deviceFolders`, `events`, `detectionConfig`, `media`) and expanding `deviceMetadata` fields (`folderId`, `connectionType`, `connectionConfig`, `parentDevice`, `lastSeen`, `firstSeen`, `status`, `description`, `location`). One migration covers fleet, events, and media.

### Phase 2: Fleet Management (USB only)

2. **Devices page (List tab)** — Device table with metadata columns. Row click → sets `selectedDeviceSerial`, navigates to detail.
3. **Device Detail page** — Merge Overview + History into one page scoped to selected device. Wire up existing widgets.
4. **Sidebar restructure** — Replace Overview/History nav items with Devices. Add folder items dynamically.

### Phase 3: Event Pipeline

5. **Event persistence** — Auto-detected events persisted to `events` store. Basic CRUD (confirm, dismiss, label).
6. **Configurable detection** — Algorithm selection UI (MAD/EWMA/IQR), per-device/metric params.
7. **Chart overlays** — Confidence bands, event markArea, threshold markLines on ECharts chart.

### Phase 4: Fleet Intelligence

8. **Devices page (Overview tab)** — Status cards + metric summary widgets with aggregation.
9. **Folder CRUD** — Create/rename/delete/reorder folders. Folder scoping for Devices page.
10. **Event annotation UI** — Dismiss, label, create custom events, add notes.

### Phase 5: Connection Types (expand beyond USB)

11. **BLE adapter** — Web Bluetooth scanning, GATT reads, data normalized to flat log records in IndexedDB.
12. **InfluxDB adapter + wizard** — Connection link / auto-discover, field mapping UI with preview values, periodic poll.
13. **Media store + camera support** — Image capture from connected cameras, thumbnails in timeline, media store for blobs.
14. **Phone-as-sensor** — QR pairing, WebRTC signaling, camera + GPS + sensor streaming from phone browser.
15. **Gateway support** — MQTT/HTTP broker, child sensor auto-registration, parent-child relationship in metadata.

### Phase 6: Generative UI

16. **Web component library** — Curated, self-contained components (chart, table, sparklines, heatmap, map, image gallery, status cards, metric summary) that hydrate from a descriptor JSON.
17. **Layout descriptor schema** — JSON schema defining what components, data queries, and layout the generative UI can produce.
18. **Prompt-to-dashboard** — LLM integration that takes a user sentence, returns a layout descriptor, components hydrate.
19. **Shareable URLs** — Layout JSON encoded in URL fragment. Recipient opens link, sees live dashboard.

### Future

20. **Training data export** — Labeled events as CSV/JSON for external ML pipelines.
21. **ML-based detection** — Isolation Forest or TensorFlow.js autoencoder.
22. **PDF reports** — Compliance-ready reports with custom branding.
23. **Industrial protocols** — OPC UA, Modbus TCP (only when there's a real customer need).

Phases 1-4 = current app, better. Phase 5 = multi-source. Phase 6 = the differentiator.

---

## Open Questions

- **Sidebar style**: Folder tree permanently in sidebar (like Datacake) or compact icon sidebar with folders inside Devices page?
- **Device detail layout**: All sections on one long page, or tabs within the detail view?
- **Page naming**: "Devices" vs "Fleet" vs keep "Overview" for fleet view?
- **Generative UI model**: Cloud LLM (fast, needs internet) vs local model in Electron (llama.cpp, works offline, slower)?
- **Web component set**: What's the curated list of components the generative UI can compose? (chart, table, sparkline grid, heatmap, map, image gallery, status cards, metric summary — ~10-15 total)
- **Media storage limits**: How much image data can IndexedDB hold before we need File System Access API or external storage?
- **Pricing model**: Hardware+software bundle vs standalone software subscription? Open-core vs proprietary?
- **Platform**: Electron desktop only, or also a web version? macOS + Windows from day one?

## Landing Page North Star

The landing page should sell **Octanis the system** — hardware + software together. Not a generic IoT platform competing with Grafana or Datacake.

**Hero**: One text input, one generated dashboard, one share button. That's the screenshot. The generative UI is the demo moment — not "connect your devices" (that's plumbing).

**Tone**: Practical, honest, speaks to budget and resource constraints. Like a peer who understands real-world constraints. No "leverage edge computing to operationalize real-time telemetry." Yes "see what your sensors are doing, right now."

**Rules**:
- Don't claim features that aren't built (no OPC UA, no "1,200+ facilities", no ISO 27001)
- Don't use protocol names in hero copy (OPC UA, Modbus TCP mean nothing to target users)
- Do show a real product screenshot or video
- Do lead with outcomes, not architecture
- Do show industry verticals (strongest section)
- Do add social proof as soon as any exists
