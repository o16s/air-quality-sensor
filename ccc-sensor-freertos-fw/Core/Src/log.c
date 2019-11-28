#include "log.h"
#include "main.h"
#include "sps30.h"
#include "sensirion_uart.h"
#include "usart.h"
#include "stdio.h"
#include "math.h"
#include "cmsis_os.h"
#include "sht3x.h"
#include "SAM_M8Q.h"
#include "flashLogger.h"
#include "string.h"

#define LOG_ITEM_TYPE 0
#define LOG_MAX_RECORDS 60
#define LOG_ITEM_SIZE sizeof(log_item_t)

uint32_t _endAddr;

log_status_t log_erase(){
  _endAddr = FL_format();

  if(_endAddr > 0){

    return LOG_OK;

  }else{
    return LOG_ERROR;
  }
}

log_status_t log_init(){
  _endAddr = FL_init();
  if(_endAddr > 0){
    return LOG_OK;
  }else{
    return LOG_ERROR;
  }
}

uint32_t log_convertToEpoch(uint8_t hour, uint8_t min, uint8_t sec,
                            uint8_t day, uint8_t month, uint8_t year){

    return LOG_OK;

}

log_status_t log_newRecord(log_item_t * log_item){
  _endAddr += FL_writeMessage(_endAddr, log_item, LOG_ITEM_SIZE, LOG_ITEM_TYPE);
}

uint16_t log_countRecords(){
  uint32_t read_addr = FL_searchStart();
  uint8_t data[LOG_ITEM_SIZE];
  uint8_t type;
  uint8_t length;
  uint8_t i=0;

  uint8_t step = 1;
  while (step > 0){
    step = FL_readMessage(read_addr, &data, &type, &length);
    read_addr += step;
    if(length == LOG_ITEM_SIZE && type == LOG_ITEM_TYPE){
      i++;
    }
  }

  return i;
}


log_status_t log_readNextRecord(log_item_t * log_item){
  static int line = 0;

  int status = log_readRecord(log_item, line);
  
  line = (line + 1) % LOG_MAX_RECORDS;

  return status;
}

log_status_t log_readRecord(log_item_t * log_item, int lineNumber){
  
  uint32_t read_addr = FL_searchStart();
  uint8_t data[LOG_ITEM_SIZE];
  uint8_t type;
  uint8_t length;
  uint8_t i=0;
  
  uint8_t step = 1;
  while (step > 0){
    step = FL_readMessage(read_addr, &data, &type, &length);
    read_addr += step;
    if(length == LOG_ITEM_SIZE && type == LOG_ITEM_TYPE){
      if(i == lineNumber){
        break;
      }else{
        i++;
      }
    }
  }

  memcpy(log_item, &data, LOG_ITEM_SIZE);

  if(length == LOG_ITEM_SIZE && type == LOG_ITEM_TYPE){
    return LOG_OK;
  }else{
    return LOG_ERROR;
  }

}