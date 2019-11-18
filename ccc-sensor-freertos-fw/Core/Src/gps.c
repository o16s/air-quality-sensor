#include "gps.h"
#include "SAM_M8Q.h"

void gps_task(){
    sam_m8q_wait_for_fix();

    while(1){
        sam_m8q_poll();
        osDelay(1000);
    }
}