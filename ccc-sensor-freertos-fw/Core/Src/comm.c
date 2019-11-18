#include "comm.h"
#include "main.h"
#include "usart.h"
#include "cmsis_os.h"
#include "NINA_B3.h"

void StartCommTask(){

  nina_b3_init();
  nina_b3_ccc_setup();
  nina_b3_wait_for_connection();

  while(1){
    nina_b3_update_temperature();

    osDelay(5000);
  }
}