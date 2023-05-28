#include <SPI.h>
#include <mcp2515.h>

struct can_frame canMsg;
MCP2515 mcp2515(10);

void setup() {
  Serial.begin(115200);
  
  mcp2515.reset();
  mcp2515.setBitrate(CAN_50KBPS, MCP_8MHZ);
  mcp2515.setNormalMode();

  pinMode(8, OUTPUT);
}

void loop() {
  if (mcp2515.readMessage(&canMsg) == MCP2515::ERROR_OK) {
    
    if (canMsg.can_id == 0x3C4) {

      if(canMsg.data[0] == 2 && canMsg.data[1] > 0){

        if(canMsg.data[1] == 1){
          Serial.print("Left");
        }
        if(canMsg.data[1] == 2){
          Serial.print("Right");
        }
        if(canMsg.data[1] == 4){
          Serial.print("Enter");
        }
        if(canMsg.data[1] == 8){
          Serial.print("Home");
        }
        if(canMsg.data[1] == 64){
          Serial.print("Voice");
        }
        if(canMsg.data[1] == 128){
          Serial.print("Phone");
        }
        Serial.println();  
      }

    if(canMsg.data[0] > 2 && canMsg.data[1] == 0){
        if(canMsg.data[0] == 6){
          Serial.print("Menu");
  
        }
        if(canMsg.data[0] == 10){
          Serial.print("Previous track");
        }
        if(canMsg.data[0] == 18){
          Serial.print("Next track");
        }
        if(canMsg.data[0] == 66){
          Serial.print("Volume down");
        }
        if(canMsg.data[0] == 130){
          Serial.print("Volume up");
          digitalWrite(8, HIGH);
          delay(10);
          digitalWrite(8, LOW); 
        }
        Serial.println();  
      }
    
    }      
  }
}