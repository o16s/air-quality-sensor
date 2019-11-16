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

typedef enum
{
    SAM_M8Q_ERROR = -2,
    SAM_M8Q_TX_ERROR = -1,
    SAM_M8Q_OK,
    SAM_M8Q_TX_OK,
} sam_m8q_status;

sam_m8q_status sam_m8q_poll();
void sam_m8q_uart_rx_callback();


#endif

/************************ (C) COPYRIGHT Octanis Instruments OÜ *****END OF FILE****/
