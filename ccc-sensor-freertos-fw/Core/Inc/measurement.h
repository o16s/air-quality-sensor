#ifndef __MEASUREMENT
#define __MEASUREMENT


int get_temperature();
int get_humidity();
int get_pm25();
int get_vbat();

void measurement_task();

#endif
