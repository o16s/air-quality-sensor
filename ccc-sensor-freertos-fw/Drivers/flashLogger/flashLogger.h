#ifndef __flashlogger_H
#define __flashlogger_H
#ifdef __cplusplus
 extern "C" {
#endif

#include "main.h"

#define FL_START_ADDRESS ((uint32_t)0x08030000) /* Log start address: after 192KByte of Flash memory */
#define FL_END_ADDRESS ((uint32_t)0x0803ffff)   /* Log end address: after 256KByte of Flash memory */

#define FL_PAGE_SIZE FLASH_PAGE_SIZE
#define FL_PAGE_MASK (~(FLASH_PAGE_SIZE - 1))

/**
 * @brief Write message to flash starting at addr
 * 
 * @param addr Address of empty flash part
 * @param data buffer of data to be written
 * @param length length of buffer, max 127 uint_8 or 255 ascii
 * @param type message type ID
 * @return uint_fast16_t Amount of written bytes, 0 if error
 */
uint_fast16_t FL_writeMessage(uint32_t addr, uint8_t* data, size_t length, uint8_t type);

/**
 * @brief Read message from flash starting at addr
 * 
 * @param addr address of beginning of message in flash
 * @param data buffer to read into
 * @param type type ID of message
 * @param length length of read message (bytes in buffer)
 * @return uint_fast16_t Amount of bytes read from flash if successful, 0 if error
 */
uint_fast16_t FL_readMessage(uint32_t addr, uint8_t* data, uint8_t* type, size_t* length);

/**
 * @brief Erase all flash pages and write starting sequence to first page
 * 
 * @return uint32_t points to new starting address, 0 if error
 */
uint32_t FL_format();

/**
 * @brief Erase all flash pages in range and write starting sequence to first page after end addr
 * 
 * @return uint32_t points to new starting address, 0 if error
 */
uint32_t FL_erase(uint32_t start_addr, uint32_t end_addr);

/**
 * @brief Search for oldest message
 * 
 * @return uint32_t points to first address, 0 if error
 */
uint32_t FL_searchStart();

/**
 * @brief Search for next free space
 * 
 * @param start_addr address of first message
 * @return uint32_t points to free space
 */
uint32_t FL_searchEnd(uint32_t start_addr);

/**
 * @brief Init flash for logging
 * 
 * Search start, end and reformat if not possible
 * 
 * @return uint32_t points to first free space
 */
uint32_t FL_init();

#ifdef __cplusplus
}
#endif
#endif /*__flashlogger_H */