#include "../objects/device.h"

class Fan : public Device
{
public:
    Fan()
    {
        PinMode = D1;
    };
};