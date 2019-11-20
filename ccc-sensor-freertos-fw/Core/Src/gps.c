#include "gps.h"
#include "SAM_M8Q.h"
#include "cmsis_os.h"


int get_gps_fix(){
    return sam_m8q_state.minmea_gga.fix_quality;
}

void gps_task(){
    sam_m8q_wait_for_fix();

    while(1){
        sam_m8q_poll();
        osDelay(1000);
    }
}