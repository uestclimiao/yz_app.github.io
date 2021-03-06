#! /usr/bin/env python
# coding=utf-8

from pymongo import *
import bson

# 登录注册地址管理，我的收藏
def find_client_by_username_password(db, username, password):
    client = db.clients.find_one({'username': username, 'password': password})    # 存在的话，返回一条记录，否则返回NoneType类型的变量，即返回空
    return client

def find_client_by_username_email(db, username, email):
    client = db.clients.find_one({'username': username, 'email': email})    
    return client

def update_users_status(db,username):
    user = db.clients.update({'username': username},{'$set':{'status':'true'}})   
    return user

def update_users_pass(db,username,password):
    user = db.clients.update({'username': username},{'$set':{'password':password}})   
    return user

def update_users_paystatus(db,username):
    user = db.clients.update({'username': username},{'$set':{'pay_flag':0}})  
    return user


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

def del_goods(db,c_id):
    cid=bson.binary.UUID(c_id)
    db.goodsave.remove({'c_id':str(cid)})
    print cid

def find_goods(db, username):
    goods = db.goodsave.find({'c_username': username})
    return goods

def save_commodity(db, c_id, c_name, c_description, c_class, c_price,c_username):
    db.goodsave.insert({'c_id': c_id, 'c_name': c_name, 'c_description': c_description, 'c_class': c_class,'c_price': c_price,'c_username':c_username})

##########################################################################################################################

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

def find_orderall(db):
    order_list = []
    orders = db.orders.find()
    for order in orders:
        order_list.append(order)
    return order_list

def del_orders(db,o_id):
    oid=bson.binary.UUID(o_id)
    db.orders.remove({'o_id':oid})

def update_order_by_id(db, o_id):
    oid = bson.binary.UUID(o_id)

    db.orders.update({'o_id': oid}, {'$set': {'state': '已付款'}})

def update_order_payback(db, o_id):
    oid = bson.binary.UUID(o_id)

    db.orders.update({'o_id': oid}, {'$set': {'state': '正在处理中...'}})






