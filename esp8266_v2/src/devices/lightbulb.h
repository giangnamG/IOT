#include "../objects/device.h"

class LightBulb : public Device
{
public:
    LightBulb()
    {
        PinMode = D3;
    }
};