#! /usr/bin/env python
from scapy.all import *
from flask import Flask, request, render_template,redirect,make_response,flash,session,g,url_for
from multiprocessing import Process,Value, Manager
import json
# from json import

app = Flask(__name__)

result = {'IP':0, 'ICMP':0, 'ARP':0, 'TCP':0, 'UDP':0}
pat = [(IP, 'IP'), (ICMP, 'ICMP'), (ARP, 'ARP'), (TCP, 'TCP'), (UDP, 'UDP')]
manager = Manager()
pkt_result = manager.Value('d', 0)
pkt_summary = manager.list()
pkt_info = manager.list()

def arp_monitor_callback(pkt):
    # for i in range(len(pat)):
        # if pat[i][0] in pkt:
        #     result[pat[i][1]] += 1
    pkt_result.value += 1
    pkt_summary.append({'summary': pkt.summary()})
    pkt_info.append({})
    print pkt.summary()

def p_func():
    sniff(prn=arp_monitor_callback, store=0)

@app.route('/index', methods = ['GET'])
def index():
    # print 1
    return render_template('index.html')


@app.route('/getData', methods = ['GET'])
def getData():
    tmp = json.dumps({'result':pkt_result.value, 'summary':list(pkt_summary)})
    print type(tmp)
    while len(pkt_summary) != 0:
        pkt_summary.pop()
    return tmp


@app.route('/test', methods = ['GET'])
def test():
    return render_template('test.html')


if __name__ == "__main__":
    p = Process(target = p_func)
    p.start()
    app.run(debug = True, port = 8088, host = '0.0.0.0')
