#! /usr/bin/env python
from scapy.all import *
from flask import Flask, request, render_template,redirect,make_response,flash,session,g,url_for
from multiprocessing import Process,Value
import json
# from json import

app = Flask(__name__)

result = {'IP':0, 'ICMP':0, 'ARP':0, 'TCP':0, 'UDP':0}
pat = [(IP, 'IP'), (ICMP, 'ICMP'), (ARP, 'ARP'), (TCP, 'TCP'), (UDP, 'UDP')]
pkt_result = Value('d', 0)

def arp_monitor_callback(pkt):
    global pkt_result
    for i in range(len(pat)):
        if pat[i][0] in pkt:
            result[pat[i][1]] += 1
            pkt_result.value += 1
    # print pkt_result.value

def p_func():
    sniff(prn=arp_monitor_callback, store=0)

@app.route('/index', methods = ['GET'])
def index():
    # print 1
    return render_template('index.html')


@app.route('/getData', methods = ['GET'])
def getData():
    global pkt_result
    return json.dumps(pkt_result.value)


if __name__ == "__main__":
    p = Process(target = p_func)
    p.start()
    app.run(debug = True, port = 8088, host = '0.0.0.0')
