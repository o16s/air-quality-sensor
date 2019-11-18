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

int comm_get_pm10()
{
  static int pm10 = 0;
  return pm10++;
}

int comm_get_gps_fix()
{
  static int pm10 = 0;
  return pm10++;
}

#define SERVICE_ENVIRONMENTAL         0x181A
#define SERVICE_LOCATION_NAVIGATION   0x1819
void comm_ccc_define_characteristics()
{
  nina_b3_add_characteristic("TEM", SERVICE_ENVIRONMENTAL, 0x2A6E, 1, &comm_get_temperature);

  nina_b3_add_characteristic("HUM", SERVICE_ENVIRONMENTAL, 0x2A6F, 1, &comm_get_humidity);

  nina_b3_add_characteristic("P25", SERVICE_ENVIRONMENTAL, 0x2A59, 1, &comm_get_pm25); //Analog Output
  //nina_b3_add_characteristic("P10", 0x181A, 0x2A59, 1, &comm_get_pm10); //Analog Output

  nina_b3_add_characteristic("FIX", SERVICE_LOCATION_NAVIGATION, 0x2A67, 1, &comm_get_gps_fix); //gps fix quality

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