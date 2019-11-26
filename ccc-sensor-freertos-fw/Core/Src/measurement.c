#include "measurement.h"
#include "main.h"
#include "sps30.h"
#include "sensirion_uart.h"
#include "usart.h"
#include "stdio.h"
#include "math.h"
#include "cmsis_os.h"
#include "sht3x.h"
#include "SAM_M8Q.h"


int32_t temperature, humidity;
struct sps30_measurement sps30_m;

int get_temperature()
{
  return temperature;
}

int get_humidity()
{
  return humidity;
}

int get_pm25()
{
  return sps30_m.mc_2p5;
}

void measurement_task(){
/* init code for USB_DEVICE */
  uint8_t sps30_auto_clean_days = 4;
  int16_t sps30_ret;

  //turn on SPS30 and take a measurement
  HAL_GPIO_WritePin(LDO_5V_EN_GPIO_Port, LDO_5V_EN_Pin, GPIO_PIN_SET);
  osDelay(2000);
  if (sps30_probe() == 0) {
    osDelay(100);
    //SPS sensor probing succeeded
    sps30_ret = sps30_set_fan_auto_cleaning_interval_days(sps30_auto_clean_days);
    osDelay(100);      
    sps30_ret = sps30_start_measurement();
    osDelay(3000);
  }
  /* USER CODE BEGIN StartDefaultTask */
  /* Infinite loop */
  for(;;)
  {
    if (sps30_probe() == 0) {
      sps30_ret = sps30_read_measurement(&sps30_m);
      osDelay(100);
    }


    //probe SHT31 and take a measurement
    if (sht3x_probe() == STATUS_OK) {
      osDelay(100);
      sht3x_measure_blocking_read(&temperature, &humidity);
    }

    //debug print to usb serial port
    #define DATALINE_MAXLEN 100 
    char dataline[DATALINE_MAXLEN];
    snprintf(dataline, DATALINE_MAXLEN, "%d,%d,%d,%d,%d,%d\r\n", 
            (int)ceil(temperature), 
            (int)ceil(humidity),
            (int)ceil(sps30_m.mc_2p5*1000),
            (int)ceil(sps30_m.mc_10p0*1000),
            (int)ceil(sam_m8q_state.rmc_timestamp),
            (int)ceil(sam_m8q_state.gga_timestamp));
    //CDC_Transmit_FS(dataline, strlen(dataline));
    //HAL_GPIO_TogglePin(CAN_LED_GPIO_Port, CAN_LED_Pin);
    osDelay(15*60000);
  }
}