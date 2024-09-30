#include "../objects/device.h"

class AirConditional : public Device
{
public:
    AirConditional()
    {
        PinMode = D2;
    }
};