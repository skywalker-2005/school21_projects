from scapy.all import *
import socket

message = "Dear Steel Cat! This is no attack, it's my humster Pinkie you should track"
ip = IP(dst="127.0.0.1")
tcp = TCP(dport=12345, flags="PA")
pkt = ip/tcp/Raw(load=message)

send(pkt, verbose=0)

print(f"Сообщение отправлено на 127.0.0.1:12345")
print(f"Текст: {message}")