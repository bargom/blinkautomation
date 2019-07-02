Automation project for Blink camera systems

How to create token:
---
curl -H "Host: prod.immedia-semi.com" -H "Content-Type: application/json" --data-binary '{ "password" : "xyz", "client_specifier" : "iPhone 9.2 | 2.2 | 222", "email" : "email@gmail.com" }' --compressed https://rest.prde.immedia-semi.com/login

RESPONSE:
---
{"authtoken":{"authtoken":"xyz","message":"auth"},"networks":{"111":{"name":"Blink-cam","onboarded":true},"222":{"name":"Garden","onboarded":true}},"region":{"prde":"Europe"}}

Payload:
---
{
    token: "xyz",
    network: "Blink-cam",
    camera: "Garage",
    email: "targetemail@gmail.com"
}

