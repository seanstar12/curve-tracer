#include <ethernet_comp.h>
#include <UIPUdp.h>
#include <UIPServer.h>
#include <UIPEthernet.h>
#include <UIPClient.h>
#include <Dns.h>
#include <Dhcp.h>

#include <SPI.h>
#include <UIPEthernet.h>
#include <WString.h>
//#include "/home/sean/Projects/curve-tracer/teensySketch/WebServer.h"

byte mac[6] = {0x00,0x00,0x00,0x05,0x05,0x05};
String readString = String(100);
boolean reading = false;
String myStr;

bool enableServer = true;
bool enableApi = true;
bool enableDebug = true;

EthernetServer server(80);
EthernetServer api(8080);

char page[] PROGMEM =
  "HTTP/1.1 200  OK\r\n"  
  "Access-Control-Allow-Origin: *\r\n"
  "Expires: Sun, 01 May 2012 01:00:00 GMT\r\n"
  "Content-Type: text/html\r\n"
  "Retry-After: 600\r\n"
  "\r\n"
  "<html>"
    "<head><title>"
      "Curve Tracer Pro Platinum"
    "</title></head>"
    "<body>"
      "<h3>Ohai Guise</h3>"
    "</body>"
  "</html>";

char jsonHeader[] PROGMEM =
  "HTTP/1.1 200 OK\r\n"
  "Content-Type: application/json\r\n"
  "Access-Control-Allow-Origin: *\r\n"
  "Expires: Sun, 01 May 2012 01:00:00 GMT\r\n"
  "\r\n";  

void setup() {
 // Open serial communications and wait for port to open:

  Serial.begin(57600);

  Ethernet.begin(mac);
  api.begin();
  server.begin();
  while (!Serial) { ; };
  
  Serial.print("server is at ");
  Serial.println(Ethernet.localIP());
  enableApi ? Serial.print("api is running on 8080") : Serial.print("API Disabled");

}

void loop() {  
  // listen for incoming clients
  EthernetClient client = server.available();  
  EthernetClient apiClient = api.available();
 
  if (apiClient && enableApi) {
    if (reqCount == 0 ) {
      reqCount ++;
      Serial.println("Api");
      apiInterface(apiClient);
      reqCount = 0;
    }
  }
  else if (client && enableServer) {
    Serial.println("Client");
    htmlInterface(client);
  }

}

void htmlInterface(UIPClient client) {
  Serial.println(count);
  while (client.connected()) {
    if (client.available()) {
      client.print(page);
      client.stop();
      count ++;
      break;
    }
  }
}

void apiInterface(UIPClient client) {
  Serial.println(count);
  int indexes[6] = {};
  myStr = "";
  boolean currentLineIsBlank = true;
  
  while (client.connected()) {
    if (client.available()) {

        char c = client.read();

        if (reading && c == ' ' || c == '\r' || c == '\n') {
          reading = false;
        } else if (c == '?') {
          reading = true; //found the ?, begin reading the info
        }

        if(reading){
          //Serial.print(c);
          if (c!='?') {
            myStr += c;
          }
        }

        if (c == '\n' && currentLineIsBlank)  break;

        if (c == '\n') {
          currentLineIsBlank = true;
        }else if (c != '\r') {
          currentLineIsBlank = false;
        }
      }
    }
    
     getIndexes(indexes, myStr);
     
     if (enableDebug) {
       for(int i=0; i< sizeof(indexes)/sizeof(indexes[0]); i++) {
         Serial.print("index: ");
         Serial.print(i);
         Serial.print(" : ");
         Serial.print(indexes[i]); 
         Serial.print(" : ");
         if (i < 5) {
           Serial.println(myStr.substring(indexes[i] + 1, indexes[i+1]));
         } else {
           Serial.println("End of string"); 
         }
       }
     }
     
     /* Test variables get setup here:
      a = id
      b = voltage
      c = base current
      d = relay1
      e = relay2
     */
     int id = 0;
     float voltage, baseCurrent;
     bool relay1, relay2;
     
     
     for(int i=0; i< sizeof(indexes)/sizeof(indexes[0]); i++) {
       String toConvert = "";
       char convertBuffer[32];
       
       switch (i) {
         case 0:
           id = myStr.substring(indexes[i] + 1, indexes[i+1]).toInt();
           break;
         case 1:
           toConvert = myStr.substring(indexes[i] + 1, indexes[i+1]);
           toConvert.toCharArray(convertBuffer, sizeof(convertBuffer));
           voltage = atof(convertBuffer);
           break;
         case 2:
           toConvert = myStr.substring(indexes[i] + 1, indexes[i+1]);
           toConvert.toCharArray(convertBuffer, sizeof(convertBuffer));
           baseCurrent = atof(convertBuffer)/1000.0;
           break;
         case 3:
           toConvert = myStr.substring(indexes[i] + 1, indexes[i+1]);
           relay1 = toConvert == "1" ? true : false;
           break;
         case 4:
           toConvert = myStr.substring(indexes[i] + 1, indexes[i+1]);
           relay2 = toConvert == "1" ? true : false;         
           break;
         default:
           break;
       }
     }
     Serial.print("ID in int form: ");
     Serial.println(id);
     Serial.print("Voltage in float form: ");
     Serial.println(voltage);
     Serial.print("baseCurrent in float form: ");
     Serial.println(baseCurrent);
     Serial.print("relay1 in bool: ");
     Serial.println(relay1);
     Serial.print("relay2 in bool: ");
     Serial.println(relay2);
     
   // Serial.println(myStr);
      client.print(jsonHeader);
      client.print("{\"id\":");
      client.print(count);
      client.print(", \"voltage\": ");
      client.print( (float(count)) / (float(count) * float(count)));
      client.print("}");
      delay(100); // allow for browser to take our data.
      client.stop();
      count ++;
}

void getIndexes (int* indexes, String myStr) {
  char i = 97; //a  stop after //e (101) finsied symbol = f
  int count = 0;
    while (i < 103) {
      indexes[count] = myStr.indexOf(i);
      i++;
      count++;
    }
}

