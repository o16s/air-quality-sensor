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
unsigned char rx_byte = '\0';
int line_valid = 0;
int rx_index = 0;

void sam_m8q_uart_rx_callback(){
    //source: https://community.st.com/s/feed/0D50X00009XkVxKSAV
    if (USART3->ISR & USART_ISR_ORE) // Overrun Error
        USART3->ICR = USART_ICR_ORECF;
    if (USART3->ISR & USART_ISR_NE) // Noise Error
        USART3->ICR = USART_ICR_NCF;
    if (USART3->ISR & USART_ISR_FE) // Framing Error
        USART3->ICR = USART_ICR_FECF;
    
    if(USART3->ISR & USART_ISR_RXNE){
        rx_byte = (char)(USART3->RDR & 0xFF);
        sam_m8q_rx_buffer[rx_index] = rx_byte;

        if(rx_byte == SAM_M8Q_LINE_DELIMITER || rx_index >= 199){
            rx_index=0;
            rx_byte = '\0';
            line_valid = 1;
        }else{
            line_valid = 0;
            rx_index++;
        }
    }
}

sam_m8q_status sam_m8q_poll(){
   
    return SAM_M8Q_OK;
}