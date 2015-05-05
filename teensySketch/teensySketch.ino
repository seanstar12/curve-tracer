/*
  Example Api request:
  
    GET 10.0.1.23:8080/?a443b-7.32c20d0e1f
  
  yields:
  
    {
      "id":443, 
      "voltage": -7.32, 
      "params" : { 
        "id": 443, 
        "voltage": -7.32, 
        "baseCurrent": 0.20, 
        "relay1": 0, 
        "relay2": 1
       }
     }
     
   params should be disabled in final product.
   
*/
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

byte mac[6] = {0x00,0x00,0x00,0x05,0x05,0x05};
String readString = String(100);
boolean reading = false;
String myStr;

bool enableServer = true;
bool enableApi = true;
bool enableDebug = true;
bool enableParams = true;

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
  //while (!Serial) { ; };
  
  Serial.print("server is at ");
  Serial.println(Ethernet.localIP());
  enableApi ? Serial.println("api is running on 8080") : Serial.println("API Disabled");

}
int count = 0;

void loop() {  
  // listen for incoming clients
  EthernetClient client = server.available();  
  EthernetClient apiClient = api.available();
 
  if (apiClient && enableApi) {
      Serial.print("Api Call: ");
      apiInterface(apiClient);
  }
  else if (client && enableServer) {
    Serial.print("Client Call: ");
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
  
  // Shows indexes of incoming variables from url
  if (enableDebug && false) {
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
  
  // shows numbers after they have been converted from the url
  // and the switch case above
  if (enableDebug && false) {
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
  }
  
  //DO TEST LOGIC HERE.

  // prints out the response.
   client.print(jsonHeader);
   client.print("{\"id\":");
   client.print(id);      
   client.print(", \"voltage\": ");
   client.print( (float(count)) / (float(count) * float(count)));
   if (enableParams) {
     client.print(", \"params\" : { ");
       client.print("\"id\": ");
       client.print(id);
       client.print(", \"voltage\": ");
       client.print(voltage);
       client.print(", \"baseCurrent\": ");
       client.print(baseCurrent);
       client.print(", \"relay1\": ");
       client.print(relay1);
       client.print(", \"relay2\": ");
       client.print(relay2);
       client.print("}");
   }
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

