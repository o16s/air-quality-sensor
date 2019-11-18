/**
  ******************************************************************************
  * File Name          : SAM_M8Q.h
  * Description        : This file provides an abstraction for the SAM M8Q GPS module.
  ******************************************************************************
  * @attention
  *
  * <h2><center>&copy; Copyright (c) 2019 Octanis Instruments OÜ
  * All rights reserved.</center></h2>
  *
  ******************************************************************************
  */
#ifndef __SAM_M8Q_H
#define __SAM_M8Q_H

#include "minmea.h"

typedef enum
{
    SAM_M8Q_ERROR = -1,
    SAM_M8Q_OK
} sam_m8q_status_t;

typedef struct
{
  struct minmea_sentence_rmc minmea_rmc;
  struct minmea_sentence_gga minmea_gga;
  int rmc_timestamp;
  int gga_timestamp;
} sam_m8q_state_t;

extern sam_m8q_state_t sam_m8q_state; //never write to this !

sam_m8q_status_t sam_m8q_poll();
sam_m8q_status_t sam_m8q_wait_for_fix();



#endif

/************************ (C) COPYRIGHT Octanis Instruments OÜ *****END OF FILE****/
