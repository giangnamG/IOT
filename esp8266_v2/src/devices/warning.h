#include "../objects/device.h"

class Warning : public Device
{
public:
    Warning()
    {
        PinMode = D4;
    }
};