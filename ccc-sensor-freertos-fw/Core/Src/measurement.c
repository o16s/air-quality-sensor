#include "measurement.h"
#include "main.h"
#include "sps30.h"
#include "sensirion_uart.h"
#include "usart.h"
#include "stdio.h"
#include "math.h"
#include "cmsis_os.h"
#include "usbd_cdc_if.h"
#include "SAM_M8Q.h"
#include "sht3x.h"

int32_t temperature, humidity;

int get_temperature()
{
  return temperature;
}

int get_humidity()
{
  return humidity;
}

void measurement_task(){
/* init code for USB_DEVICE */
  uint8_t sps30_auto_clean_days = 4;
  int16_t sps30_ret;
  struct sps30_measurement sps30_m;
  char dataline[10];


    while (sht3x_probe() != STATUS_OK) {
        /* printf("SHT sensor probing failed\n"); */
    }


  while(1){

      /* Measure temperature and relative humidity and store into variables
        * temperature, humidity (each output multiplied by 1000).
        */
      int8_t ret = sht3x_measure_blocking_read(&temperature, &humidity);
      // if (ret == STATUS_OK) {
        
      // }


      sam_m8q_poll();
      osDelay(1000);
  }


  //turn on SPS30
  HAL_GPIO_WritePin(LDO_5V_EN_GPIO_Port, LDO_5V_EN_Pin, GPIO_PIN_SET);
  osDelay(1000);

  while (sps30_probe() != 0) {
      //SPS sensor probing failed
      osDelay(100);
  } 
  sps30_ret = sps30_set_fan_auto_cleaning_interval_days(sps30_auto_clean_days);

  /* USER CODE BEGIN StartDefaultTask */
  /* Infinite loop */
  for(;;)
  {
    sps30_ret = sps30_start_measurement();
    osDelay(3000);
    sps30_ret = sps30_read_measurement(&sps30_m);
    if (sps30_ret < 0) {
      //printf("error reading measurement\n");
    } else { 
      sprintf(dataline,"%d,%d\r\n", (int)ceil(1000*sps30_m.mc_2p5), (int)ceil(1000*sps30_m.mc_10p0));
      CDC_Transmit_FS(dataline, strlen(dataline));
    } 
    sps30_ret = sps30_stop_measurement();

    HAL_GPIO_TogglePin(CAN_LED_GPIO_Port, CAN_LED_Pin);
    osDelay(10000);
  }
}