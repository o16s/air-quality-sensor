#include "usart.h" //CubeMX
#include "stm32f3xx_hal_uart.h" //FreeRTOS
#include "stm32f3xx_hal_gpio.h" //FreeRTOS

#include "cmsis_os.h" //FreeRTOS
#include <string.h>

#include "NINA_B3.h"

#define NINA_LINE_DELIMITER 10
#define NINA_UART_RX_TIMEOUT 1000
#define NINA_UART_TX_TIMEOUT 1000
#define NINA_RX_BUFFER_LEN 100
#define NINA_TX_BUFFER_LEN 100

const unsigned char at_echo_off[] = "ATE0\r\n";
const unsigned char at_get_manufacturer[] = "AT+CGMI\r\n";
const unsigned char at_define_service[] = "AT+UBTGSER=181A";

unsigned char nina_rx_buffer[NINA_RX_BUFFER_LEN];
unsigned char nina_tx_buffer[NINA_TX_BUFFER_LEN];


int _transmit_AT(const unsigned char * cmd, unsigned char * rx_buffer, int rx_buffer_len, int read_lines){
    int tx = 0;
    int rx = 0;
    int rx_index = 0;
    int lines_index = 0;
    unsigned char * rx_ptr = rx_buffer;

    memset(rx_buffer, '\0', sizeof(char)*rx_buffer_len);

    tx = HAL_UART_Transmit(&huart2, (char *)cmd, strlen((const char *)cmd), NINA_UART_TX_TIMEOUT);

    if(tx == HAL_OK){
        while(lines_index < read_lines){
            rx = HAL_UART_Receive(&huart2, rx_ptr, 1, NINA_UART_RX_TIMEOUT);
      
            if (rx == HAL_OK){
                if(*rx_ptr == NINA_LINE_DELIMITER){
                    lines_index++;
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
    }else{
        return -1;
    }
}

nina_status_t nina_b3_init(){
    
    _transmit_AT(at_echo_off, (unsigned char *)&nina_rx_buffer, NINA_RX_BUFFER_LEN, 3);    
    _transmit_AT(at_get_manufacturer, (unsigned char *)&nina_rx_buffer, NINA_RX_BUFFER_LEN, 3);

    if(strcmp((const char *)&nina_rx_buffer, (const char *)"\r\n\"u-blox\"\r\nOK\r\n") == 0)
    {
        return NINA_OK;
    }else{
        return NINA_ERROR;
    }

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