#include "usart.h" //CubeMX
#include "stm32f3xx_hal_uart.h" //FreeRTOS
#include "stm32f3xx_hal_gpio.h" //FreeRTOS
#include "cmsis_os.h" //FreeRTOS
#include <string.h>
#include <math.h>

#include "minmea.h"
#include "SAM_M8Q.h"



#define SAM_M8Q_LINE_DELIMITER 10
#define SAM_M8Q_NMEA_START 36
#define SAM_M8Q_UART_RX_TIMEOUT 500
#define SAM_M8Q_RX_BUFFER_LEN 200

unsigned char sam_m8q_rx_buffer[SAM_M8Q_RX_BUFFER_LEN];
sam_m8q_state_t sam_m8q_state;

int sam_m8q_get_lat(int decimals){
    struct minmea_float lat = sam_m8q_state.minmea_rmc.latitude;
    return ceil(minmea_tocoord(&lat) * pow(10, decimals));
}

int sam_m8q_get_lon(int decimals){
    struct minmea_float lon = sam_m8q_state.minmea_rmc.longitude;
    return ceil(minmea_tocoord(&lon) * pow(10, decimals));
}

uint32_t sam_m8q_get_epoch(){
    struct timespec ts;
    struct minmea_time time = sam_m8q_state.minmea_gga.time;
    struct minmea_date date = sam_m8q_state.minmea_rmc.date;
    
    if(minmea_gettime(&ts, &date, &time) >= 0){
        return ts.tv_sec;
    }else{
        return -1;
    }
}

sam_m8q_status_t sam_m8q_wait_for_fix(){
    //block until GPS fix is valid
    int fix_quality = 0;

    while(fix_quality == 0 || fix_quality > 5){
        if(sam_m8q_poll() < 0){
            return SAM_M8Q_ERROR;
        }

        fix_quality = sam_m8q_state.minmea_gga.fix_quality;
        osDelay(500);
    }
    return SAM_M8Q_OK;
}

sam_m8q_status_t sam_m8q_poll(){
    HAL_StatusTypeDef rx = 0;
    int sentence_id = 0;
    unsigned char nmea_sentence[MINMEA_MAX_LENGTH];
    int j = 0;
    int parsing = 0;
    int rmc_timestamp = sam_m8q_state.rmc_timestamp;
    int gga_timestamp = sam_m8q_state.gga_timestamp;
    
    //block until RMC and GGA sentences have been received and updated
    while(rmc_timestamp == sam_m8q_state.rmc_timestamp || gga_timestamp == sam_m8q_state.gga_timestamp){

        __HAL_UART_CLEAR_OREFLAG(&huart3); //this clears the OVERRUN flag and enables subsequent receives
        rx = HAL_UART_Receive(&huart3, &sam_m8q_rx_buffer,SAM_M8Q_RX_BUFFER_LEN,SAM_M8Q_UART_RX_TIMEOUT);

        if(rx == HAL_OK || rx == HAL_TIMEOUT){
            for (size_t i = 0; i < 199; i++)
            {

                if(!parsing && sam_m8q_rx_buffer[i] == SAM_M8Q_NMEA_START){
                    parsing = 1;
                }
                
                if(parsing){
                    if(j<MINMEA_MAX_LENGTH){
                        nmea_sentence[j++] = sam_m8q_rx_buffer[i];
                    }
                }

                if(sam_m8q_rx_buffer[i] == SAM_M8Q_LINE_DELIMITER){
                    parsing = 0;
                    j = 0;
                    sentence_id = minmea_sentence_id(nmea_sentence, false);

                    if(sentence_id == MINMEA_SENTENCE_RMC){
                        
                        if (minmea_parse_rmc(&sam_m8q_state.minmea_rmc, nmea_sentence)) {
                            sam_m8q_state.rmc_timestamp = HAL_GetTick();
                        }
                    }
                    if(sentence_id == MINMEA_SENTENCE_GGA){
                        if (minmea_parse_gga(&sam_m8q_state.minmea_gga, nmea_sentence)) {
                            sam_m8q_state.gga_timestamp = HAL_GetTick();
                        }
                    }
                }

            
            }

            memset(sam_m8q_rx_buffer, '\0', sizeof(char)*SAM_M8Q_RX_BUFFER_LEN);
            memset(nmea_sentence, '\0', sizeof(char)*MINMEA_MAX_LENGTH);

        }else{
            return SAM_M8Q_ERROR;  
        }
    
    }

    return SAM_M8Q_OK;  


}