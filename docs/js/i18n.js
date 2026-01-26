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
        heatmap_notEnoughData: "Not enough data for heatmap",
        heatmap_error: "Error generating heatmap",
        heatmap_less: "Less",
        heatmap_more: "More",
        heatmap_noData: "No data",
        heatmap_good: "Good",
        heatmap_moderate: "Moderate",
        heatmap_poor: "Poor",
        heatmap_unhealthy: "Unhealthy",

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

        // Report page
        report_organization: "Organization",
        report_title: "Report Title",
        report_location: "Location",
        report_locationPlaceholder: "Office A, Building B, Zurich",
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
        report_eventsDetected: "{{count}} events detected",
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
        heatmap_notEnoughData: "Nicht genügend Daten für Heatmap",
        heatmap_error: "Fehler beim Erstellen der Heatmap",
        heatmap_less: "Weniger",
        heatmap_more: "Mehr",
        heatmap_noData: "Keine Daten",
        heatmap_good: "Gut",
        heatmap_moderate: "Mässig",
        heatmap_poor: "Erhöht",
        heatmap_unhealthy: "Stark erhöht",

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

        // Report page
        report_organization: "Organisation",
        report_title: "Berichtstitel",
        report_location: "Standort",
        report_locationPlaceholder: "Büro A, Gebäude B, Zürich",
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
        report_eventsDetected: "{{count}} Ereignisse erkannt",
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
