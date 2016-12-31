#! /usr/bin/env python
#coding=utf-8
from scapy.all import *
from flask import Flask, request, render_template,redirect,make_response,flash,session,g,url_for
from multiprocessing import Process,Value, Manager
import json
import time
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
    pkt_result.value += 1
    s = time.localtime(pkt.time)
    sumry = {'id':pkt_result.value, 'time':'%d : %d : %d'%(s.tm_hour, s.tm_min, s.tm_sec)}
    if IP in pkt:
        sumry['src'] = pkt[IP].src
        sumry['dst'] = pkt[IP].dst
    else:
        sumry['src'] = pkt.src
        sumry['dst'] = pkt.dst
    ta = []
    tmp = pkt
    while tmp.fields != {}:
        t = tmp.__repr__()
        tmp_prot = t[1:t.find(' ')]
        if type(tmp.payload) == scapy.packet.NoPayload:
            if(tmp_prot == 'Padding' or tmp_prot == 'Raw'):
                break
        tmp_d = {'prot':t[1:t.find(' ')], 'length':len(tmp), 'info':[]}
        for i in tmp.fields:
            tmp_d['info'].append({'name':i, 'content':tmp.fields[i]})
        ta.append(tmp_d)
        sumry['prot'] = tmp_prot
        sumry['info'] = tmp.summary()
        tmp = tmp.payload

    pkt_summary.append(sumry)

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
