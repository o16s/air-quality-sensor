#include "flashLogger.h"

uint_fast16_t FL_writeMessage(uint32_t addr, uint8_t* data, size_t length, uint8_t type)
{
    int i;
    int numDD = 0;
    uint8_t localBuffer[256];
    uint16_t tempWord = 0;
    uint32_t _addr = addr;

    if(length > 0 && !data)
        return 0;

    if(_addr < FL_START_ADDRESS)
        return 0;

    _addr = _addr + (_addr & 0x01); // round address to next halfword for start of new message
    while(_addr > FL_END_ADDRESS)
        _addr = _addr - FL_END_ADDRESS + FL_START_ADDRESS;

    HAL_FLASH_Program(FLASH_TYPEPROGRAM_HALFWORD, _addr, 0xEEDD); //Assume big endian (writing 0xDD 0xEE)

    for(i = 0; i < length; i++)
    {
        localBuffer[i + numDD] = data[i];
        if(data[i] == 0xDD)
        {
            numDD++;
            localBuffer[i + numDD] = data[i];
        }
    }

    _addr += 2;
    _addr = _addr > FL_END_ADDRESS ? _addr - FL_END_ADDRESS + FL_START_ADDRESS : _addr;

    HAL_FLASH_Program(FLASH_TYPEPROGRAM_HALFWORD, _addr, ((length + numDD) << 8) + type);

    // Padding as can only write halfword (16 bit)
    if((length + numDD) & 0x01)
    {
        localBuffer[length + numDD] = 0xff;
        numDD += 1;
    }

    for(i = 0; i < length + numDD; i += 2)
    {
        _addr += 2;
        _addr = _addr > FL_END_ADDRESS ? _addr - FL_END_ADDRESS + FL_START_ADDRESS : _addr;
        tempWord = localBuffer[i] + (localBuffer[i + 1] << 8);
        HAL_FLASH_Program(FLASH_TYPEPROGRAM_HALFWORD, _addr, tempWord);
    }

    return _addr - addr + 2;
}


uint_fast16_t FL_readMessage(uint32_t addr, uint8_t* data, uint8_t* type, size_t* length)
{
    uint_fast16_t totalLength = 0;
    int_fast8_t offset = 0;
    size_t _length = 0;
    uint_fast16_t i = 0;

    if(data == NULL)
        return 0;

    if(addr < FL_START_ADDRESS)
        return 0;

    while(addr > FL_END_ADDRESS)
        addr = addr - FL_END_ADDRESS + FL_START_ADDRESS;

    if(addr & 0x01)
    {
        addr--;
        offset = -1;
        if(*(__IO uint16_t*)addr != 0xEEDD)
        {
            addr += 2;
            addr = addr > FL_END_ADDRESS ? addr - FL_END_ADDRESS + FL_START_ADDRESS : addr;
            offset = 1;
            if(*(__IO uint16_t*)addr != 0xEEDD)
                return totalLength;
        }
    }
    else
    {
        if(*(__IO uint16_t*)addr != 0xEEDD)
            return totalLength;
    }

    addr += 2;
    addr = addr > FL_END_ADDRESS ? addr - FL_END_ADDRESS + FL_START_ADDRESS : addr;
    
    totalLength = *(__IO uint8_t*)(addr + 1);
    if(type != NULL)
        *type = *(__IO uint8_t*)(addr);

    addr += 2;
    addr = addr > FL_END_ADDRESS ? addr - FL_END_ADDRESS + FL_START_ADDRESS : addr;

    for(i = 0; i < totalLength; i++)
    {
        data[_length] = *(__IO uint8_t*)(addr);
        if(data[_length] == 0xDD)
        {
            i++;
            addr++;
            addr = addr > FL_END_ADDRESS ? addr - FL_END_ADDRESS + FL_START_ADDRESS : addr;

            if(*(__IO uint8_t*)(addr) != 0xDD)
                return 0;
        }
        _length++;
        addr++;
        addr = addr > FL_END_ADDRESS ? addr - FL_END_ADDRESS + FL_START_ADDRESS : addr;
    }

    if(length != NULL)
        *length = _length;

    return totalLength + 4 + offset;
}

uint32_t FL_format()
{
    FLASH_EraseInitTypeDef eraseType;
    uint32_t error;

    eraseType.TypeErase = FLASH_TYPEERASE_PAGES;
    eraseType.PageAddress = FL_START_ADDRESS;
    eraseType.NbPages = 1 + ((FL_START_ADDRESS - FL_END_ADDRESS) >> 11);
    HAL_FLASHEx_Erase(&eraseType, &error);

    return FL_START_ADDRESS + FL_writeMessage(FL_START_ADDRESS, NULL, 0, 0);
}

uint32_t FL_erase(uint32_t start_addr, uint32_t end_addr)
{
    FLASH_EraseInitTypeDef eraseType;
    uint32_t error;

    if(start_addr < FL_START_ADDRESS || start_addr > FL_END_ADDRESS)
        return 0;
    if(end_addr < FL_START_ADDRESS || end_addr > FL_END_ADDRESS)
        return 0;
    
    start_addr = start_addr & FL_PAGE_MASK;
    end_addr = end_addr & FL_PAGE_MASK;

    eraseType.TypeErase = FLASH_TYPEERASE_PAGES;

    if(start_addr > end_addr)
    {
        eraseType.PageAddress = FL_START_ADDRESS;
        eraseType.NbPages = 1 + ((FL_START_ADDRESS - end_addr) >> 11);
        HAL_FLASHEx_Erase(&eraseType, &error);

        eraseType.PageAddress = start_addr;
        eraseType.NbPages = 1 + (((FL_END_ADDRESS & FL_PAGE_MASK) - start_addr) >> 11);
        HAL_FLASHEx_Erase(&eraseType, &error);
    }
    else
    {
        eraseType.PageAddress = start_addr;
        eraseType.NbPages = 1 + ((end_addr - start_addr) >> 11);
        HAL_FLASHEx_Erase(&eraseType, &error);
    }

    start_addr = end_addr + FL_PAGE_SIZE;

    start_addr = start_addr > FL_END_ADDRESS ? FL_START_ADDRESS : start_addr;

    return start_addr + FL_writeMessage(start_addr, NULL, 0, 0);
}

uint32_t FL_searchStart()
{
    uint32_t addr = FL_START_ADDRESS;
    uint_fast8_t startFound = 0;
    while(!startFound)
    {
        while((*(__IO uint32_t*)addr) != 0x0000EEDD)
        {
            addr += FL_PAGE_SIZE;
            if(addr > FL_END_ADDRESS)
                return 0; //Beginning not found
        }

        // check if not due to doubled DD as byte before in flash should be unwritten
        if(addr == FL_START_ADDRESS)
        {
            if((*(__IO uint8_t*)FL_END_ADDRESS) == 0xFF)
                startFound = 1;
        }
        else
        {
            if((*(__IO uint8_t*)(addr - 1)) == 0xFF)
                startFound = 1;
        }
    }

    return addr;
}

uint32_t FL_searchEnd(uint32_t start_addr)
{
    uint_fast8_t anti_loop = 0;
    uint32_t end_addr = start_addr;

    if(start_addr < FL_START_ADDRESS || start_addr > FL_END_ADDRESS)
        return 0;

    while(*(__IO uint16_t*)end_addr != 0xFFFF)
    {
        end_addr = end_addr + 4 + *(__IO uint8_t*)(end_addr + 3);
        end_addr += end_addr & 0x01;

        if(end_addr > FL_END_ADDRESS)
        {
            end_addr = FL_START_ADDRESS;
            anti_loop = 1;
        }

        if(anti_loop && end_addr > start_addr)
            return 0;
    }
    return end_addr;
}

uint32_t FL_init()
{
    uint32_t start_addr;

    if(HAL_FLASH_Unlock() != HAL_OK)
        return 0;

    __HAL_FLASH_CLEAR_FLAG(FLASH_FLAG_EOP | FLASH_FLAG_PGERR | FLASH_FLAG_WRPERR);

    start_addr = FL_searchStart();
    if(start_addr == 0)
    {
        return FL_format();
    }

    return FL_searchEnd(start_addr);
}