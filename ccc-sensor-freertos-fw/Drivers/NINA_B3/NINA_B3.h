/**
  ******************************************************************************
  * File Name          : NINA-B3.h
  * Description        : This file provides an abstraction for the NINA-B3 Bluetooth module.
  ******************************************************************************
  * @attention
  *
  * <h2><center>&copy; Copyright (c) 2019 Octanis Instruments OÜ
  * All rights reserved.</center></h2>
  *
  ******************************************************************************
  */
#ifndef __NINA_B3_H
#define __NINA_B3_H
/**
  * @brief  UART handle Structure definition
  */
typedef struct
{
    int hweui[8];
} nina_params_t;

typedef enum
{
    NINA_ERROR = -2,
    NINA_TX_ERROR = -1,
    NINA_OK,
    NINA_TX_OK,
} nina_status_t;

// extern nina_params_t rn2483;
nina_status_t nina_b3_init();
nina_status_t nina_b3_ccc_setup();
nina_status_t nina_b3_update_temperature();

// to be called from within the UART interrupt service routine
void nina_b3_uart_rx_callback();

// rn2483_status_t rn2483_sendBytes(const unsigned char * payload, size_t length, int fport, int confirm);

#endif

/************************ (C) COPYRIGHT Octanis Instruments OÜ *****END OF FILE****/
