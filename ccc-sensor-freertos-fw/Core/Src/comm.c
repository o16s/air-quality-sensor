#include "comm.h"
#include "main.h"
#include "usart.h"
#include "cmsis_os.h"
#include "NINA_B3.h"
#include "measurement.h"

int comm_get_temperature()
{
  static int temperature_mili, temperature, humidity = 0;

  temperature_mili = get_temperature();
  temperature = temperature_mili / 1000;
  return temperature;
}

int comm_get_humidity()
{
  return get_humidity()/1000;
}

int comm_get_pm25()
{
  static int pm25 = 0;
  return pm25++;
}


void comm_ccc_define_characteristics()
{
  nina_b3_add_characteristic("TEM", 0x2A6E, 1, &comm_get_temperature);

  nina_b3_add_characteristic("HUM", 0x2A6F, 1, &comm_get_humidity);

  nina_b3_add_characteristic("PM2", 0x2A7A, 1, &comm_get_pm25);
}

void StartCommTask(){

  comm_ccc_define_characteristics();
  nina_b3_init();
  nina_b3_ccc_setup();
  nina_b3_wait_for_connection();

  while(1){
    nina_b3_update_all_characteristics();

    osDelay(5000);
  }
}