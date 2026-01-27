/**
 * Internationalization (i18n) Module
 * Provides German/English language support with flat key structure
 * Uses Swiss High German (Schweizer Hochdeutsch) for German translations
 */

const translations = {
    en: {
        // Navigation
        nav_overview: "Overview",
        nav_history: "History",
        nav_report: "Report",
        nav_help: "Help",

        // Page titles and subtitles
        page_history_title: "Measurement History",
        page_history_subtitle: "Browse and export stored sensor data",
        page_report_title: "Report Generator",
        page_report_subtitle: "Export air quality audits as professional PDF documents",

        // Device header bar
        device_selectDevice: "Select Device",
        device_connectNew: "Connect new device",
        device_noDevicesFound: "No devices found",
        device_online: "Online",
        device_offline: "Offline",
        device_connected: "connected",
        device_edit: "Edit device",
        device_settings: "Device Settings",
        device_disconnect: "Disconnect Device",

        // Battery & storage
        battery_charging: "(charging)",
        storage_measurement_one: "{{count}} measurement",
        storage_measurement_other: "{{count}} measurements",
        storage_memoryFullIn: "Memory full in {{time}}",
        storage_memoryFull: "Memory full",
        storage_tooltip: "Recording every {{interval}} min",
        storage_maxMeasurements: "Max {{max}} measurements",
        storage_percentUsed: "{{percent}}% used",

        // Actions
        action_connect: "Connect Device",
        action_measureNow: "Measure Now",
        action_syncData: "Sync Data",
        action_exportCSV: "Export CSV",
        action_clear: "Clear",
        action_save: "Save",
        action_cancel: "Cancel",
        action_reset: "Reset",
        action_generatePDF: "Generate PDF Report",
        action_aiAnalysis: "AI Analysis",
        action_addFinding: "+ Add finding",
        action_addRecommendation: "+ Add recommendation",

        // Live data section
        live_title: "Live Sensor Data",
        live_subtitle: "Current readings from connected device",
        live_sensorData: "Sensor data",

        // Sensor labels
        sensor_pm25: "PM2.5",
        sensor_pm10: "PM10",
        sensor_temperature: "Temperature",
        sensor_humidity: "Humidity",
        sensor_co2: "CO2",
        sensor_light: "Light",
        sensor_pressure: "Pressure",
        sensor_gasResistance: "Gas Resistance",
        sensor_fromLastSync: "(from last sync)",
        sensor_battery: "Battery",

        // Time strings
        time_fresh: "fresh",
        time_secondsOld: "{{seconds}}s old",
        time_minutesOld: "{{minutes}}m old",
        time_hoursOld: "{{hours}}h old",
        time_lastSynced: "Last synced: {{time}}",
        time_neverSynced: "Never synced",

        // Sync progress
        sync_syncing: "Syncing...",
        sync_syncingProgress: "Syncing {{current}}/{{total}}",
        sync_acquiring: "Acquiring...",
        sync_acquiringCountdown: "Acquiring... {{seconds}}s",
        sync_reading: "Reading...",
        sync_refreshed: "Refreshed!",

        // Events section
        events_title: "Events Detected",
        events_subtitle: "Air quality anomalies and threshold violations",
        events_filter_24h: "Last 24 hours",
        events_filter_7d: "Last 7 days",
        events_filter_30d: "Last 30 days",
        events_filter_all: "All time",
        events_notEnoughData: "Not enough data for event detection",
        events_noEvents: "No significant events detected",
        events_noEventsInPeriod: "No events in selected time period",
        events_errorDetecting: "Error detecting events",
        events_peak: "Peak {{metric}}",
        events_baseline: "baseline",
        events_threshold_yellow: "yellow threshold",
        events_threshold_orange: "orange threshold",
        events_threshold_red: "red threshold",
        events_combustion: "combustion",
        events_combustionTooltip: "PM2.5 and PM10 spiked together - indicates combustion source (smoking, cooking, exhaust)",

        // Heatmap section
        heatmap_title: "Activity Heatmap",
        heatmap_subtitle: "Hourly averages (last 14 days)",
        heatmap_subtitle_dynamic: "Hourly averages (last {{days}} days)",
        heatmap_notEnoughData: "Not enough data for heatmap",
        heatmap_error: "Error generating heatmap",
        heatmap_less: "Less",
        heatmap_more: "More",
        heatmap_noData: "No data",
        heatmap_good: "Good",
        heatmap_moderate: "Moderate",
        heatmap_poor: "Poor",
        heatmap_unhealthy: "Unhealthy",
        heatmap_label: "{{metric}} — {{device}}",

        // History page
        history_storedLocally: "measurements stored locally",
        history_noLogs: "No logs downloaded yet",
        history_deviceFilter: "Device:",
        history_allDevices: "All Devices",

        // Table headers
        table_timestamp: "Timestamp",
        table_temp: "Temp (C)",
        table_humidity: "Humidity (%)",
        table_pm25: "PM2.5",
        table_pm10: "PM10",
        table_co2: "CO2 (ppm)",
        table_pressure: "Pressure (hPa)",
        table_lux: "Lux",
        table_battery: "Battery",
        table_type: "Type",
        table_serial: "Serial",
        table_syncedOn: "Synced On",

        // Log types
        logType_gps: "GPS",
        logType_tsl: "TSL",
        logType_co2: "CO2",

        // Connect section
        connect_hint_electron: "Plug in your Octanis sensor via USB to connect automatically.",
        connect_gettingStarted: "Getting Started",
        connect_step1: "Connect your Octanis Sensor via USB",
        connect_step2: "Click the \"Connect Device\" button above",
        connect_step3: "Select your device from the browser dialog",
        connect_step4: "View live sensor data and download historical logs",
        connect_note: "This interface requires Chrome or Edge browser with WebUSB support.",
        connect_step2_electron: "The app will detect and connect automatically",
        connect_step3_electron: "View live sensor data and download historical logs",

        // Browser warning
        warning_webusb: "WebUSB is not supported in your browser. Please use Chrome or Edge.",

        // Low battery warning
        warning_lowBattery: "Low Battery:",
        warning_lowBatteryMsg: "Please charge the device for 30 minutes before data transfer will work properly.",

        // Settings modal
        settings_title: "Device Settings",
        settings_eraseWarning: "Erasing device memory is permanent and cannot be undone.",
        settings_eraseButton: "Erase Device Memory",
        settings_eraseNote: "This will delete all measurements stored on the device. Your downloaded data in the browser will not be affected.",
        settings_erasing: "Erasing...",
        settings_datasheets: "Sensor Datasheets",
        settings_datasheet_sht3x: "SHT3x - Temperature & Humidity",
        settings_datasheet_sps30: "SPS30 - Particulate Matter (PM2.5, PM10)",
        settings_datasheet_tsl2591: "TSL2591 - Light Sensor (Lux)",
        settings_thresholds: "Event Detection Thresholds",
        settings_thresholdsNote: "Values that trigger events in the timeline (based on WHO/EPA guidelines)",
        settings_thresholdsFooter: "Yellow events require 5+ min duration. Anomaly spikes (z-score) also detected.",
        settings_metric: "Metric",

        // Edit device modal
        editDevice_title: "Edit Device",
        editDevice_name: "Name",
        editDevice_namePlaceholder: "e.g., Kitchen Sensor",
        editDevice_tags: "Tags",
        editDevice_tagsPlaceholder: "e.g., kitchen, indoor",
        editDevice_tagsHint: "Separate tags with commas",

        // Location & Building
        location_building_title: "Building Information",
        location_address: "Address",
        location_identification: "Identification",
        location_name: "Building Name",
        location_name_placeholder: "e.g., Schulhaus Muster",
        location_street_placeholder: "Street address",
        location_postal_placeholder: "Postal code",
        location_city_placeholder: "City",
        location_canton_placeholder: "Canton (e.g., ZH)",
        location_egid_placeholder: "Swiss Building ID (EGID)",
        location_gps_placeholder: "e.g., 47.3769, 8.5417",
        location_building_category: "Building Category",
        location_construction: "Construction",
        location_year_placeholder: "Year built",
        location_renovation_placeholder: "Last renovation",
        location_renovated: "renovated",
        location_foundation: "Foundation",
        location_ventilation: "Ventilation",
        location_ventilation_details_placeholder: "Operating schedule, air exchange rate",
        location_hillside: "Hillside location",
        location_add_building: "Add Building",
        location_unnamed: "Unnamed Building",
        location_delete_confirm: "Delete this building and all its rooms?",

        // Building categories
        building_single_family: "Single-family home",
        building_multi_family: "Multi-family building",
        building_mixed_use: "Mixed-use building",
        building_school: "School / Kindergarten",
        building_office: "Office / Commercial",
        building_other: "Other",

        // Foundation types
        foundation_concrete: "Concrete",
        foundation_continuous: "Continuous base plate",
        foundation_natural: "Natural soil / earth floor",
        foundation_strip: "Strip foundation",
        foundation_mixed: "Mixed",
        foundation_unknown: "Unknown",

        // Basement types
        basement_full: "Full basement",
        basement_partial: "Partial basement",
        basement_none: "No basement (slab on grade)",

        // Ventilation types
        ventilation_natural: "Natural ventilation only",
        ventilation_mechanical: "Mechanical ventilation (controlled)",
        ventilation_mixed: "Mixed system",

        // Room
        room_add_title: "Add Room",
        room_edit_title: "Edit Room",
        room_name: "Room Name",
        room_name_placeholder: "e.g., Living Room",
        room_floor: "Floor",
        room_floor_placeholder: "e.g., EG, 1. OG, UG",
        room_type: "Room Type",
        room_area: "Area (m²)",
        room_ceiling_height: "Ceiling Height",
        room_sensor_height: "Sensor Height",
        room_ceiling_abbr: "Ceiling",
        room_sensor_abbr: "Sensor",
        room_device: "Device Used",
        room_regular_occupancy: "Regular occupancy (several hours/day)",
        room_occupancy_short: "Occupied",
        room_notes: "Notes (optional)",
        room_no_device: "No device assigned",
        room_none_added: "No rooms added yet",
        room_unnamed: "Unnamed Room",
        room_occupied: "regularly occupied",
        room_delete_confirm: "Delete this room?",

        // Room environmental factors
        room_environmental_factors: "Environmental Factors",
        room_ventilation: "Room Ventilation",
        room_vent_windows_mechanical: "Windows + mechanical",
        room_vent_windows_only: "Windows only",
        room_vent_mechanical_only: "Mechanical only",
        room_vent_none: "None",
        room_smoking_policy: "Smoking Policy",
        room_smoking_none: "No smoking",
        room_smoking_allowed: "Smoking allowed",
        room_smoking_nearby: "Smoking area nearby",
        room_smoking_distance: "Distance to Smoking Area",
        room_distance_lt5: "< 5 m",
        room_distance_5to15: "5-15 m",
        room_distance_15to50: "15-50 m",
        room_distance_gt50: "> 50 m",
        room_known_issues: "Known Issues",
        room_issue_mold: "Known mold/moisture damage",
        room_issue_renovation: "Recent renovation (< 6 months)",
        room_issue_kitchen: "Adjacent to kitchen/cooking area",
        room_issue_printer: "Printer/copier present",
        room_issue_street: "Street-facing window (traffic exposure)",
        room_occupancy: "Typical Occupancy",
        room_occupancy_1to2: "1-2 persons",
        room_occupancy_3to5: "3-5 persons",
        room_occupancy_6to10: "6-10 persons",
        room_occupancy_10plus: "10+ persons",
        room_occupancy_unoccupied: "Unoccupied",

        // Room types
        room_living_room: "Living Room",
        room_bedroom: "Bedroom",
        room_children_room: "Children's Room",
        room_office: "Office",
        room_kitchen: "Kitchen",
        room_basement_room: "Basement Room",
        room_classroom: "Classroom",
        room_other: "Other",

        // Report location/rooms
        report_location_rooms: "Location & Rooms",
        report_rooms: "Rooms",
        report_building_info: "Building Information",
        report_measurement_locations: "Measurement Locations",

        // Actions
        action_delete: "Delete",
        action_edit: "Edit",

        // Report page - Provider section
        report_provider: "Report Provider",
        report_logo: "Company Logo",
        report_upload_logo: "Upload logo",
        report_remove_logo: "Remove",
        report_logo_hint: "PNG or JPG, max 500KB",
        report_logo_invalid_type: "Please upload an image file (PNG or JPG)",
        report_logo_too_large: "Logo file is too large (max 500KB)",
        report_organization: "Organization",
        report_author: "Author",
        report_author_placeholder: "Name of report author",
        report_contact: "Contact",
        report_contact_placeholder: "Email or phone",
        report_generated_on: "Report generated",
        report_period: "Period",

        // Report page
        report_title: "Report Title",
        report_dataSources: "Data Sources",
        report_loadingDevices: "Loading devices...",
        report_noDevicesWithData: "No devices with data found",
        report_measurementPeriod: "Measurement Period",
        report_to: "to",
        report_computedStats: "Computed Statistics",
        report_selectDevice: "Select devices and date range to compute",
        report_selectAtLeastOne: "Select at least one device",
        report_noDataInRange: "No data in selected range",
        report_eventStats: "Event Statistics",
        report_eventStatsHint: "Computed from selected data",
        report_noData: "No data",
        report_eventsDetected_one: "{{count}} event detected",
        report_eventsDetected_other: "{{count}} events detected",
        report_noThresholdViolations: "No threshold violations",
        report_gi2Compliance: "GI 2.0 Compliance",
        report_gi2Auto: "Auto-compute from data",
        report_gi2OverridePass: "Override: Compliant",
        report_gi2OverrideWarning: "Override: Warning",
        report_gi2OverrideFail: "Override: Not Compliant",
        report_gi2Pass: "Compliant",
        report_gi2Warning: "Warning",
        report_gi2Fail: "Not Compliant",
        report_gi2Unknown: "Unknown",
        report_findings: "Findings (JSON)",
        report_recommendations: "Recommendations (JSON)",
        report_previewTitle: "A4 Report Preview",
        report_configureHint: "Configure report settings to see preview",
        report_generating: "Generating...",
        report_generated: "PDF Generated!",
        report_noPreview: "No preview content to export",
        report_measurements_one: "{{count}} measurement",
        report_measurements_other: "{{count}} measurements",
        report_co2Average: "CO2 Average",
        report_co2Peak: "CO2 Peak",
        report_pm25Average: "PM2.5 Average",
        report_tempAverage: "Temperature Avg",
        report_yellow: "Yellow",
        report_orange: "Orange",
        report_red: "Red",

        // Report - Per-room stats table
        report_measurement_results: "Measurement Results",
        report_summary_table: "Summary Table",
        report_reference_values: "Reference Values",
        report_sensor_id: "Sensor ID",
        report_duration: "Duration",
        report_days: "days",
        report_day: "day",
        report_co2_avg: "CO2 Avg",
        report_co2_max: "CO2 Max",
        report_pm25_avg: "PM2.5 Avg",
        report_status: "Status",
        report_status_ok: "OK",
        report_status_warning: "Warning",
        report_status_elevated: "Elevated",
        report_no_data: "No data",
        report_parameter: "Parameter",
        report_acceptable: "Acceptable",
        report_standard: "Standard",
        report_assessment: "Assessment",
        report_units_note: "CO2 in ppm, PM2.5/PM10 in µg/m³",
        report_air_quality_params: "Air quality parameters",
        report_comfort_params: "Comfort parameters",
        report_temp_avg: "Temp Ø",
        report_temp_min: "Temp Min",
        report_temp_max: "Temp Max",
        report_humidity_avg: "Humidity Ø",
        report_humidity_min: "Hum. Min",
        report_humidity_max: "Hum. Max",
        report_lux_avg: "Light Ø",
        report_n_measurements: "n",
        report_action_required: "Action Required",
        report_assessment_criteria_note: "Assessment is based on average values compared to these thresholds:",
        report_assessment_applies_to_avg: "Color coding in measurement table: values exceeding thresholds shown in yellow (warning) or red (action required)",
        report_comfort_units_note: "Temperature in °C, Humidity in %, Light in lux",

        // Report - Event statistics
        report_event_statistics: "Event Statistics",
        report_events_by_metric: "Threshold violations by parameter",
        report_events_by_severity: "By severity level",
        report_events_count: "Events",
        report_total_duration: "Total Duration",
        report_severity: "Severity",
        report_severity_moderate: "Moderate",
        report_severity_unhealthy: "Unhealthy",
        report_severity_critical: "Critical",
        report_threshold_violations: "Threshold violations by room and parameter",
        report_peak_value: "Peak",
        report_peak_avg: "Peak Ø",
        report_peak_max: "Peak Max",
        report_longest_event: "Longest",
        report_cumulative_duration: "Σ Duration",
        report_event_footnote: "Peak Ø = mean peak value across all events. Longest = single longest event. Σ Duration = cumulative time above reference threshold. Flame icon = number of events with correlated PM2.5+PM10 spike (combustion source likely).",

        // Export messages
        export_noLogs: "No logs to export",
        export_success: "Exported {{count}} logs{{filter}} to {{format}}",
        export_failed: "Export failed: {{message}}",

        // Sync messages
        sync_downloadedNew: "Downloaded {{total}} logs ({{format}} format): {{new}} new, {{skipped}} duplicates skipped",
        sync_downloadedAll: "Downloaded and stored {{count}} logs ({{format}} format)",
        sync_noNewLogs: "No new logs to download",
        sync_failed: "Download failed: {{message}}",
        sync_timeFailed: "Failed to sync time: {{message}}",
        sync_refreshFailed: "Failed to refresh: {{message}}",

        // Clear logs
        clear_confirm: "Are you sure you want to clear all logs from browser storage? This cannot be undone.",
        clear_success: "All logs cleared from browser storage",
        clear_failed: "Failed to clear logs: {{message}}",

        // Erase device
        erase_confirm1: "WARNING: This will permanently erase ALL logs from the device!\n\nAre you absolutely sure?",
        erase_confirm2: "This action CANNOT be undone. Erase all device logs?",
        erase_success: "Device logs erased successfully",
        erase_failed: "Failed to erase device logs",

        // Sensor errors
        sensor_readFailed: "Failed to read sensor data: {{message}}",

        // Building photo
        location_building_photo: "Building Photo",
        location_upload_photo: "Upload photo",
        location_photo_hint: "JPG or PNG, max 2 MB",
        location_photo_invalid_type: "Please upload an image file (JPG or PNG)",
        location_photo_too_large: "Photo file is too large (max 2 MB)",

        // Report - Introduction section
        report_intro_title: "Introduction",
        report_intro_default: "This report documents indoor air quality (IAQ) measurements in the above building. Continuous sensor data was collected for key parameters including CO2, fine particulate matter (PM2.5, PM10), temperature, and relative humidity. The results are compared against established reference values to assess whether the indoor environment meets current health and comfort standards.",
        report_intro_legal_title: "Regulatory Framework",
        report_intro_legal_default: "Switzerland has no single comprehensive law governing indoor air quality or pollutant limits in occupied spaces. Assessment relies on recognized standards and guidelines: SIA 382/1 (ventilation and CO2), SIA 180 (thermal comfort and humidity), WHO Air Quality Guidelines (2021, particulate matter), and cantonal building codes that reference \"recognized rules of construction\" (anerkannte Regeln der Baukunde). For workplaces, the Ordinance 3 to the Employment Act (ArGV 3) requires employers to protect workers from harmful physical, chemical, and biological influences. The reference values used in this report are derived from these standards.",

        // Report - Hardcoded string replacements
        report_executive_summary: "Executive Summary",
        report_executive_body_days: "This report documents air quality measurements conducted over {{days}} days",
        report_executive_body_measurements: "with {{total}} total measurements",
        report_executive_pass: "The monitored space meets GI 2.0 indoor air quality standards.",
        report_executive_warning: "Some air quality parameters require attention.",
        report_executive_fail: "Air quality does not meet recommended standards and requires intervention.",
        report_findings_title: "Findings",
        report_recommendations_title: "Recommendations",
        report_gi2_compliance_title: "GI 2.0 Compliance Status",
        report_gi2_manual_override: "Manual override",
        report_no_data_available: "No data available",
        report_no_period: "No period selected",
        report_no_measurement_data: "No measurement data available",

        // AI analysis
        report_aiAnalyzing: "Analyzing...",
        report_aiDone: "Done!",
        report_aiError: "Analysis failed",
        report_aiNoUrl: "No analysis server configured. Set it in Help > Settings.",
        report_llmPrompt: "You are an indoor air quality expert. Analyze the measurement data below and produce three sections in the same language as this prompt:\n\n1. **Summary:** Write 1-2 sentences that extend the existing executive summary (which already states the measurement period, count, and GI 2.0 status). Highlight the most important findings to motivate the reader to read on — e.g. critical threshold violations, notable patterns, or rooms of concern.\n\n2. **Findings (Befunde):** List the key observations from the data. Identify rooms or time periods with elevated CO2, PM2.5, PM10, or unusual temperature/humidity. Note threshold violations, patterns (e.g., daily peaks, weekend differences), and any combustion events. Be specific — cite room names, values, and time ranges.\n\n3. **Recommendations (Empfehlungen):** Provide actionable recommendations to improve indoor air quality based on the findings. Reference Swiss standards (SIA 382/1, SIA 180) and WHO guidelines where appropriate. Suggest ventilation improvements, behavioral changes, or further investigation as needed.\n\nReturn your response in exactly this format:\n\n## Summary\nYour 1-2 sentence summary here.\n\n## Findings\n1. First finding\n2. Second finding\n\n## Recommendations\n1. First recommendation\n2. Second recommendation",

        // Help page
        help_settings: "Settings",
        help_analysisServer: "Report Analysis Server",
        help_analysisServerHint: "Webhook URL for AI-powered report analysis. Leave empty to disable.",

        // History chart
        chart_title: "Time Series",
        chart_range_24h: "Last 24 hours",
        chart_range_7d: "Last 7 days",
        chart_range_30d: "Last 30 days",
        chart_range_all: "All time",
        chart_noData: "Select metrics above to visualize trends",
        chart_noDataAvailable: "No data for selected time range",

        // Footer
        footer_company: "Octanis Instruments GmbH, Switzerland"
    },

    de: {
        // Navigation
        nav_overview: "Übersicht",
        nav_history: "Verlauf",
        nav_report: "Bericht",
        nav_help: "Hilfe",

        // Page titles and subtitles
        page_history_title: "Messverlauf",
        page_history_subtitle: "Gespeicherte Sensordaten durchsuchen und exportieren",
        page_report_title: "Berichtgenerator",
        page_report_subtitle: "Luftqualitätsprüfungen als professionelle PDF-Dokumente exportieren",

        // Device header bar
        device_selectDevice: "Gerät auswählen",
        device_connectNew: "Neues Gerät verbinden",
        device_noDevicesFound: "Keine Geräte gefunden",
        device_online: "Online",
        device_offline: "Offline",
        device_connected: "verbunden",
        device_edit: "Gerät bearbeiten",
        device_settings: "Geräteeinstellungen",
        device_disconnect: "Gerät trennen",

        // Battery & storage
        battery_charging: "(lädt)",
        storage_measurement_one: "{{count}} Messung",
        storage_measurement_other: "{{count}} Messungen",
        storage_memoryFullIn: "Speicher voll in {{time}}",
        storage_memoryFull: "Speicher voll",
        storage_tooltip: "Aufzeichnung alle {{interval}} Min.",
        storage_maxMeasurements: "Max. {{max}} Messungen",
        storage_percentUsed: "{{percent}}% belegt",

        // Actions
        action_connect: "Gerät verbinden",
        action_measureNow: "Jetzt messen",
        action_syncData: "Synchronisieren",
        action_exportCSV: "CSV exportieren",
        action_clear: "Löschen",
        action_save: "Speichern",
        action_cancel: "Abbrechen",
        action_reset: "Zurücksetzen",
        action_generatePDF: "PDF-Bericht erstellen",
        action_aiAnalysis: "KI-Analyse",
        action_addFinding: "+ Befund hinzufügen",
        action_addRecommendation: "+ Empfehlung hinzufügen",

        // Live data section
        live_title: "Live-Sensordaten",
        live_subtitle: "Aktuelle Messwerte des verbundenen Geräts",
        live_sensorData: "Sensordaten",

        // Sensor labels
        sensor_pm25: "PM2.5",
        sensor_pm10: "PM10",
        sensor_temperature: "Temperatur",
        sensor_humidity: "Rel. Luftfeuchtigkeit",
        sensor_co2: "CO2",
        sensor_light: "Licht",
        sensor_pressure: "Druck",
        sensor_gasResistance: "Gaswiderstand",
        sensor_fromLastSync: "(letzte Synchronisierung)",
        sensor_battery: "Batterie",

        // Time strings
        time_fresh: "aktuell",
        time_secondsOld: "{{seconds}}s alt",
        time_minutesOld: "{{minutes}}m alt",
        time_hoursOld: "{{hours}}h alt",
        time_lastSynced: "Zuletzt synchronisiert: {{time}}",
        time_neverSynced: "Nie synchronisiert",

        // Sync progress
        sync_syncing: "Synchronisiere...",
        sync_syncingProgress: "Synchronisiere {{current}}/{{total}}",
        sync_acquiring: "Erfasse...",
        sync_acquiringCountdown: "Erfasse... {{seconds}}s",
        sync_reading: "Lese...",
        sync_refreshed: "Aktualisiert!",

        // Events section
        events_title: "Erkannte Ereignisse",
        events_subtitle: "Luftqualitätsanomalien und Grenzwertüberschreitungen",
        events_filter_24h: "Letzte 24 Stunden",
        events_filter_7d: "Letzte 7 Tage",
        events_filter_30d: "Letzte 30 Tage",
        events_filter_all: "Gesamter Zeitraum",
        events_notEnoughData: "Nicht genügend Daten für Ereigniserkennung",
        events_noEvents: "Keine signifikanten Ereignisse erkannt",
        events_noEventsInPeriod: "Keine Ereignisse im ausgewählten Zeitraum",
        events_errorDetecting: "Fehler bei der Ereigniserkennung",
        events_peak: "Höchstwert {{metric}}",
        events_baseline: "Referenzwert",
        events_threshold_yellow: "gelber Schwellenwert",
        events_threshold_orange: "oranger Schwellenwert",
        events_threshold_red: "roter Schwellenwert",
        events_combustion: "Verbrennung",
        events_combustionTooltip: "PM2.5 und PM10 stiegen gleichzeitig an – deutet auf Verbrennungsquelle hin (Rauchen, Kochen, Abgase)",

        // Heatmap section
        heatmap_title: "Aktivitäts-Heatmap",
        heatmap_subtitle: "Stündliche Durchschnitte (letzte 14 Tage)",
        heatmap_subtitle_dynamic: "Stündliche Durchschnitte (letzte {{days}} Tage)",
        heatmap_notEnoughData: "Nicht genügend Daten für Heatmap",
        heatmap_error: "Fehler beim Erstellen der Heatmap",
        heatmap_less: "Weniger",
        heatmap_more: "Mehr",
        heatmap_noData: "Keine Daten",
        heatmap_good: "Gut",
        heatmap_moderate: "Mässig",
        heatmap_poor: "Erhöht",
        heatmap_unhealthy: "Stark erhöht",
        heatmap_label: "{{metric}} — {{device}}",

        // History page
        history_storedLocally: "Messungen lokal gespeichert",
        history_noLogs: "Noch keine Daten heruntergeladen",
        history_deviceFilter: "Gerät:",
        history_allDevices: "Alle Geräte",

        // Table headers
        table_timestamp: "Zeitstempel",
        table_temp: "Temp. (°C)",
        table_humidity: "Rel. Feuchte (%)",
        table_pm25: "PM2.5",
        table_pm10: "PM10",
        table_co2: "CO2 (ppm)",
        table_pressure: "Druck (hPa)",
        table_lux: "Lux",
        table_battery: "Batterie",
        table_type: "Typ",
        table_serial: "Seriennr.",
        table_syncedOn: "Synchronisiert am",

        // Log types
        logType_gps: "GPS",
        logType_tsl: "TSL",
        logType_co2: "CO2",

        // Connect section
        connect_hint_electron: "Schliessen Sie Ihren Octanis-Sensor via USB an, um automatisch zu verbinden.",
        connect_gettingStarted: "Erste Schritte",
        connect_step1: "Octanis-Sensor via USB anschliessen",
        connect_step2: "Klicken Sie auf \"Gerät verbinden\"",
        connect_step3: "Wählen Sie Ihr Gerät im Browser-Dialog aus",
        connect_step4: "Live-Sensordaten anzeigen und Verlaufsdaten herunterladen",
        connect_note: "Diese Oberfläche erfordert Chrome oder Edge mit WebUSB-Unterstützung.",
        connect_step2_electron: "Die App erkennt und verbindet automatisch",
        connect_step3_electron: "Live-Sensordaten anzeigen und Verlaufsdaten herunterladen",

        // Browser warning
        warning_webusb: "WebUSB wird in Ihrem Browser nicht unterstützt. Bitte verwenden Sie Chrome oder Edge.",

        // Low battery warning
        warning_lowBattery: "Niedriger Batteriestand:",
        warning_lowBatteryMsg: "Bitte laden Sie das Gerät 30 Minuten auf, bevor die Datenübertragung ordnungsgemäss funktioniert.",

        // Settings modal
        settings_title: "Geräteeinstellungen",
        settings_eraseWarning: "Das Löschen des Gerätespeichers ist dauerhaft und kann nicht rückgängig gemacht werden.",
        settings_eraseButton: "Gerätespeicher löschen",
        settings_eraseNote: "Dadurch werden alle auf dem Gerät gespeicherten Messungen gelöscht. Ihre heruntergeladenen Daten im Browser bleiben erhalten.",
        settings_erasing: "Lösche...",
        settings_datasheets: "Sensor-Datenblätter",
        settings_datasheet_sht3x: "SHT3x – Temperatur & Luftfeuchtigkeit",
        settings_datasheet_sps30: "SPS30 – Feinstaub (PM2.5, PM10)",
        settings_datasheet_tsl2591: "TSL2591 – Lichtsensor (Lux)",
        settings_thresholds: "Schwellenwerte für Ereigniserkennung",
        settings_thresholdsNote: "Werte, die Ereignisse in der Zeitleiste auslösen (basierend auf WHO/EPA-Richtlinien)",
        settings_thresholdsFooter: "Gelbe Ereignisse erfordern min. 5 Min. Dauer. Statistische Ausreisser (Z-Score) werden ebenfalls erkannt.",
        settings_metric: "Messwert",

        // Edit device modal
        editDevice_title: "Gerät bearbeiten",
        editDevice_name: "Name",
        editDevice_namePlaceholder: "z.B. Küchen-Sensor",
        editDevice_tags: "Tags",
        editDevice_tagsPlaceholder: "z.B. küche, innenraum",
        editDevice_tagsHint: "Tags mit Kommas trennen",

        // Location & Building
        location_building_title: "Gebäudeinformationen",
        location_address: "Adresse",
        location_identification: "Identifikation",
        location_name: "Gebäudename",
        location_name_placeholder: "z.B. Schulhaus Muster",
        location_street_placeholder: "Strasse",
        location_postal_placeholder: "PLZ",
        location_city_placeholder: "Ort",
        location_canton_placeholder: "Kanton (z.B. ZH)",
        location_egid_placeholder: "Eidg. Gebäudeidentifikator (EGID)",
        location_gps_placeholder: "z.B. 47.3769, 8.5417",
        location_building_category: "Gebäudekategorie",
        location_construction: "Baujahr",
        location_year_placeholder: "Baujahr",
        location_renovation_placeholder: "Letzte Renovation",
        location_renovated: "renoviert",
        location_foundation: "Fundament",
        location_ventilation: "Lüftung",
        location_ventilation_details_placeholder: "Betriebszeiten, Luftwechselrate",
        location_hillside: "Hanglage",
        location_add_building: "Gebäude hinzufügen",
        location_unnamed: "Unbenanntes Gebäude",
        location_delete_confirm: "Dieses Gebäude und alle zugehörigen Räume löschen?",

        // Building categories
        building_single_family: "Einfamilienhaus",
        building_multi_family: "Mehrfamilienhaus",
        building_mixed_use: "Mischnutzung",
        building_school: "Schule / Kindergarten",
        building_office: "Büro / Gewerbe",
        building_other: "Andere",

        // Foundation types
        foundation_concrete: "Beton",
        foundation_continuous: "Bodenplatte durchgehend",
        foundation_natural: "Naturboden / Erdboden",
        foundation_strip: "Streifenfundament",
        foundation_mixed: "Gemischt",
        foundation_unknown: "Unbekannt",

        // Basement types
        basement_full: "Vollunterkellert",
        basement_partial: "Teilunterkellert",
        basement_none: "Nicht unterkellert (Bodenplatte)",

        // Ventilation types
        ventilation_natural: "Natürliche Lüftung",
        ventilation_mechanical: "Mechanische Lüftung (kontrolliert)",
        ventilation_mixed: "Mischsystem",

        // Room
        room_add_title: "Raum hinzufügen",
        room_edit_title: "Raum bearbeiten",
        room_name: "Raumname",
        room_name_placeholder: "z.B. Wohnzimmer",
        room_floor: "Stockwerk",
        room_floor_placeholder: "z.B. EG, 1. OG, UG",
        room_type: "Raumtyp",
        room_area: "Fläche (m²)",
        room_ceiling_height: "Raumhöhe",
        room_sensor_height: "Sensorhöhe",
        room_ceiling_abbr: "Höhe",
        room_sensor_abbr: "Sensor",
        room_device: "Verwendetes Gerät",
        room_regular_occupancy: "Regelmässige Nutzung (mehrere Stunden/Tag)",
        room_occupancy_short: "Genutzt",
        room_notes: "Bemerkungen (optional)",
        room_no_device: "Kein Gerät zugewiesen",
        room_none_added: "Noch keine Räume hinzugefügt",
        room_unnamed: "Unbenannter Raum",
        room_occupied: "regelmässig genutzt",
        room_delete_confirm: "Diesen Raum löschen?",

        // Room environmental factors
        room_environmental_factors: "Umgebungsfaktoren",
        room_ventilation: "Raumlüftung",
        room_vent_windows_mechanical: "Fenster + mechanisch",
        room_vent_windows_only: "Nur Fenster",
        room_vent_mechanical_only: "Nur mechanisch",
        room_vent_none: "Keine",
        room_smoking_policy: "Rauchregelung",
        room_smoking_none: "Rauchverbot",
        room_smoking_allowed: "Rauchen erlaubt",
        room_smoking_nearby: "Raucherbereich in der Nähe",
        room_smoking_distance: "Abstand zum Raucherbereich",
        room_distance_lt5: "< 5 m",
        room_distance_5to15: "5-15 m",
        room_distance_15to50: "15-50 m",
        room_distance_gt50: "> 50 m",
        room_known_issues: "Bekannte Probleme",
        room_issue_mold: "Bekannter Schimmel-/Feuchtigkeitsschaden",
        room_issue_renovation: "Kürzliche Renovation (< 6 Monate)",
        room_issue_kitchen: "Angrenzend an Küche/Kochbereich",
        room_issue_printer: "Drucker/Kopierer vorhanden",
        room_issue_street: "Strassenseitiges Fenster (Verkehrsbelastung)",
        room_occupancy: "Typische Belegung",
        room_occupancy_1to2: "1-2 Personen",
        room_occupancy_3to5: "3-5 Personen",
        room_occupancy_6to10: "6-10 Personen",
        room_occupancy_10plus: "10+ Personen",
        room_occupancy_unoccupied: "Unbesetzt",

        // Room types
        room_living_room: "Wohnzimmer",
        room_bedroom: "Schlafzimmer",
        room_children_room: "Kinderzimmer",
        room_office: "Büro",
        room_kitchen: "Küche",
        room_basement_room: "Kellerraum",
        room_classroom: "Klassenzimmer",
        room_other: "Andere",

        // Report location/rooms
        report_location_rooms: "Standort & Räume",
        report_rooms: "Räume",
        report_building_info: "Gebäudeinformationen",
        report_measurement_locations: "Messstandorte",

        // Actions
        action_delete: "Löschen",
        action_edit: "Bearbeiten",

        // Report page - Provider section
        report_provider: "Berichtsersteller",
        report_logo: "Firmenlogo",
        report_upload_logo: "Logo hochladen",
        report_remove_logo: "Entfernen",
        report_logo_hint: "PNG oder JPG, max. 500KB",
        report_logo_invalid_type: "Bitte eine Bilddatei hochladen (PNG oder JPG)",
        report_logo_too_large: "Logo-Datei ist zu gross (max. 500KB)",
        report_organization: "Firma",
        report_author: "Autor",
        report_author_placeholder: "Name des Berichtsautors",
        report_contact: "Kontakt",
        report_contact_placeholder: "E-Mail oder Telefon",
        report_generated_on: "Bericht erstellt am",
        report_period: "Messzeitraum",

        // Report page
        report_title: "Berichtstitel",
        report_dataSources: "Datenquellen",
        report_loadingDevices: "Geräte werden geladen...",
        report_noDevicesWithData: "Keine Geräte mit Daten gefunden",
        report_measurementPeriod: "Messzeitraum",
        report_to: "bis",
        report_computedStats: "Berechnete Statistiken",
        report_selectDevice: "Geräte und Zeitraum auswählen",
        report_selectAtLeastOne: "Mindestens ein Gerät auswählen",
        report_noDataInRange: "Keine Daten im ausgewählten Zeitraum",
        report_eventStats: "Ereignisstatistiken",
        report_eventStatsHint: "Berechnet aus ausgewählten Daten",
        report_noData: "Keine Daten",
        report_eventsDetected_one: "{{count}} Ereignis erkannt",
        report_eventsDetected_other: "{{count}} Ereignisse erkannt",
        report_noThresholdViolations: "Keine Grenzwertüberschreitungen",
        report_gi2Compliance: "GI 2.0 Konformität",
        report_gi2Auto: "Automatisch aus Daten berechnen",
        report_gi2OverridePass: "Überschreiben: Konform",
        report_gi2OverrideWarning: "Überschreiben: Warnung",
        report_gi2OverrideFail: "Überschreiben: Nicht konform",
        report_gi2Pass: "Konform",
        report_gi2Warning: "Warnung",
        report_gi2Fail: "Nicht konform",
        report_gi2Unknown: "Unbekannt",
        report_findings: "Befunde (JSON)",
        report_recommendations: "Empfehlungen (JSON)",
        report_previewTitle: "A4-Berichtsvorschau",
        report_configureHint: "Berichtseinstellungen konfigurieren für Vorschau",
        report_generating: "Generiere...",
        report_generated: "PDF erstellt!",
        report_noPreview: "Kein Vorschauinhalt zum Exportieren",
        report_measurements_one: "{{count}} Messung",
        report_measurements_other: "{{count}} Messungen",
        report_co2Average: "CO2-Durchschnitt",
        report_co2Peak: "CO2-Höchstwert",
        report_pm25Average: "PM2.5-Durchschnitt",
        report_tempAverage: "Temperatur-Durchschnitt",
        report_yellow: "Gelb",
        report_orange: "Orange",
        report_red: "Rot",

        // Report - Per-room stats table
        report_measurement_results: "Messergebnisse",
        report_summary_table: "Zusammenfassung",
        report_reference_values: "Referenzwerte",
        report_sensor_id: "Sensor-ID",
        report_duration: "Dauer",
        report_days: "Tage",
        report_day: "Tag",
        report_co2_avg: "CO2 Ø",
        report_co2_max: "CO2 Max",
        report_pm25_avg: "PM2.5 Ø",
        report_status: "Status",
        report_status_ok: "OK",
        report_status_warning: "Warnung",
        report_status_elevated: "Erhöht",
        report_no_data: "Keine Daten",
        report_parameter: "Parameter",
        report_acceptable: "Akzeptabel",
        report_standard: "Norm",
        report_assessment: "Bewertung",
        report_units_note: "CO2 in ppm, PM2.5/PM10 in µg/m³",
        report_air_quality_params: "Luftqualitätsparameter",
        report_comfort_params: "Komfortparameter",
        report_temp_avg: "Temp Ø",
        report_temp_min: "Temp Min",
        report_temp_max: "Temp Max",
        report_humidity_avg: "Feuchte Ø",
        report_humidity_min: "Feuchte Min",
        report_humidity_max: "Feuchte Max",
        report_lux_avg: "Licht Ø",
        report_n_measurements: "n",
        report_action_required: "Handlungsbedarf",
        report_assessment_criteria_note: "Bewertung basiert auf Durchschnittswerten im Vergleich zu diesen Grenzwerten:",
        report_assessment_applies_to_avg: "Farbcodierung in Messtabelle: Werte über Grenzwert in gelb (Warnung) oder rot (Handlungsbedarf)",
        report_comfort_units_note: "Temperatur in °C, Feuchtigkeit in %, Licht in Lux",

        // Report - Event statistics
        report_event_statistics: "Ereignisstatistik",
        report_events_by_metric: "Grenzwertüberschreitungen nach Parameter",
        report_events_by_severity: "Nach Schweregrad",
        report_events_count: "Ereignisse",
        report_total_duration: "Gesamtdauer",
        report_severity: "Schweregrad",
        report_severity_moderate: "Mässig",
        report_severity_unhealthy: "Ungesund",
        report_severity_critical: "Kritisch",
        report_threshold_violations: "Grenzwertüberschreitungen nach Raum und Parameter",
        report_peak_value: "Spitze",
        report_peak_avg: "Spitze Ø",
        report_peak_max: "Spitze Max",
        report_longest_event: "Längstes",
        report_cumulative_duration: "Σ Dauer",
        report_event_footnote: "Spitze Ø = Mittelwert der Spitzenwerte aller Ereignisse. Längstes = einzelnes längstes Ereignis. Σ Dauer = kumulative Zeit über Referenzgrenzwert. Flamme = Anzahl Ereignisse mit korreliertem PM2.5+PM10-Anstieg (Verbrennungsquelle wahrscheinlich).",

        // Export messages
        export_noLogs: "Keine Daten zum Exportieren",
        export_success: "{{count}} Datensätze{{filter}} als {{format}} exportiert",
        export_failed: "Export fehlgeschlagen: {{message}}",

        // Sync messages
        sync_downloadedNew: "{{total}} Datensätze heruntergeladen ({{format}}-Format): {{new}} neu, {{skipped}} Duplikate übersprungen",
        sync_downloadedAll: "{{count}} Datensätze heruntergeladen und gespeichert ({{format}}-Format)",
        sync_noNewLogs: "Keine neuen Daten zum Herunterladen",
        sync_failed: "Herunterladen fehlgeschlagen: {{message}}",
        sync_timeFailed: "Zeitsynchronisierung fehlgeschlagen: {{message}}",
        sync_refreshFailed: "Aktualisierung fehlgeschlagen: {{message}}",

        // Clear logs
        clear_confirm: "Möchten Sie wirklich alle Daten aus dem Browserspeicher löschen? Dies kann nicht rückgängig gemacht werden.",
        clear_success: "Alle Daten aus dem Browserspeicher gelöscht",
        clear_failed: "Löschen fehlgeschlagen: {{message}}",

        // Erase device
        erase_confirm1: "WARNUNG: Dadurch werden ALLE Daten auf dem Gerät dauerhaft gelöscht!\n\nSind Sie absolut sicher?",
        erase_confirm2: "Diese Aktion kann NICHT rückgängig gemacht werden. Alle Gerätedaten löschen?",
        erase_success: "Gerätedaten erfolgreich gelöscht",
        erase_failed: "Löschen der Gerätedaten fehlgeschlagen",

        // Sensor errors
        sensor_readFailed: "Sensordaten konnten nicht gelesen werden: {{message}}",

        // Building photo
        location_building_photo: "Gebäudefoto",
        location_upload_photo: "Foto hochladen",
        location_photo_hint: "JPG oder PNG, max. 2 MB",
        location_photo_invalid_type: "Bitte eine Bilddatei hochladen (JPG oder PNG)",
        location_photo_too_large: "Fotodatei ist zu gross (max. 2 MB)",

        // Report - Introduction section
        report_intro_title: "Einleitung",
        report_intro_default: "Dieser Bericht dokumentiert Raumluftqualitätsmessungen im oben genannten Gebäude. Es wurden kontinuierliche Sensordaten für die wichtigsten Parameter erfasst, darunter CO2, Feinstaub (PM2.5, PM10), Temperatur und relative Luftfeuchtigkeit. Die Ergebnisse werden mit anerkannten Referenzwerten verglichen, um zu beurteilen, ob das Innenraumklima den geltenden Gesundheits- und Behaglichkeitsstandards entspricht.",
        report_intro_legal_title: "Regulatorischer Rahmen",
        report_intro_legal_default: "In der Schweiz gibt es keine umfassende gesetzliche Grundlage, die den Bereich Innenraumklima und Schadstoffe in der Innenraumluft einheitlich normiert. Die Bewertung stützt sich auf anerkannte Normen und Richtlinien: SIA 382/1 (Lüftung und CO2), SIA 180 (thermische Behaglichkeit und Feuchtigkeit), WHO-Luftqualitätsrichtlinien (2021, Feinstaub) sowie kantonale Baugesetze, die auf die «anerkannten Regeln der Baukunde» verweisen. Für Arbeitsplätze verlangt die Verordnung 3 zum Arbeitsgesetz (ArGV 3), dass Arbeitnehmende vor schädigenden physikalischen, chemischen und biologischen Einflüssen zu schützen sind. Die in diesem Bericht verwendeten Referenzwerte leiten sich aus diesen Grundlagen ab.",

        // Report - Hardcoded string replacements
        report_executive_summary: "Zusammenfassung",
        report_executive_body_days: "Dieser Bericht dokumentiert Luftqualitätsmessungen über {{days}} Tage",
        report_executive_body_measurements: "mit {{total}} Messungen insgesamt",
        report_executive_pass: "Die überwachten Räume erfüllen die Anforderungen der GI 2.0 an die Innenraumluftqualität.",
        report_executive_warning: "Einige Luftqualitätsparameter erfordern Aufmerksamkeit.",
        report_executive_fail: "Die Luftqualität entspricht nicht den empfohlenen Standards und erfordert Massnahmen.",
        report_findings_title: "Befunde",
        report_recommendations_title: "Empfehlungen",
        report_gi2_compliance_title: "GI 2.0 Konformitätsstatus",
        report_gi2_manual_override: "Manuell überschrieben",
        report_no_data_available: "Keine Daten verfügbar",
        report_no_period: "Kein Zeitraum ausgewählt",
        report_no_measurement_data: "Keine Messdaten verfügbar",

        // AI analysis
        report_aiAnalyzing: "Analyse läuft...",
        report_aiDone: "Fertig!",
        report_aiError: "Analyse fehlgeschlagen",
        report_aiNoUrl: "Kein Analyse-Server konfiguriert. Unter Hilfe > Einstellungen festlegen.",
        report_llmPrompt: "Du bist ein Experte für Innenraumluftqualität. Analysiere die untenstehenden Messdaten und erstelle drei Abschnitte auf Deutsch:\n\n1. **Zusammenfassung:** Schreibe 1-2 Sätze, die die bestehende Zusammenfassung ergänzen (diese enthält bereits Messperiode, Anzahl Messungen und GI 2.0-Status). Hebe die wichtigsten Erkenntnisse hervor, um den Leser zum Weiterlesen zu motivieren — z.B. kritische Grenzwertüberschreitungen, auffällige Muster oder betroffene Räume.\n\n2. **Befunde:** Liste die wichtigsten Beobachtungen aus den Daten auf. Identifiziere Räume oder Zeiträume mit erhöhtem CO2, PM2.5, PM10 oder auffälliger Temperatur/Luftfeuchtigkeit. Nenne Grenzwertüberschreitungen, Muster (z.B. tägliche Spitzen, Unterschiede am Wochenende) und allfällige Verbrennungsereignisse. Sei spezifisch — nenne Raumnamen, Werte und Zeiträume.\n\n3. **Empfehlungen:** Gib umsetzbare Empfehlungen zur Verbesserung der Raumluftqualität basierend auf den Befunden. Verweise wo angebracht auf Schweizer Normen (SIA 382/1, SIA 180) und WHO-Richtlinien. Schlage Verbesserungen der Lüftung, Verhaltensänderungen oder weitere Abklärungen vor.\n\nGib deine Antwort in genau diesem Format zurück:\n\n## Summary\nDeine 1-2 Sätze hier.\n\n## Findings\n1. Erster Befund\n2. Zweiter Befund\n\n## Recommendations\n1. Erste Empfehlung\n2. Zweite Empfehlung",

        // Help page
        help_settings: "Einstellungen",
        help_analysisServer: "Berichtsanalyse-Server",
        help_analysisServerHint: "Webhook-URL für die KI-gestützte Berichtsanalyse. Leer lassen zum Deaktivieren.",

        // History chart
        chart_title: "Zeitreihen",
        chart_range_24h: "Letzte 24 Stunden",
        chart_range_7d: "Letzte 7 Tage",
        chart_range_30d: "Letzte 30 Tage",
        chart_range_all: "Gesamter Zeitraum",
        chart_noData: "Metriken oben auswählen, um Trends anzuzeigen",
        chart_noDataAvailable: "Keine Daten für den Zeitraum verfügbar",

        // Footer
        footer_company: "Octanis Instruments GmbH, Schweiz"
    }
};

/**
 * I18n class for internationalization
 */
class I18n {
    constructor() {
        this.lang = localStorage.getItem('lang') || 'en';
    }

    /**
     * Translate a key with optional interpolation and pluralization
     * @param {string} key - Translation key (flat, e.g., 'nav_overview')
     * @param {Object} params - Parameters for interpolation. Use 'count' for pluralization.
     * @returns {string} Translated string
     */
    t(key, params = {}) {
        // Handle pluralization
        let lookupKey = key;
        if (params.count !== undefined) {
            lookupKey = params.count === 1 ? `${key}_one` : `${key}_other`;
        }

        // Get translation (flat lookup), fallback to English, then key
        const dict = translations[this.lang] || translations.en;
        let text = dict[lookupKey] ?? translations.en[lookupKey];

        if (text === undefined) {
            console.warn(`Missing translation: ${lookupKey}`);
            return key;
        }

        // Interpolate {{vars}}
        return text.replace(/\{\{(\w+)\}\}/g, (_, k) => params[k] ?? '');
    }

    /**
     * Set the current language and reload the page
     * @param {string} lang - Language code ('en' or 'de')
     */
    setLanguage(lang) {
        if (lang === this.lang) return;
        localStorage.setItem('lang', lang);
        location.reload();
    }

    /**
     * Get the current language
     * @returns {string} Current language code
     */
    getLanguage() {
        return this.lang;
    }

    /**
     * Translate all elements with data-i18n attributes on the page
     * Should be called once on page load
     */
    translatePage() {
        // Text content
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = this.t(el.dataset.i18n);
        });

        // Placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            el.placeholder = this.t(el.dataset.i18nPlaceholder);
        });

        // Titles (tooltips)
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            el.title = this.t(el.dataset.i18nTitle);
        });

        // Update HTML lang attribute
        document.documentElement.lang = this.lang;
    }
}

export const i18n = new I18n();
