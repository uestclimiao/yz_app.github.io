#! /usr/bin/env python
# coding=utf-8

from django.shortcuts import render
from django.shortcuts import HttpResponse, HttpResponseRedirect
import mongodb_options
import uuid
import client_util_functions
import client_mongodb_options
import time
import p_alipay.alipay
import json

import smtplib
from email import encoders
from email.header import Header
from email.mime.text import MIMEText
from email.utils import parseaddr,formataddr
import base64

db = mongodb_options.mongodb_init()


def index(request):
    classes_list = mongodb_options.find_classes(db)
    brands_list = mongodb_options.find_brands(db)
    brands_list_design = []
    for brand in brands_list:
        if brand['isdesign'] == u'是':
            brands_list_design.append(brand)
    flag = False
    if "login_user" in request.session:
        username = request.session['login_user']
        flag = True
    if flag:
        cart = client_mongodb_options.find_cart(db, username)
        if cart:
            c_num = cart['c_num']
        else:
            c_num = 0
        return render(request, 'client/client_index.html',
                      {'username': username, 'flag': flag, 'c_num': c_num, 'classes_list': classes_list, 'brands_list': brands_list,
                       'brands_list_design': brands_list_design})
    else:
        return render(request, 'client/client_index.html',
                      {'flag': flag, 'classes_list': classes_list, 'brands_list': brands_list,
                       'brands_list_design': brands_list_design})


def brand(request):
    classes_list = mongodb_options.find_classes(db)
    brands_list = mongodb_options.find_brands(db)
    brands_list_design = []
    for brand in brands_list:
        if brand['isdesign'] == u'是':
            brands_list_design.append(brand)
    flag = False
    if "login_user" in request.session:
        username = request.session['login_user']
        flag = True
    if flag:
        cart = client_mongodb_options.find_cart(db, username)
        if cart:
            c_num = cart['c_num']
        else:
            c_num = 0
        return render(request, 'client/client_brand.html',
                      {'username': username, 'flag': flag, 'c_num': c_num, 'classes_list': classes_list, 'brands_list': brands_list,
                       'brands_list_design': brands_list_design})
    else:
        return render(request, 'client/client_brand.html',
                      {'flag': flag, 'classes_list': classes_list, 'brands_list': brands_list,
                       'brands_list_design': brands_list_design})


def design_brand(request):
    classes_list = mongodb_options.find_classes(db)
    brands_list = mongodb_options.find_brands(db)
    brands_list_design = []
    for brand in brands_list:
        if brand['isdesign'] == u'是':
            brands_list_design.append(brand)
    flag = False
    if "login_user" in request.session:
        username = request.session['login_user']
        flag = True
    if flag:
        cart = client_mongodb_options.find_cart(db, username)
        if cart:
            c_num = cart['c_num']
        else:
            c_num = 0
        return render(request, 'client/client_design_brand.html',
                      {'username': username, 'flag': flag, 'c_num': c_num, 'classes_list': classes_list, 'brands_list': brands_list,
                       'brands_list_design': brands_list_design})
    else:
        return render(request, 'client/client_design_brand.html',
                      {'flag': flag, 'classes_list': classes_list, 'brands_list': brands_list,
                       'brands_list_design': brands_list_design})

def constructing(request):
    flag = False
    if "login_user" in request.session:
        username = request.session['login_user']
        flag = True
    if flag:
        cart = client_mongodb_options.find_cart(db, username)
        if cart:
            c_num = cart['c_num']
        else:
            c_num = 0
        return render(request, 'client/client_constructing.html',
                      {'username': username, 'flag': flag, 'c_num': c_num})
    else:
        return render(request, 'client/client_constructing.html',{'flag': flag})

################################################################################################
# 登录注册地址管理
def req_register(request):
    classes_list = mongodb_options.find_classes(db)
    brands_list = mongodb_options.find_brands(db)
    brands_list_design = []
    for brand in brands_list:
        if brand['isdesign'] == u'是':
            brands_list_design.append(brand)
    return render(request, 'client/client_register.html',
                  {'classes_list': classes_list, 'brands_list': brands_list, 'brands_list_design': brands_list_design})


def register(request):
    classes_list = mongodb_options.find_classes(db)
    brands_list = mongodb_options.find_brands(db)
    brands_list_design = []
    for brand in brands_list:
        if brand['isdesign'] == u'是':
            brands_list_design.append(brand)
    client_id = uuid.uuid1()
    email = request.POST['email']
    username = request.POST['username']
    gender = request.POST['gender']
    date = request.POST['date']
    date_list = date.split('-')
    day = date_list[2]
    month = date_list[1]
    year = date_list[0]
    age = str(client_util_functions.get_age(year, month, day))
    phone_num = request.POST['phonenum']
    password = request.POST['paw1']
    user = mongodb_options.find_client_by_username(db, username)
    if not user:
	smtp_to_user(username,email)
        mongodb_options.insert_client(db, client_id, username, password, gender, age, date, email, phone_num,1,'false')
        return render(request, 'client/client_register_success.html',
                      {'classes_list': classes_list, 'brands_list': brands_list,
                       'brands_list_design': brands_list_design,'message':'<script type="text/javascript">alert("恭喜您,注册成功！您的账户处于待激活状态，请到邮箱点击激活链接进行激活！！");</script>'})
    else:
        return render(request, 'client/client_register_error.html',
                      {'classes_list': classes_list, 'brands_list': brands_list,
                       'brands_list_design': brands_list_design})

def _format_addr(s):
    name,addr=parseaddr(s)
    return formataddr((\
            Header(name,'utf-8').encode(),\
            addr.encode('utf-8') if isinstance(addr,unicode) else addr))

def smtp_to_user(u,e):
    from_addr = 'lm_306@163.com'
    password_admin='limiao_2014'

    smtp_server = 'smtp.163.com'
    to_addr=e

    ub=base64.encodestring(u)
    u1=ub.encode('utf-8')
    str2='<p>本邮件由雅峙奢品发送，请点击<a href=\"http://120.24.169.214:8000/client/user_active/?a=%s\">雅峙奢品(http://120.24.169.214:8000/client/user_active/?a=%s)</a>。如果不能跳转，请将链接复制至浏览器地址栏进行访问。谢谢合作！！！</p>' %(u1,u1)
    msg=MIMEText('<html><body><h1>尊敬的用户，您好！</h1>'+str2+'</body></html>','html','utf-8')

    msg['From']=_format_addr(u'雅峙 <%s>' % from_addr)
    msg['To']=_format_addr(u'管理员 <%s>' % to_addr)
    msg['Subject']=Header(u'欢迎注册雅峙奢品','utf-8').encode()

    server = smtplib.SMTP(smtp_server,25)
    server.set_debuglevel(1)
    server.login(from_addr,password_admin)
    server.sendmail(from_addr,[to_addr],msg.as_string())
    server.quit()

    return 1

def smtp_to_user_forgotpass(u,e):
    from_addr = 'lm_306@163.com'
    password_admin='limiao_2014'

    smtp_server = 'smtp.163.com'
    to_addr=e

    ub=base64.encodestring(u)
    u1=ub.encode('utf-8')
    str2='<p>本邮件由雅峙奢品发送，请点击<a href=\"http://120.24.169.214:8000/client/forgotpaw/?a=%s\">雅峙奢品(http://120.24.169.214:8000/client/forgotpaw/?a=%s)</a>。如果不能跳转，请将链接复制至浏览器地址栏进行访问。谢谢合作！！！</p>' %(u1,u1)
    msg=MIMEText('<html><body><h1>尊敬的用户，您好！</h1>'+str2+'</body></html>','html','utf-8')

    msg['From']=_format_addr(u'雅峙 <%s>' % from_addr)
    msg['To']=_format_addr(u'管理员 <%s>' % to_addr)
    msg['Subject']=Header(u'欢迎访问雅峙奢品','utf-8').encode()

    server = smtplib.SMTP(smtp_server,25)
    server.set_debuglevel(1)
    server.login(from_addr,password_admin)
    server.sendmail(from_addr,[to_addr],msg.as_string())
    server.quit()

    return 1

def user_active(request):
    username=request.GET['a']
    ude=base64.decodestring(username)
    client_mongodb_options.update_users_status(db,ude)

    return render(request, 'client/client_login.html',{'message':'<script type="text/javascript">alert("恭喜您激活成功！请登录");</script>'})



def req_login(request):
    classes_list = mongodb_options.find_classes(db)
    brands_list = mongodb_options.find_brands(db)
    brands_list_design = []
    for brand in brands_list:
        if brand['isdesign'] == u'是':
            brands_list_design.append(brand)
    return render(request, 'client/client_login.html',
                  {'classes_list': classes_list, 'brands_list': brands_list, 'brands_list_design': brands_list_design})


def login(request):
    classes_list = mongodb_options.find_classes(db)
    brands_list = mongodb_options.find_brands(db)
    brands_list_design = []
    for brand in brands_list:
        if brand['isdesign'] == u'是':
            brands_list_design.append(brand)
    username = request.POST['username']
    password = request.POST['password']
    client = client_mongodb_options.find_client_by_username_password(db, username, password)
    if client:
	if client['status']=='false':
		 return render(request, 'client/client_login.html',{'message':'<script type="text/javascript">alert("您的账户处于待激活状态，请到邮箱点击激活链接进行激活！！");</script>'})
	else:
        	request.session['login_user'] = username
        	cart = client_mongodb_options.find_cart(db, username)
		if 'c_num' not in request.POST:
			c_num=0
		else:
        		c_num = cart['c_num']
                if client['pay_flag']==0:
        		return render(request, 'client/client_login_success.html',
                      		{'username': username, 'flag': True, 'c_num': c_num, 'classes_list': classes_list, 'brands_list': brands_list,
                       		'brands_list_design': brands_list_design,'message':'<script type="text/javascript">alert("您还有订单未完成付款！！");</script>'})
		else:
			return render(request, 'client/client_login_success.html',
                      		{'username': username, 'flag': True, 'c_num': c_num, 'classes_list': classes_list, 'brands_list': brands_list,
                       		'brands_list_design': brands_list_design})
			
    else:
        return render(request, 'client/client_login_error.html',
                      {'classes_list': classes_list, 'brands_list': brands_list,
                       'brands_list_design': brands_list_design})

def forgotpass(request):
    return render(request,'client/client_forgotpass.html')

def forgotpass_do(request):
    if "email" in request.POST:
	email=request.POST['email']
	username=request.POST['username']
    client = client_mongodb_options.find_client_by_username_email(db, username, email)
    if client:
    	smtp_to_user_forgotpass(username,email)
    	return render(request,'client/client_login.html',{'message':'<script type="text/javascript">alert("雅峙奢品已向您邮箱发送认证邮件，请前往查收！");</script>'})
    else:
	return render(request,'client/client_forgotpass.html',{'message':'<script type="text/javascript">alert("很抱歉，雅峙奢品找不到您的信息！请您重新输入。");</script>'})

def forgotpaw(request):
    username=request.GET['a']
    ude=base64.decodestring(username)
    return render(request,'client/client_forgotpaw.html',{'username':ude})

def forgotpaw_do(request):
    if 'username' in request.POST:
	username=request.POST['username']
        print username
    	password=request.POST['paw1']
    client_mongodb_options.update_users_pass(db,username,password)
    return render(request,'client/client_login.html',{'message':'<script type="text/javascript">alert("恭喜您，修改密码成功！请使用新密码登录雅峙奢品。");</script>'})


def main_options(request):
    classes_list = mongodb_options.find_classes(db)
    brands_list = mongodb_options.find_brands(db)
    brands_list_design = []
    for brand in brands_list:
        if brand['isdesign'] == u'是':
            brands_list_design.append(brand)
    flag = False
    if "login_user" in request.session:
        username = request.session['login_user']
        flag = True
    if flag:
        cart = client_mongodb_options.find_cart(db, username)
        if cart:
            c_num = cart['c_num']
        else:
            c_num = 0
        return render(request, 'client/client_main_options.html',
                      {'username': username, 'flag': flag, 'c_num': c_num, 'classes_list': classes_list, 'brands_list': brands_list,
                       'brands_list_design': brands_list_design})
    else:
        return render(request, 'client/client_main_options.html',
                      {'flag': flag, 'classes_list': classes_list, 'brands_list': brands_list,
                       'brands_list_design': brands_list_design})


def req_address(request):
    classes_list = mongodb_options.find_classes(db)
    brands_list = mongodb_options.find_brands(db)
    brands_list_design = []
    for brand in brands_list:
        if brand['isdesign'] == u'是':
            brands_list_design.append(brand)
    flag = False
    if "login_user" in request.session:
        username = request.session['login_user']
        flag = True
    if flag:
        addrs = client_mongodb_options.find_addrs(db, username)
        if addrs:
            address_list = addrs['addrs_list']
        else:
            address_list = []
        cart = client_mongodb_options.find_cart(db, username)
        if cart:
            c_num = cart['c_num']
        else:
            c_num = 0
        return render(request, 'client/client_address.html',
                      {'username': username, 'flag': flag, 'c_num': c_num, 'classes_list': classes_list, 'brands_list': brands_list,
                       'brands_list_design': brands_list_design, 'address_list': address_list})
    else:
        return render(request, 'client/client_address.html',
                      {'flag': flag, 'classes_list': classes_list, 'brands_list': brands_list,
                       'brands_list_design': brands_list_design})


def add_address(request):
    flag = False
    if "login_user" in request.session:
        username = request.session['login_user']
        flag = True
    if flag:
        province_domain = request.GET.get('provincedomain', '')
        city_domain = request.GET.get('citydomain', '')
        town_domain = request.GET.get('towndomain', '')
        detail_domain = request.GET.get('detail_address', '')
        addr_id = uuid.uuid1()
        addr_dict = {'addr_id': addr_id, 'province_domain': province_domain, 'city_domain': city_domain,
                     'town_domain': town_domain, 'detail_domain': detail_domain}
        addrs = client_mongodb_options.find_addrs(db, username)
        if addrs:
            addrs_list = addrs['addrs_list']
            addrs_list.append(addr_dict)
            client_mongodb_options.update_addr(db, username, addrs_list)
        else:
            addrs_list = []
            addrs_list.append(addr_dict)
            client_mongodb_options.insert_addr(db, username, addrs_list)

        return HttpResponseRedirect('/client/req_address/')
    else:
        classes_list = mongodb_options.find_classes(db)
        brands_list = mongodb_options.find_brands(db)
        brands_list_design = []
        for brand in brands_list:
            if brand['isdesign'] == u'是':
                brands_list_design.append(brand)
        return render(request, 'client/client_index.html',
                      {'flag': flag, 'message': '<script type="text/javascript">alert("您还没登录，无法添加！");</script>',
                       'classes_list': classes_list, 'brands_list': brands_list,
                       'brands_list_design': brands_list_design})


def delete_address(request):
    flag = False
    if "login_user" in request.session:
        username = request.session['login_user']
        flag = True
    if flag:
        del_object = request.POST['del_object']
        del_item_list_str = request.POST['del_item_list']
        del_item_list = del_item_list_str[1:].split(',')  # 获取到的del_item_list_str字符串开头多了1个逗号，所以此时需要分片
        if del_object == 'address':
            for item_id in del_item_list:
                client_mongodb_options.del_addr(db, username, str(item_id))
        return HttpResponseRedirect('/client/req_address/')
    else:
        classes_list = mongodb_options.find_classes(db)
        brands_list = mongodb_options.find_brands(db)
        brands_list_design = []
        for brand in brands_list:
            if brand['isdesign'] == u'是':
                brands_list_design.append(brand)
        return render(request, 'client/client_index.html',
                      {'flag': flag, 'message': '<script type="text/javascript">alert("您还没登录，无法删除！");</script>',
                       'classes_list': classes_list, 'brands_list': brands_list,
                       'brands_list_design': brands_list_design})


#####################

def logout(request):
    if "login_user" in request.session:
        del request.session['login_user']
        return HttpResponseRedirect('/client/')
    else:
        classes_list = mongodb_options.find_classes(db)
        brands_list = mongodb_options.find_brands(db)
        brands_list_design = []
        for brand in brands_list:
            if brand['isdesign'] == u'是':
                brands_list_design.append(brand)
        return render(request, 'client/client_index.html',
                      {'message': '<script type="text/javascript">alert("您还没登录，无法注销！");</script>','classes_list': classes_list, 'brands_list': brands_list,
                       'brands_list_design': brands_list_design})


# -----------品牌详情页面请求--------------#
def brand_detail(request):
    flag = False
    if "login_user" in request.session:
        username = request.session['login_user']
        flag = True
    classes_list = mongodb_options.find_classes(db)
    brands_list = mongodb_options.find_brands(db)
    brands_list_design = []
    for brand in brands_list:
        if brand['isdesign'] == u'是':
            brands_list_design.append(brand)
    # 获取品牌id,品牌名
    brand_id = request.GET['brand_id']
    m_brand = mongodb_options.find_brand_by_bid(db, brand_id)

    brand_name = m_brand['b_name']
    # 获取商品列表
    commodity_list = client_mongodb_options.find_commodity_by_cbrand(db, brand_name)

    if not flag:
        username = ''
        c_num = 0
    else:
        cart = client_mongodb_options.find_cart(db, username)
        if cart:
            c_num = cart['c_num']
        else:
            c_num = 0
    return render(request, 'client/client_brand_detail.html',
                  {'username': username, 'flag': flag, 'c_num': c_num, 'classes_list': classes_list, 'brands_list': brands_list,
                   'brands_list_design': brands_list_design,
                   'brand': m_brand, 'commodity_list': commodity_list})

# -----------商品详情页面请求--------------#
def commodity_detail(request):
    flag = False
    if "login_user" in request.session:
        username = request.session['login_user']
        flag = True
    classes_list = mongodb_options.find_classes(db)
    brands_list = mongodb_options.find_brands(db)
    brands_list_design = []
    for brand in brands_list:
        if brand['isdesign'] == u'是':
            brands_list_design.append(brand)
    # 获取商品id,商品
    commodity_id = request.GET['commodity_id']
    commodity = mongodb_options.find_commodity_by_cid(db, commodity_id)
    # 获取尺寸
    sizes_list = commodity['c_size'].split('/')
    colors_list = commodity['c_style'].split('/')
    if not flag:
        username = ''
        c_num = 0
    else:
        cart = client_mongodb_options.find_cart(db, username)
        if cart:
            c_num = cart['c_num']
        else:
            c_num = 0
    return render(request, 'client/client_commodity_detail.html',
                  {'username': username, 'flag': flag, 'c_num': c_num, 'classes_list': classes_list, 'brands_list': brands_list, 'brands_list_design': brands_list_design,
                   'commodity': commodity, 'sizes_list': sizes_list, 'colors_list': colors_list})

def commodity_save(request):
    #返回原页面
    flag = False
    if "login_user" in request.session:
        username = request.session['login_user']
        flag = True
	com_save_id = request.GET['commodity_id']
        commodity = mongodb_options.find_commodity_by_cid(db, com_save_id)
        com_save_cname=commodity['c_name']
	com_save_cdesp=commodity['c_description']
	com_save_class=commodity['c_class']
	com_save_cprice=commodity['c_price']
	com_save_username=username
	client_mongodb_options.save_commodity(db,com_save_id,com_save_cname,com_save_cdesp,com_save_class, com_save_cprice,com_save_username)
    classes_list = mongodb_options.find_classes(db)
    brands_list = mongodb_options.find_brands(db)
    brands_list_design = []
    for brand in brands_list:
        if brand['isdesign'] == u'是':
            brands_list_design.append(brand)
    # 获取品牌id,品牌名
    brand_id = request.GET['brand_id']
    m_brand = mongodb_options.find_brand_by_bid(db, brand_id)

    brand_name = m_brand['b_name']
    # 获取商品列表
    commodity_list = client_mongodb_options.find_commodity_by_cbrand(db, brand_name)

    if not flag:
        username = ''
        c_num = 0
	return render(request, 'client/client_brand_detail.html',
                  {'username': username, 'flag': flag, 'c_num': c_num, 'classes_list': classes_list, 'brands_list': brands_list,
                   'brands_list_design': brands_list_design,
                   'brand': m_brand, 'commodity_list': commodity_list,'message':'<script type="text/javascript">alert("您还没登录，请先登录雅峙奢品！");</script>'})
    else:
        cart = client_mongodb_options.find_cart(db, username)
        if cart:
            c_num = cart['c_num']
        else:
            c_num = 0
    	return render(request, 'client/client_brand_detail.html',
                  {'username': username, 'flag': flag, 'c_num': c_num, 'classes_list': classes_list, 'brands_list': brands_list,
                   'brands_list_design': brands_list_design,
                   'brand': m_brand, 'commodity_list': commodity_list,'message':'<script type="text/javascript">alert("收藏成功！您可以在我的收藏中查看。");</script>'})


def goods_save(request):
    classes_list = mongodb_options.find_classes(db)
    brands_list = mongodb_options.find_brands(db)
    brands_list_design = []
    for brand in brands_list:
        if brand['isdesign'] == u'是':
            brands_list_design.append(brand)
    flag = False
    if "login_user" in request.session:
        username = request.session['login_user']
        flag = True
    if flag:
        goods = client_mongodb_options.find_goods(db, username)
        
        cart = client_mongodb_options.find_cart(db, username)
        if cart:
            c_num = cart['c_num']
        else:
            c_num = 0
        return render(request, 'client/client_goods_save.html',
                      {'username': username, 'flag': flag, 'c_num': c_num, 'classes_list': classes_list, 'brands_list': brands_list,
                       'brands_list_design': brands_list_design, 'goods_list': goods})
    else:
        return render(request, 'client/client_goods_save.html',
                      {'flag': flag, 'classes_list': classes_list, 'brands_list': brands_list,
                       'brands_list_design': brands_list_design})

def delete_goods(request):
   
    del_object = request.POST['del_object']
    del_item_list_str = request.POST['del_item_list']
    del_item_list = del_item_list_str[1:].split(',')  # 获取到的del_item_list_str字符串开头多了1个逗号，所以此时需要分片
    if del_object == 'goods':
        for item_id in del_item_list:	   
            client_mongodb_options.del_goods(db, str(item_id))	   
    return HttpResponse("删除成功")


# -----------艺术品--------------#
def artwork_index(request):
    flag = False
    if "login_user" in request.session:
        username = request.session['login_user']
        flag = True
    classes_list = mongodb_options.find_classes(db)
    brands_list = mongodb_options.find_brands(db)
    brands_list_design = []
    for brand in brands_list:
        if brand['isdesign'] == u'是':
            brands_list_design.append(brand)
    if not flag:
        username = ''
        c_num = 0
    else:
        cart = client_mongodb_options.find_cart(db, username)
        if cart:
            c_num = cart['c_num']
        else:
            c_num = 0
    return render(request, 'client/client_artwork_index.html',
                  {'username': username, 'flag': flag, 'c_num': c_num, 'classes_list': classes_list, 'brands_list': brands_list, 'brands_list_design': brands_list_design})


def artwork_exhibition(request):
    flag = False
    if "login_user" in request.session:
        username = request.session['login_user']
        flag = True
    classes_list = mongodb_options.find_classes(db)
    brands_list = mongodb_options.find_brands(db)
    brands_list_design = []
    for brand in brands_list:
        if brand['isdesign'] == u'是':
            brands_list_design.append(brand)
    if not flag:
        username = ''
        c_num = 0
    else:
        cart = client_mongodb_options.find_cart(db, username)
        if cart:
            c_num = cart['c_num']
        else:
            c_num = 0
    return render(request, 'client/client_artwork_exhibition.html',
                  {'username': username, 'flag': flag, 'c_num': c_num, 'classes_list': classes_list, 'brands_list': brands_list, 'brands_list_design': brands_list_design})

def add_cart(request):
    flag = False
    if "login_user" in request.session:
        username = request.session['login_user']
        flag = True
    if flag:
        classes_list = mongodb_options.find_classes(db)
        brands_list = mongodb_options.find_brands(db)
        brands_list_design = []
        for brand in brands_list:
            if brand['isdesign'] == u'是':
                brands_list_design.append(brand)
        commodity_id = request.POST['commodity_id']
        color = request.POST['color']
        size = request.POST['size']
        commodity = mongodb_options.find_commodity_by_cid(db, commodity_id)
        commodity_dict = {'commodity_id': commodity_id, 'color': color, 'size': size, 'unit_price': commodity['c_price']}

        cart = client_mongodb_options.find_cart(db, username)
        if cart:
            c_list = cart['c_list']
            c_list.append(commodity_dict)
            c_num = len(c_list)
            client_mongodb_options.update_commodity_to_cart(db, username, c_list, c_num)
        else:
            c_list = []
            c_list.append(commodity_dict)
            c_num = len(c_list)
            client_mongodb_options.insert_commodity_to_cart(db, username, c_list, c_num)

        return render(request, 'client/client_cart_info.html',
                      {'username': username, 'flag': flag, 'c_num': c_num, 'commodity_id': commodity_id, 'classes_list': classes_list, 'brands_list': brands_list, 'brands_list_design': brands_list_design})
    else:
        classes_list = mongodb_options.find_classes(db)
        brands_list = mongodb_options.find_brands(db)
        brands_list_design = []
        for brand in brands_list:
            if brand['isdesign'] == u'是':
                brands_list_design.append(brand)
        return render(request, 'client/client_index.html',
                      {'message': '<script type="text/javascript">alert("您还没登录，无法查看！");</script>', 'flag': flag, 'classes_list': classes_list, 'brands_list': brands_list,
                       'brands_list_design': brands_list_design})

def show_cart(request):
    flag = False
    if "login_user" in request.session:
        username = request.session['login_user']
        flag = True
    classes_list = mongodb_options.find_classes(db)
    brands_list = mongodb_options.find_brands(db)
    brands_list_design = []
    for brand in brands_list:
        if brand['isdesign'] == u'是':
            brands_list_design.append(brand)
    if not flag:
        c_num = 0
        return render(request, 'client/client_index.html',
                      {'message': '<script type="text/javascript">alert("您还没登录，无法查看！");</script>','flag': flag, 'c_num': c_num, 'classes_list': classes_list, 'brands_list': brands_list,
                       'brands_list_design': brands_list_design})
    else:
        cart = client_mongodb_options.find_cart(db, username)
        commoditys_list = []
        if cart:
            c_num = cart['c_num']
            c_list = cart['c_list']
            for c_option in c_list:
                c_id = c_option['commodity_id']
                c_size = c_option['size']
                c_color = c_option['color']
                commodity = mongodb_options.find_commodity_by_cid(db, c_id)
                commodity['c_size'] = c_size
                commodity['c_style'] = c_color
                commoditys_list.append(commodity)
        else:
            c_num = 0
        return render(request, 'client/client_order_shopcart.html',
                  {'username': username, 'flag': flag, 'c_num': c_num, 'classes_list': classes_list, 'brands_list': brands_list, 'brands_list_design': brands_list_design, 'commoditys_list': commoditys_list})

def del_cart_c(request):
    username = request.session['login_user']
    del_object = request.POST['del_object']
    del_item_list_str = request.POST['del_item_list']
    del_item_list = del_item_list_str[1:].split(',')  # 获取到的del_item_list_str字符串开头多了1个逗号，所以此时需要分片
    if del_object == 'commodity':
        for item_id in del_item_list:
            client_mongodb_options.del_commodity_in_cart(db, username, str(item_id))
    return HttpResponse("删除成功")

def confirm_order(request):
    '''username = request.session['login_user']
    classes_list = mongodb_options.find_classes(db)
    brands_list = mongodb_options.find_brands(db)
    brands_list_design = []
    for brand in brands_list:
        if brand['isdesign'] == u'是':
            brands_list_design.append(brand)
    # 获取POST信息
    commodity_id_list_str = request.POST['commodity_id_list']
    total_price = request.POST['money']
    commodity_id_list = commodity_id_list_str[1:].split(',')
    confirm_c_list = []
    cart = client_mongodb_options.find_cart(db, username)
    c_list = cart['c_list']
    for item_id in commodity_id_list:
        for commodity_in_cart in c_list:
            if commodity_in_cart['commodity_id'] == item_id:
                confirm_c_list.append(commodity_in_cart)
    # 地址获取
    addrs = client_mongodb_options.find_addrs(db, username)
    if addrs:
        address_list = addrs['addrs_list']
    else:
        address_list = []
    return render(request, 'client/client_order_clearing.html',
                {'username': username, 'flag': True, 'classes_list': classes_list, 'brands_list': brands_list, 'brands_list_design': brands_list_design,
                 'address_list': address_list, 'confirm_c_list': confirm_c_list, 'total_price': total_price, 'commodity_id_list_str': commodity_id_list_str})'''

    username = request.session['login_user']
    classes_list = mongodb_options.find_classes(db)
    brands_list = mongodb_options.find_brands(db)
    brands_list_design = []
    for brand in brands_list:
        if brand['isdesign'] == u'是':
            brands_list_design.append(brand)
    cart = client_mongodb_options.find_cart(db, username)
    if cart:
        c_num = cart['c_num']
    else:
        c_num = 0
    # 获取POST信息


    commodity_id_list_str = request.POST['commodity_id_list']
    amount_list_str = request.POST['amount_list']
    total_price = request.POST['money']
    commodity_id_list = commodity_id_list_str[1:].split(',')
    amount_list = amount_list_str[1:].split(',')
    print amount_list
    confirm_c_list = []
    cart = client_mongodb_options.find_cart(db, username)
    c_list = cart['c_list']
    i = 0
    for item_id in commodity_id_list:
        for commodity_in_cart in c_list:
            if commodity_in_cart['commodity_id'] == item_id:
                item_num = amount_list[i]
                commodity_in_cart['num'] = item_num
                confirm_c_list.append(commodity_in_cart)
                i = i + 1
    # 地址获取
    addrs = client_mongodb_options.find_addrs(db, username)
    if addrs:
        address_list = addrs['addrs_list']
    else:
        address_list = []
    return render(request, 'client/client_order_clearing.html',
                  {'username': username, 'flag': True, 'c_num': c_num, 'classes_list': classes_list,
                   'brands_list': brands_list, 'brands_list_design': brands_list_design,
                   'address_list': address_list, 'confirm_c_list': confirm_c_list, 'total_price': total_price,
                   'commodity_id_list_str': commodity_id_list_str, 'amount_list_str': amount_list_str})


def pay_ali(request):
    '''username = request.session['login_user']
    total_price = float(request.POST['money'])
    commodity_id_list_str = request.POST['commodity_id_list_str']
    commodity_id_list = commodity_id_list_str[1:].split(',')
    order_list = []
    cart = client_mongodb_options.find_cart(db, username)
    c_list = cart['c_list']
    for item_id in commodity_id_list:
        for commodity in c_list:
            if commodity['commodity_id'] == item_id:
                order_list.append(commodity)
    o_id = uuid.uuid1()
    m_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
    state = 0   # 0:未付款,1：已付款
    client_mongodb_options.add_order(db, o_id, username, m_time, total_price, order_list, state)
    pay_url = p_alipay.alipay.create_partner_trade_by_buyer(o_id, "充值测试", "hello zhong", total_price)# 订单号, 商品名, 商品描述, 价钱
    return render(request, 'client/pay.html', {'pay_url': pay_url})'''

    username = request.session['login_user']
    total_price = float(request.POST['money'])
    commodity_id_list_str = request.POST['commodity_id_list_str']
    amount_list_str = request.POST['amount_list_str']
    address = request.POST['address']
    commodity_id_list = commodity_id_list_str[1:].split(',')
    amount_list = amount_list_str[1:].split(',')
    order_list = []
    cart = client_mongodb_options.find_cart(db, username)
    c_list = cart['c_list']
    i = 0
    for item_id in commodity_id_list:
        for commodity in c_list:
            if commodity['commodity_id'] == item_id:
                item_num = amount_list[i]
                commodity['num'] = item_num
                order_list.append(commodity)
                i = i + 1
    o_id = uuid.uuid1()
    m_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
    state = '未付款'  # 0:未付款,1：已付款
    client_mongodb_options.add_order(db, o_id, username, m_time, total_price, order_list, state ,address)
    if request.POST['trade_type'] == "0":
        # 担保支付
        pay_url = p_alipay.alipay.create_partner_trade_by_buyer(o_id, "充值测试", "hello zhong",
                                                                total_price)  # 订单号, 商品名, 商品描述, 价钱
    elif request.POST['trade_type'] == "1":
        # 即时到账
        pay_url = p_alipay.alipay.create_direct_pay_by_user(o_id, "充值测试", "hello zhong",
                                                            total_price)  # 订单号, 商品名, 商品描述, 价钱

    # 清空购物车
    c_list = []
    c_num = 0
    client_mongodb_options.update_commodity_to_cart(db, username, c_list, c_num)

    return render(request, 'client/pay.html', {'pay_url': pay_url})
    # return HttpResponse("删除成功")


def show_order(request):
    username = request.session['login_user']
    classes_list = mongodb_options.find_classes(db)
    brands_list = mongodb_options.find_brands(db)
    brands_list_design = []
    for brand in brands_list:
        if brand['isdesign'] == u'是':
            brands_list_design.append(brand)
    cart = client_mongodb_options.find_cart(db, username)
    if cart:
        c_num = cart['c_num']
    else:
        c_num = 0

    # 判断支付成功
    if 'out_trade_no' in request.GET:
        order_id = request.GET['out_trade_no']
        client_mongodb_options.update_order_by_id(db, order_id)

    # 获取订单信息
    order_list = client_mongodb_options.find_order(db, username)



    return render(request, 'client/client_manage_order.html',
                  {'username': username, 'flag': True, 'c_num': c_num, 'classes_list': classes_list,
                   'brands_list': brands_list, 'brands_list_design': brands_list_design,
                   'order_list': order_list})


#瀑布流 @author 姜亚东、张帅帅
def news_PBL(request):
    classes_list=mongodb_options.find_classes(db)
    brands_list=mongodb_options.find_brands(db)
    brands_list_design=[]
    for brand in brands_list:
        if brand["isdesign"]==u"是":
            brands_list_design.append(brand)
    news_list=mongodb_options.find_news(db)
    news_list1=news_list[:15]
    news_list2=news_list[15:]
    json.dumps('news_list2',news_list2)
    flag=False
    if "login_user" in request.session:
        username=request.session['login_user']
        flag=True
    if flag:
        cart=client_mongodb_options.find_cart(db,username)
        if cart:
            c_num=cart['c_num']
        else:
            c_num=0
        return render(request,'client/client_newsPBL.html',{'flag':flag,'c_num':c_num,'username':username,'classes_list':classes_list,'brands_list':brands_list,'brands_list_design': brands_list_design,"news_list2":news_list2,"news_list1":news_list1})
    else:
        return render(request,'client/client_newsPBL.html',{'flag':flag,'classes_list': classes_list,'brands_list': brands_list,'brands_list_design': brands_list_design,'news_list2':news_list2,'news_list1':news_list1})

#新闻页 @author 张帅帅、姜亚东
def shownews(request):
    src=request.GET["src"]
    news=mongodb_options.find_news_by_cid(db,src)
    return render(request,'client/client_newsContent.html',{'news':news})

