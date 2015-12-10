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


#####################
# 李苗：登录注册地址管理
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
        mongodb_options.insert_client(db, client_id, username, password, gender, age, date, email, phone_num)
        return render(request, 'client/client_register_success.html',
                      {'classes_list': classes_list, 'brands_list': brands_list,
                       'brands_list_design': brands_list_design})
    else:
        return render(request, 'client/client_register_error.html',
                      {'classes_list': classes_list, 'brands_list': brands_list,
                       'brands_list_design': brands_list_design})


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
        request.session['login_user'] = username
        cart = client_mongodb_options.find_cart(db, username)
	if 'c_num' not in request.POST:
		c_num=0
	else:
        	c_num = cart['c_num']
        return render(request, 'client/client_login_success.html',
                      {'username': username, 'flag': True, 'c_num': c_num, 'classes_list': classes_list, 'brands_list': brands_list,
                       'brands_list_design': brands_list_design})
    else:
        return render(request, 'client/client_login_error.html',
                      {'classes_list': classes_list, 'brands_list': brands_list,
                       'brands_list_design': brands_list_design})


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
                      {'flag': flag, 'message': '<script type="text/javascript">alert("你都没有登录，还添加个毛线吖，尼码！");</script>',
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
                      {'flag': flag, 'message': '<script type="text/javascript">alert("你都没有登录，还删除个毛线吖，尼码！");</script>',
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
                      {'message': '<script type="text/javascript">alert("你都没有登录，还注销个毛线吖，尼码！");</script>','classes_list': classes_list, 'brands_list': brands_list,
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
                      {'message': '<script type="text/javascript">alert("你都没有登录，还看个毛线吖，尼码！");</script>', 'flag': flag, 'classes_list': classes_list, 'brands_list': brands_list,
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
                      {'message': '<script type="text/javascript">alert("你都没有登录，还看个毛线吖，尼码！");</script>','flag': flag, 'c_num': c_num, 'classes_list': classes_list, 'brands_list': brands_list,
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

