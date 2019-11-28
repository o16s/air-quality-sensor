#include "comm.h"
#include "main.h"
#include "usart.h"
#include "cmsis_os.h"
#include "NINA_B3.h"
#include "measurement.h"
#include "gps.h"

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
  return get_pm25();
}

int comm_get_pm10()
{
  static int pm10 = 0;
  return pm10++;
}

int comm_get_gps_fix()
{
  return get_gps_fix();
}

int comm_get_bat_level()
{
  int retval = 0;
  adc_get_battery_voltage(&retval);
  retval = (retval-3300)*100/(4120-3300);
  if(retval<0)
    retval = 0;
  else if(retval>100)
    retval = 100;
  return retval;
}

#define SERVICE_ENVIRONMENTAL         0x181A
#define SERVICE_LOCATION_NAVIGATION   0x1819
#define SERVICE_BATTERY               0x180F

// https://www.bluetooth.com/specifications/gatt/characteristics/
#define CHAR_TEMPERATURE              0x2A6E
#define CHAR_HUMIDITY                 0x2A6F
#define CHAR_ANALOG_OUT               0x2A59
#define CHAR_NETWORK_AVAILABILITY     0x2A3E
#define CHAR_BATTERY_LEVEL            0x2A19

void comm_ccc_define_characteristics()
{
  nina_b3_add_characteristic("TEM", SERVICE_ENVIRONMENTAL, CHAR_TEMPERATURE, 1, &comm_get_temperature);

  nina_b3_add_characteristic("HUM", SERVICE_ENVIRONMENTAL, CHAR_HUMIDITY, 1, &comm_get_humidity);

  nina_b3_add_characteristic("P25", SERVICE_ENVIRONMENTAL, CHAR_ANALOG_OUT, 1, &comm_get_pm25); //Analog Output
  //nina_b3_add_characteristic("P10", 0x181A, 0x2A59, 1, &comm_get_pm10); //Analog Output

  nina_b3_add_characteristic("FIX", SERVICE_LOCATION_NAVIGATION, CHAR_NETWORK_AVAILABILITY, 1, &comm_get_gps_fix); //gps fix quality --> networa availability

  nina_b3_add_characteristic("BAT", SERVICE_BATTERY, CHAR_BATTERY_LEVEL, 1, &comm_get_bat_level);

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