#include <SPI.h>
#include <UIPEthernet.h>
#include <WString.h>
//#include "/home/sean/Projects/curve-tracer/teensySketch/WebServer.h"

byte mac[6] = {0x00,0x00,0x00,0x00,0x00,0x05};
String readString = String(100);
boolean reading = false;
String myStr;

// how the API works.
  //v0 = -12      bottom Volage
  //v1 = 12       top voltage
  //voltage = 0.5      voltage step
  //cStep = 5        current trace
  //relay = 0     relay off (pnp vs npn)
  //testID = 00123  the id of the test

float v0 = 0.0;
float v1 = 0.0;
float voltage = 0.0;
float cStep = 0.0;
bool relay = 0;
long id = 0;

bool enableServer = true;
bool enableApi = true;

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

void htmlInterface(UIPClient client);
void apiInterface(UIPClient client);
void parseTehThings(String str);

int count = 0;

void loop() {
  // listen for incoming clients
  EthernetClient apiClient = api.available();
  EthernetClient client = server.available();

  if (client && enableServer) {
    Serial.println("Client");
    htmlInterface(client);
  }
 
  if (apiClient && enableApi) {
    Serial.println("Api");
    apiInterface(apiClient);
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
  boolean currentLineIsBlank = true;
  myStr = "";
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
    Serial.println(myStr);
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

void parseTehThings(String str) {
  int startIndex = str.indexOf("v0");
 // int endIndex =
}

