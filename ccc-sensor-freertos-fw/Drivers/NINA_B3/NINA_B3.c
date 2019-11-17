/**
  ******************************************************************************
  * File Name          : NINA-B3.c
  * Description        : This file provides the source code for the NINA-B3 Bluetooth module.
  ******************************************************************************
  * @attention
  *
  * <h2><center>&copy; Copyright (c) 2019 Octanis Instruments OÜ
  * All rights reserved.</center></h2>
  *
  ******************************************************************************
*/

#include "usart.h" //CubeMX
#include "stm32f3xx_hal_uart.h" //FreeRTOS
#include "stm32f3xx_hal_gpio.h" //FreeRTOS

#include "cmsis_os.h" //FreeRTOS
#include <string.h>
#include "main.h"
#include "measurement.h"
#include "NINA_B3.h"

#define NINA_LINE_DELIMITER 10 // '\n'
#define NINA_UART_RX_TIMEOUT 5000
#define NINA_UART_TX_TIMEOUT 5000
#define NINA_RX_BUFFER_LEN 100
#define NINA_TX_BUFFER_LEN 100

#define NINA_RX_EXPECT_NO_ANSWER         NULL,NULL

const unsigned char at_attention[] = "AT\r\n";
const unsigned char at_echo_off[] = "ATE0\r\n";
const unsigned char at_set_name[] = "AT+UBTLN=\"CCC-SENSOR-R-BOARD\"\r\n";

const unsigned char at_get_manufacturer[] = "AT+CGMI\r\n";
const unsigned char at_define_service[] = "AT+UBTGSER=181A\r\n";
const unsigned char at_define_temperature[] = "AT+UBTGCHA=2A6E,10,1,1\r\n";
const unsigned char at_update_temperature[] = "AT+UBTGSN=0,32,42\r\n";
const unsigned char at_update_characteristic[] = "AT+UBTGSN=0,";
const unsigned char at_command_return[]= "\r\n";

const unsigned char at_resp_ok[]= "OK";
const unsigned char at_resp_error[]= "ERROR";

const unsigned char bt_conf_characteristic[] = "+UBTGCHA:";

const unsigned char bt_acl_connected[] = "+UUBTACLC";
const unsigned char bt_acl_disconnected[] = "+UUBTACLD";
const unsigned char bt_request_to_write[] = "+UUBTGRW"; /* happens when one clicks "Start listening"
+UUBTGRW:<conn_handle>,<char_ This event occurs when a remote client writes to an attribute over the air. handle>,<value>,<options>
*/


unsigned char test_rx_buffer[1];
unsigned char nina_rx_buffer[NINA_RX_BUFFER_LEN];
unsigned char nina_tx_buffer[NINA_TX_BUFFER_LEN];

static struct nina_b3_state_
{
    int connected;
    nina_response_t resp;
    int manufacturer_confirmed;
} nina_b3_state;

nina_response_t _transmit_AT(const unsigned char * cmd, const char* expected_response, void (*resp_callback)()){
    int tx = 0;

    tx = HAL_UART_Transmit(&huart2, (unsigned char *)cmd, strlen((const char *)cmd), NINA_UART_TX_TIMEOUT);

    if(tx == HAL_OK){   
        nina_b3_state.resp = NINA_RX_WAITING;
        while(nina_b3_state.resp > NINA_RX_OK){
            nina_b3_wait_for_response(expected_response, resp_callback, NINA_UART_RX_TIMEOUT);
        }
    }
    return nina_b3_state.resp;
}

int _receive_AT(unsigned char * rx_buffer, int rx_buffer_len, uint32_t timeout){
    int rx = 0;
    int rx_index = 0;
    unsigned char * rx_ptr = rx_buffer;

    //memset(rx_buffer, '\0', sizeof(char)*rx_buffer_len);
    while(rx_index < NINA_RX_BUFFER_LEN){
        rx = HAL_UART_Receive(&huart2, rx_ptr, 1, timeout);
    
        if (rx == HAL_OK){
            if(*rx_ptr == NINA_LINE_DELIMITER){
                *rx_ptr = '\0';
                break;
            }
            rx_index++;
            rx_ptr++;
        }else{
            break;
        }
    }
    
    if(rx == HAL_OK){
        return rx_index;
    }else{
        return -1;
    }
}

void nina_b3_confirm_manufacturer_string()
{
    nina_b3_state.manufacturer_confirmed = 1;
}

nina_status_t nina_b3_init(){
    _transmit_AT(at_attention, NINA_RX_EXPECT_NO_ANSWER);    
    _transmit_AT(at_echo_off, NINA_RX_EXPECT_NO_ANSWER);    
    _transmit_AT(at_get_manufacturer, (const char *)"\"u-blox\"", &nina_b3_confirm_manufacturer_string);

    if(nina_b3_state.manufacturer_confirmed)
    {
        return NINA_OK;
    }else{
        return NINA_ERROR;
    }
}


nina_status_t nina_b3_ccc_setup(){
    _transmit_AT(at_set_name, NINA_RX_EXPECT_NO_ANSWER);

    _transmit_AT(at_define_service, NINA_RX_EXPECT_NO_ANSWER);    
    
    _transmit_AT(at_define_temperature, NINA_RX_EXPECT_NO_ANSWER);

    return NINA_OK;
}

nina_status_t nina_b3_update_temperature(){
    static int temperature_mili, temperature = 0;
    static int temp_char_handle = 0x32;

    temperature_mili = get_temperature();
    temperature = temperature_mili / 1000;

    unsigned char at_update[NINA_TX_BUFFER_LEN];
    memset(at_update, '\0', sizeof(at_update));

    sprintf(at_update,"%s%02x,%02x\r\n",at_update_characteristic,temp_char_handle, temperature);

    if(nina_b3_state.connected)
    {
        _transmit_AT(at_update, NINA_RX_EXPECT_NO_ANSWER);   
    }

    if(nina_b3_state.resp == NINA_RX_ERROR)
    {
        HAL_GPIO_TogglePin(CAN_LED_GPIO_Port, CAN_LED_Pin);
        osDelay(50);
        HAL_GPIO_TogglePin(CAN_LED_GPIO_Port, CAN_LED_Pin);
        osDelay(50);
        HAL_GPIO_TogglePin(CAN_LED_GPIO_Port, CAN_LED_Pin);
        osDelay(50);
        HAL_GPIO_TogglePin(CAN_LED_GPIO_Port, CAN_LED_Pin);
        osDelay(50);
        HAL_GPIO_TogglePin(CAN_LED_GPIO_Port, CAN_LED_Pin);
        osDelay(50);
        HAL_GPIO_TogglePin(CAN_LED_GPIO_Port, CAN_LED_Pin);
    }
    else if(nina_b3_state.resp == NINA_RX_OK)
    {
        HAL_GPIO_TogglePin(CAN_LED_GPIO_Port, CAN_LED_Pin);
        osDelay(500);
        HAL_GPIO_TogglePin(CAN_LED_GPIO_Port, CAN_LED_Pin);
    }

    return NINA_OK;
} 

void nina_b3_wait_for_connection()
{
    nina_b3_wait_for_response(NINA_RX_EXPECT_NO_ANSWER, HAL_MAX_DELAY);
    // wait for incoming +UUBTACLC:<
}

void nina_b3_wait_for_response(const char* expected_response, void (*resp_callback)(), uint32_t timeout){
    nina_b3_state.resp = NINA_RX_WAITING;
    while(nina_b3_state.resp > NINA_RX_PROCESSED){
        _receive_AT((unsigned char *)&nina_rx_buffer, NINA_RX_BUFFER_LEN, timeout);
        nina_b3_rx_process_response(expected_response, resp_callback);
    }
}

void nina_b3_rx_process_response(const char* expected_response, void (*resp_callback)()){
    if(strlen((const char *)&nina_rx_buffer) > 1)
    {
        if(expected_response &&
            strncmp(expected_response, (const char *)&nina_rx_buffer, sizeof(expected_response)-1) == 0)
        {
            resp_callback();
            nina_b3_state.resp = NINA_RX_EXPECTED;
        }
        else if(strncmp(at_resp_ok, (const char *)&nina_rx_buffer, sizeof(at_resp_ok)-1) == 0)
        {
            nina_b3_state.resp = NINA_RX_OK;
        }
        else if(strncmp(at_resp_error, (const char *)&nina_rx_buffer, sizeof(at_resp_error)-1) == 0)
        {
            nina_b3_state.resp = NINA_RX_ERROR;
        }
        else if(strncmp(bt_acl_connected, (const char *)&nina_rx_buffer, sizeof(bt_acl_connected)-1) == 0)
        {
            nina_b3_state.connected = 1;
            nina_b3_state.resp = NINA_RX_PROCESSED;
        }
        else if(strncmp(bt_acl_disconnected, (const char *)&nina_rx_buffer, sizeof(bt_acl_disconnected)-1) == 0)
        {
            nina_b3_state.connected = 0;
            nina_b3_state.resp = NINA_RX_PROCESSED;
        }
        else
        {
            nina_b3_state.resp = NINA_UNDEFINED;
        }
    }
    else
    {
        nina_b3_state.resp = NINA_RX_NEWLINE;
    }
}

void nina_b3_uart_rx_callback(){
    //HAL_UART_Receive_IT(&huart2,nina_rx_buffer,10);
}


// rn2483_status_t rn2483_sendBytes(const unsigned char * payload, size_t length, int fport, int confirm){
//     char * txBufferPtr = nina_tx_buffer;

//     //clear buffer
//     memset(txBufferPtr, '\0', sizeof(char)*RN2483_TX_BUFFER_LEN);

 
//     if(confirm){
//         //TODO
//     }else{
//         sprintf(txBufferPtr, "mac tx uncnf %i ", fport);
//     }

//     txBufferPtr += strlen(nina_tx_buffer);

//     for (uint8_t i = 0; i < length; ++i) {
//         sprintf(txBufferPtr, "%02X", *payload++);
//         txBufferPtr += 2;
//     }

//     *txBufferPtr++ = 13;
//     *txBufferPtr++ = 10;

//     _transmit_AT(nina_tx_buffer, (unsigned char *)&nina_rx_buffer, RN2483_RX_BUFFER_LEN,2);
    
//     if(strcmp((const char *)&nina_rx_buffer, (const char *)"ok\r\nmac_tx_ok\r\n") == 0){
//         return RN2483_TX_OK;
//     }else{
//         return RN2483_TX_ERROR;
//     }
// }