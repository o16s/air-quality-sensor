#include "usart.h" //CubeMX
#include "stm32f3xx_hal_uart.h" //FreeRTOS
#include "stm32f3xx_hal_gpio.h" //FreeRTOS
#include "cmsis_os.h" //FreeRTOS
#include <string.h>

#include "SAM_M8Q.h"

#define SAM_M8Q_LINE_DELIMITER 10
#define SAM_M8Q_NMEA_START 36
#define SAM_M8Q_UART_RX_TIMEOUT 10000
#define SAM_M8Q_UART_TX_TIMEOUT 1000
#define SAM_M8Q_RX_BUFFER_LEN 200
#define SAM_M8Q_TX_BUFFER_LEN 100

unsigned char sam_m8q_rx_buffer[SAM_M8Q_RX_BUFFER_LEN];


void sam_m8q_uart_rx_callback(){
    HAL_UART_Receive_IT(&huart3,sam_m8q_rx_buffer,1);
    HAL_GPIO_TogglePin(CAN_LED_GPIO_Port, CAN_LED_Pin);
}


sam_m8q_status sam_m8q_poll(){
    int rx = 0;
    int rx_index = 0;
    int lines_index = 0;
    unsigned char * rx_ptr = sam_m8q_rx_buffer;

    memset(sam_m8q_rx_buffer, '\0', sizeof(char)*SAM_M8Q_RX_BUFFER_LEN);
    HAL_UART_Receive_IT(&huart3, rx_ptr, 1);

    // while(HAL_UART_Receive_IT(&huart3, rx_ptr, 1) == 0){
    //     if(*rx_ptr == SAM_M8Q_NMEA_START){
    //         memset(++rx_ptr, '\0', sizeof(char)*SAM_M8Q_RX_BUFFER_LEN);
    //     } else if(*rx_ptr == SAM_M8Q_LINE_DELIMITER){
    //         HAL_GPIO_TogglePin(CAN_LED_GPIO_Port, CAN_LED_GPIO_Port);
    //         rx_ptr = sam_m8q_rx_buffer;
    //         lines_index++;
    //     } else {
    //         rx_ptr++;
    //     }
    // }
    
        return SAM_M8Q_OK;
}