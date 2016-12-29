#! /usr/bin/env python
#coding=utf-8
from scapy.all import *
from flask import Flask, request, render_template,redirect,make_response,flash,session,g,url_for
from multiprocessing import Process,Value, Manager
import json
# from json import

app = Flask(__name__)


manager = Manager()
pkt_result = manager.Value('d', 0)
pkt_summary = manager.list()
pkt_info = manager.dict()
clear_if = manager.Value('b', False)

def arp_monitor_callback(pkt):
    if clear_if.value or len(pkt_summary) >= 60:
        while len(pkt_summary) != 0:
            pkt_summary.pop()
        pkt_info.clear()
        clear_if.value = False

    print pkt.summary()
    pkt_result.value += 1
    pkt_summary.append({'summary': pkt.summary(), 'id':pkt_result.value})
    tmp = pkt
    ta = []
    while tmp.payload_guess != []:
        for i in tmp.fields:
            ta.append({'name':i, 'content':tmp.fields[i]})
        tmp = tmp.payload
    try:
        pkt_info[pkt_result.value] = ta
    except:
        pass



def p_func():
    sniff(iface='enp0s31f6', prn=arp_monitor_callback, store=0)

@app.route('/index', methods = ['GET'])
def index():
    # print 1
    return render_template('index.html')


@app.route('/getData', methods = ['GET'])
def getData():
    global pkt_info
    tmp = json.dumps({'result':pkt_result.value, 'summary':list(pkt_summary), 'info':dict(pkt_info)})
    while len(pkt_summary) != 0:
        pkt_summary.pop()
    pkt_info.clear()
    clear_if.value = True
    return tmp


@app.route('/test', methods = ['GET'])
def test():
    return render_template('test.html')


if __name__ == "__main__":
    p = Process(target = p_func)
    p.start()
    app.run(debug = True, port = 8088, host = '0.0.0.0')
