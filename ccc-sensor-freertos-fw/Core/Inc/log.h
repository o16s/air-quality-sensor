#ifndef __LOG
#define __LOG
#include "main.h"

typedef enum
{
    LOG_ERROR = -1,
    LOG_OK
} log_status_t;

typedef struct
{
    int16_t temperature;
    uint16_t humidity;
    uint16_t pm2p5;
    uint16_t pm10p0;
    int16_t lat;
    int16_t lon;
    uint8_t fix;
    uint8_t battery;    
    uint32_t epoch;
} log_item_t;


uint32_t log_convertToEpoch(uint8_t hour, uint8_t min, uint8_t sec,
                            uint8_t day, uint8_t month, uint8_t year);

log_status_t log_newRecord(log_item_t * log_item);

log_status_t log_readRecord(log_item_t * log_item, int lineNumber);

log_status_t log_readNextRecord(log_item_t * log_item);

log_status_t log_init();

log_status_t log_erase();

uint16_t log_countRecords();

#endif
