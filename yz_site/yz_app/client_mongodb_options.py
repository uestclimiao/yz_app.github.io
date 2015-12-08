#! /usr/bin/env python
# coding=utf-8

from pymongo import *
import bson

# 李苗：登录注册地址管理
def find_client_by_username_password(db, username, password):
    client = db.clients.find_one({'username': username, 'password': password})    # 存在的话，返回一条记录，否则返回NoneType类型的变量，即返回空
    return client

def insert_addr(db, username, addrs_list):
    db.client_addrs.insert({'username': username, 'addrs_list': addrs_list})

def update_addr(db, username, addrs_list):
    db.client_addrs.update({'username': username}, {'$set': {'addrs_list': addrs_list}})

def find_addrs(db, username):
    addrs = db.client_addrs.find_one({'username': username})
    return addrs

def del_addr(db, username, addr_id):
    uid = bson.binary.UUID(addr_id)
    addrs = db.client_addrs.find_one({'username': username})
    addrs_list = addrs['addrs_list']
    temp_list = []
    for addr in addrs_list:
        if not addr['addr_id'] == uid:
            temp_list.append(addr)
    db.client_addrs.update({'username': username}, {'$set': {'addrs_list': temp_list}})
#####################

def find_commodity_by_cbrand(db, cbrand):
    commoditys_list = []

    commoditys = db.commoditys.find({'c_brand': cbrand})
    for commodity in commoditys:
        commoditys_list.append(commodity)
    return commoditys_list

def insert_commodity_to_cart(db, username, c_list, c_num):
    db.carts.insert({'username': username, 'c_list': c_list, 'c_num': c_num})

def update_commodity_to_cart(db, username, c_list, c_num):
    db.carts.update({'username': username}, {'$set': {'c_list': c_list, 'c_num': c_num}})

def find_cart(db, username):
    cart = db.carts.find_one({'username': username})
    return cart

def del_commodity_in_cart(db, username, c_id):
    cart = db.carts.find_one({'username': username})
    c_list = cart['c_list']
    c_num = cart['c_num']
    c_num -= 1
    temp_list = []
    for commodity in c_list:
        if not commodity['commodity_id'] == c_id:
            temp_list.append(commodity)
    db.carts.update({'username': username}, {'$set': {'c_list': temp_list, 'c_num': c_num}})

def add_order(db, o_id, username, time, money, c_list, state ,address):
    db.orders.insert({'o_id': o_id, 'username': username, 'time': time, 'money': money, 'c_list': c_list, 'state': state ,'address':address})

def find_order(db, username):
    order_list = []
    orders = db.orders.find({'username': username})
    for order in orders:
        order_list.append(order)
    return order_list

def update_order_by_id(db, o_id):
    oid = bson.binary.UUID(o_id)

    db.orders.update({'o_id': oid}, {'$set': {'state': '已付款'}})



