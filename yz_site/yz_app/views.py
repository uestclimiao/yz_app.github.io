#! /usr/bin/env python
# coding=utf-8
from django.shortcuts import render
from django.shortcuts import HttpResponse, HttpResponseRedirect
import mongodb_options
import uuid
import util_functions
from PIL import Image
# Create your views here.

db = mongodb_options.mongodb_init()

def index(request):
    flag = False
    commoditys_list = mongodb_options.find_commoditys(db)
    if "username" in request.session:
        username = request.session['username']
        flag = True
    if flag:
        return render(request, 'manage_index.html', {'login_user': username, 'flag': flag, 'commoditys_list': commoditys_list})
    else:
        return render(request, 'manage_index.html', {'flag': flag})


def about(request):
    flag = False
    if "username" in request.session:
        username = request.session['username']
        flag = True
    if flag:
        return render(request, 'manage_about.html', {'login_user': username, 'flag': flag})
    else:
        return render(request, 'manage_about.html', {'flag': flag})


def contact(request):
    flag = False
    if "username" in request.session:
        username = request.session['username']
        flag = True
    if flag:
        return render(request, 'manage_contact.html', {'login_user': username, 'flag': flag})
    else:
        return render(request, 'manage_contact.html', {'flag': flag})


def req_admin_register(request):
    return render(request, 'manage_register.html')


def admin_register(request):
    username = request.POST['username']
    password = request.POST['password']
    email = request.POST['email']
    phone_num = request.POST['phone_num']
    user = mongodb_options.find_user_by_username(db, username)
    if not user:
        mongodb_options.insert_user(db, username, password, email, phone_num)
        return render(request, 'manage_index.html', {'message': '<script type="text/javascript">alert("恭喜您,注册成功了！");</script>'})
    else:
        return render(request, 'manage_register.html', {'message': '用户名已被注册了'})

def req_admin_login(request):
    return render(request, 'manage_login.html')

def admin_login(request):
    username = request.POST['username']
    password = request.POST['password']
    user = mongodb_options.find_user_by_username_password(db, username, password)
    if user:
        request.session['username'] = username
        return HttpResponseRedirect('/')
    else:
        return render(request, 'manage_login.html', {'login_message': '用户名和密码不一致'})

def admin_logout(request):
    username = ''
    if "username" in request.session:
        username = request.session['username']
    if not username == '':
        del request.session['username']
        return HttpResponseRedirect('/')
    else:
        return render(request, 'manage_index.html', {'message': '<script type="text/javascript">alert("你都没有登录，还注销个毛线吖，尼码！");</script>'})

def req_add_commodity(request):
    flag = False
    brands_list = mongodb_options.find_brands(db)
    classes_list = mongodb_options.find_classes(db)
    styles_list = mongodb_options.find_styles(db)
    sizes_list = mongodb_options.find_sizes(db)
    if "username" in request.session:
        username = request.session['username']
        flag = True
    if flag:
        return render(request, 'manage_add_commodity.html', {'login_user': username, 'flag': flag, 'brands_list': brands_list, 'classes_list': classes_list, 'styles_list': styles_list, 'sizes_list': sizes_list})
    else:
        return render(request, 'manage_index.html', {'message': '<script type="text/javascript">alert("你妹，你居然擅自修改页面，NMB");</script>'})

def add_commodity(request):
    cid = uuid.uuid1()
    cname = request.POST['cname']
    cprice = request.POST['cprice']
    cdesc = request.POST['cdesc']
    cpostage = request.POST['cpostage']
    cnum = request.POST['cnum']
    c_size_list = request.POST.getlist('c_size')
    final_sizes = ''
    for c_size in c_size_list:
        final_sizes = final_sizes + "/" + c_size
    final_sizes = final_sizes[1:]
    c_style_list = request.POST.getlist('c_style')
    final_styles = ''
    for c_style in c_style_list:
        final_styles = final_styles + "/" + c_style
    final_styles = final_styles[1:]
    c_class = request.POST['c_class']
    c_brand = request.POST['c_brand']
    reqimg = request.FILES['cimg']
    cimg = Image.open(reqimg)
    img_path = "/home/limiao/yz_app.github.io/yz_site/yz_app/static/files/commodity_imgs/"
    img_name = str(cid)+".png"
    cimg.save(img_path+img_name)  # 保存图片
    mongodb_options.insert_commodity(db, cid, cname, cprice, cdesc, cpostage, cnum, c_class, c_brand, final_sizes, final_styles)
    return HttpResponseRedirect('/')

def delete_items(request):
    del_object = request.POST['del_object']
    del_item_list_str = request.POST['del_item_list']
    del_item_list = del_item_list_str[1:].split(',')  # 获取到的del_item_list_str字符串开头多了1个逗号，所以此时需要分片
    if del_object == 'commodity':
        for item_id in del_item_list:
            mongodb_options.del_commodity(db, str(item_id))
    elif del_object == 'brand':
        for item_id in del_item_list:
            mongodb_options.del_brand(db, str(item_id))
    elif del_object == 'class':
        for item_id in del_item_list:
            mongodb_options.del_class(db, str(item_id))
    elif del_object == 'client':
        for item_id in del_item_list:
            mongodb_options.del_client(db, str(item_id))
    elif del_object == 'admin':
        for item_id in del_item_list:
            mongodb_options.del_admin(db, str(item_id))
    elif del_object == 'style':
        for item_id in del_item_list:
            mongodb_options.del_style(db, str(item_id))
    elif del_object == 'size':
        for item_id in del_item_list:
            mongodb_options.del_size(db, str(item_id))
    elif del_object == 'shop_addr':
        for item_id in del_item_list:
            mongodb_options.del_shop_addr(db, str(item_id))
    return HttpResponse("删除成功")

def req_modify_commodity(request):
    if "username" in request.session:
        username = request.session['username']
    cid = request.GET['cid']
    commodity = mongodb_options.find_commodity_by_cid(db, cid)
    brands_list = mongodb_options.find_brands(db)
    classes_list = mongodb_options.find_classes(db)
    styles_list = mongodb_options.find_styles(db)
    sizes_list = mongodb_options.find_sizes(db)
    return render(request, 'manage_modify_commodity.html', {'login_user': username, 'flag': True, 'commodity': commodity, 'brands_list': brands_list, 'classes_list': classes_list, 'styles_list': styles_list, 'sizes_list': sizes_list})

def modify_commodity(request):
    cid = request.POST['cid']
    cname = request.POST['cname']
    cprice = request.POST['cprice']
    cdesc = request.POST['cdesc']
    cpostage = request.POST['cpostage']
    cnum = request.POST['cnum']
    c_size_list = request.POST.getlist('c_size')
    final_sizes = ''
    for c_size in c_size_list:
        final_sizes = final_sizes + "/" + c_size
    final_sizes = final_sizes[1:]
    c_style_list = request.POST.getlist('c_style')
    final_styles = ''
    for c_style in c_style_list:
        final_styles = final_styles + "/" + c_style
    final_styles = final_styles[1:]
    c_class = request.POST['c_class']
    c_brand = request.POST['c_brand']
    reqimg = request.FILES['cimg']
    cimg = Image.open(reqimg)
    img_path = "/home/limiao/yz_app.github.io/yz_site/yz_app/static/files/commodity_imgs/"
    img_name = str(cid)+".png"
    cimg.save(img_path+img_name)  # 保存图片
    mongodb_options.update_commodity(db, cid, cname, cprice, cdesc, cpostage, cnum, c_class, c_brand, final_sizes, final_styles)
    return HttpResponseRedirect('/')

def req_brand(request):
    if "username" in request.session:
        username = request.session['username']
    brands_list = mongodb_options.find_brands(db)
    return render(request, 'manage_brand.html', {'login_user': username, 'flag': True, 'brands_list': brands_list})

def req_add_brand(request):
    if "username" in request.session:
        username = request.session['username']
    return render(request, 'manage_add_brand.html', {'login_user': username, 'flag': True})

def add_brand(request):
    if "username" in request.session:
        username = request.session['username']
    bid = uuid.uuid1()
    bname = request.POST['bname']
    brand = mongodb_options.find_brand_by_bname(db, bname)
    if not brand:
        bdesc = request.POST['bdesc']
        reqimg = request.FILES['bimg']
        bimg = Image.open(reqimg)
        img_path = "/home/limiao/yz_app.github.io/yz_site/yz_app/static/files/brand_imgs/"
        img_name = str(bid)+".png"
        bimg.save(img_path+img_name)  # 保存图片
        isdesign = request.POST['isdesign']
        if isdesign == u'是独立设计师品牌':
            isdesign = u'是'
        elif isdesign == u'不是独立设计师品牌':
            isdesign = u'否'
        else:
            return render(request, 'manage_add_brand.html', {'login_user': username, 'flag': True, 'message': '需要标识该商品是否为独立设计师品牌'})
        mongodb_options.insert_brand(db, bid, bname, bdesc, isdesign)
        return HttpResponseRedirect('/manage/req_brand/')
    else:
        return render(request, 'manage_add_brand.html', {'login_user': username, 'flag': True, 'message': '该商标名已经存在了'})

def req_modify_brand(request):
    if "username" in request.session:
        username = request.session['username']
    bid = request.GET['bid']
    brand = mongodb_options.find_brand_by_bid(db, bid)
    return render(request, 'manage_modify_brand.html', {'login_user': username, 'flag': True, 'brand': brand})

def modify_brand(request):
    if "username" in request.session:
        username = request.session['username']
    bid = request.POST['bid']
    original_bname = request.POST['original_bname']
    bname = request.POST['bname']
    if not bname == original_bname:
        brand = mongodb_options.find_brand_by_bname(db, bname)
        if not brand:
            bdesc = request.POST['bdesc']
            reqimg = request.FILES['bimg']
            bimg = Image.open(reqimg)
            img_path = "/home/limiao/yz_app.github.io/yz_site/yz_app/static/files/brand_imgs/"
            img_name = str(bid)+".png"
            bimg.save(img_path+img_name)  # 保存图片
            isdesign = request.POST['isdesign']
            if isdesign == u'是独立设计师品牌':
                isdesign = u'是'
            elif isdesign == u'不是独立设计师品牌':
                isdesign = u'否'
            else:
                return render(request, 'manage_add_brand.html', {'login_user': username, 'flag': True, 'message': '需要标识该商品是否为独立设计师品牌'})
            mongodb_options.update_brand(db, bid, bname, bdesc, isdesign)
            return HttpResponseRedirect('/manage/req_brand/')
        else:
            return render(request, 'manage_modify_brand.html', {'login_user': username, 'flag': True, 'message': '该商标名已经存在了'})
    else:
        bdesc = request.POST['bdesc']
        reqimg = request.FILES['bimg']
        bimg = Image.open(reqimg)
        img_path = "/home/limiao/yz_app.github.io/yz_site/yz_app/static/files/brand_imgs/"
        img_name = str(bid)+".png"
        bimg.save(img_path+img_name)  # 保存图片
        isdesign = request.POST['isdesign']
        if isdesign == u'是独立设计师品牌':
            isdesign = u'是'
        elif isdesign == u'不是独立设计师品牌':
            isdesign = u'否'
        else:
            return render(request, 'manage_add_brand.html', {'login_user': username, 'flag': True, 'message': '需要标识该商品是否为独立设计师品牌'})
        mongodb_options.update_brand(db, bid, bname, bdesc, isdesign)
        return HttpResponseRedirect('/manage/req_brand/')

def req_class(request):
    if "username" in request.session:
        username = request.session['username']
    classes_list = mongodb_options.find_classes(db)
    return render(request, 'manage_class.html', {'login_user': username, 'flag': True, 'classes_list': classes_list})

def req_add_class(request):
    if "username" in request.session:
        username = request.session['username']
    return render(request, 'manage_add_class.html', {'login_user': username, 'flag': True})

def add_class(request):
    if "username" in request.session:
        username = request.session['username']
    class_id = uuid.uuid1()
    class_name = request.POST['class_name']
    my_class = mongodb_options.find_class_by_class_name(db, class_name)
    if not my_class:
        mongodb_options.insert_class(db, class_id, class_name)
        return HttpResponseRedirect('/manage/req_class/')
    else:
        return render(request, 'manage_add_class.html', {'login_user': username, 'flag': True, 'message': '该分类已经存在了'})

def req_modify_class(request):
    if "username" in request.session:
        username = request.session['username']
    class_id = request.GET['class_id']
    my_class = mongodb_options.find_class_by_id(db, class_id)
    return render(request, 'manage_modify_class.html', {'login_user': username, 'flag': True, 'class': my_class})

def modify_class(request):
    if "username" in request.session:
        username = request.session['username']
    class_id = request.POST['class_id']
    class_name = request.POST['class_name']
    my_class = mongodb_options.find_class_by_class_name(db, class_name)
    if not my_class:
        mongodb_options.update_class(db, class_id, class_name)
        return HttpResponseRedirect('/manage/req_class/')
    else:
        return render(request, 'manage_modify_class.html', {'login_user': username, 'flag': True, 'message': '该分类已经存在了'})

def req_client(request):
    if "username" in request.session:
        username = request.session['username']
    clients_list = mongodb_options.find_clients(db)
    return render(request, 'manage_client.html', {'login_user': username, 'flag': True, 'clients_list': clients_list})

def req_add_client(request):
    if "username" in request.session:
        username = request.session['username']
    return render(request, 'manage_client_register.html', {'login_user': username, 'flag': True})

def add_client(request):
    if "username" in request.session:
        login_user = request.session['username']
    client_id = uuid.uuid1()
    username = request.POST['username']
    password = request.POST['password']
    gender = request.POST['gender']
    date = request.POST['date']
    date_list = date.split()
    day = date_list[0]
    month_CN = date_list[1]
    year = date_list[2]
    month = util_functions.date_cn_to_num(month_CN)
    age = str(util_functions.get_age(year, month, day))
    date = year+'-'+month+'-'+day
    email = request.POST['email']
    phone_num = request.POST['phone_num']
    client = mongodb_options.find_client_by_username(db, username)
    if not client:
        mongodb_options.insert_client(db, client_id, username, password, gender, age, date, email, phone_num)
        return HttpResponseRedirect('/manage/req_client/')
    else:
        return render(request, 'manage_client_register.html', {'login_user': login_user, 'flag': True, 'message': '用户名已被注册了'})

def req_modify_client(request):
    if "username" in request.session:
        login_user = request.session['username']
    username = request.GET['client_username']
    client = mongodb_options.find_client_by_username(db, username)
    return render(request, 'manage_modify_client.html', {'login_user': login_user, 'flag': True, 'client': client})

def modify_client(request):
    if "username" in request.session:
        login_user = request.session['username']
    client_id = request.POST['client_id']
    original_username = request.POST['original_username']
    username = request.POST['username']
    if not username == original_username:
        client = mongodb_options.find_client_by_username(db, username)
        if not client:
            password = request.POST['password']
            gender = request.POST['gender']
            date = request.POST['date']
            date_list = date.split()
            day = date_list[0]
            month_CN = date_list[1]
            year = date_list[2]
            month = util_functions.date_cn_to_num(month_CN)
            age = str(util_functions.get_age(year, month, day))
            date = year+'-'+month+'-'+day
            email = request.POST['email']
            phone_num = request.POST['phone_num']
            mongodb_options.update_client(db, client_id, username, password, gender, age, date, email, phone_num)
            return HttpResponseRedirect('/manage/req_client/')
        else:
            return render(request, 'manage_modify_client.html', {'login_user': login_user, 'flag': True, 'message': '该用户名已经存在了'})
    else:
        password = request.POST['password']
        gender = request.POST['gender']
        date = request.POST['date']
        date_list = date.split()
        day = date_list[0]
        month_CN = date_list[1]
        year = date_list[2]
        month = util_functions.date_cn_to_num(month_CN)
        age = str(util_functions.get_age(year, month, day))
        date = year+'-'+month+'-'+day
        email = request.POST['email']
        phone_num = request.POST['phone_num']
        mongodb_options.update_client(db, client_id, username, password, gender, age, date, email, phone_num)
        return HttpResponseRedirect('/manage/req_client/')


def req_admin(request):
    if "username" in request.session:
        username = request.session['username']
    admins_list = mongodb_options.find_admins(db)
    return render(request, 'manage_admin.html', {'login_user': username, 'flag': True, 'admins_list': admins_list})

def req_style(request):
    if "username" in request.session:
        username = request.session['username']
    styles_list = mongodb_options.find_styles(db)
    return render(request, 'manage_style.html', {'login_user': username, 'flag': True, 'styles_list': styles_list})

def req_add_style(request):
    if "username" in request.session:
        username = request.session['username']
    return render(request, 'manage_add_style.html', {'login_user': username, 'flag': True})

def add_style(request):
    if "username" in request.session:
        username = request.session['username']
    style_id = uuid.uuid1()
    style_name = request.POST['style_name']
    style = mongodb_options.find_style_by_style_name(db, style_name)
    if not style:
        mongodb_options.insert_style(db, style_id, style_name)
        return HttpResponseRedirect('/manage/req_style/')
    else:
        return render(request, 'manage_add_style.html', {'login_user': username, 'flag': True, 'message': '该颜色/款式已经存在了'})

def req_modify_style(request):
    if "username" in request.session:
        username = request.session['username']
    style_id = request.GET['style_id']
    style = mongodb_options.find_style_by_id(db, style_id)
    return render(request, 'manage_modify_style.html', {'login_user': username, 'flag': True, 'style': style})

def modify_style(request):
    if "username" in request.session:
        username = request.session['username']
    style_id = request.POST['style_id']
    style_name = request.POST['style_name']
    style = mongodb_options.find_style_by_style_name(db, style_name)
    if not style:
        mongodb_options.update_style(db, style_id, style_name)
        return HttpResponseRedirect('/manage/req_style/')
    else:
        return render(request, 'manage_modify_style.html', {'login_user': username, 'flag': True, 'message': '该颜色/款式已经存在了'})

def req_size(request):
    if "username" in request.session:
        username = request.session['username']
    sizes_list = mongodb_options.find_sizes(db)
    return render(request, 'manage_size.html', {'login_user': username, 'flag': True, 'sizes_list': sizes_list})

def req_add_size(request):
    if "username" in request.session:
        username = request.session['username']
    return render(request, 'manage_add_size.html', {'login_user': username, 'flag': True})

def add_size(request):
    if "username" in request.session:
        username = request.session['username']
    size_id = uuid.uuid1()
    size_name = request.POST['size_name']
    size = mongodb_options.find_size_by_size_name(db, size_name)
    if not size:
        mongodb_options.insert_size(db, size_id, size_name)
        return HttpResponseRedirect('/manage/req_size/')
    else:
        return render(request, 'manage_add_size.html', {'login_user': username, 'flag': True, 'message': '该尺寸已经存在了'})

def req_modify_size(request):
    if "username" in request.session:
        username = request.session['username']
    size_id = request.GET['size_id']
    size = mongodb_options.find_size_by_id(db, size_id)
    return render(request, 'manage_modify_size.html', {'login_user': username, 'flag': True, 'size': size})

def modify_size(request):
    if "username" in request.session:
        username = request.session['username']
    size_id = request.POST['size_id']
    size_name = request.POST['size_name']
    size = mongodb_options.find_size_by_size_name(db, size_name)
    if not size:
        mongodb_options.update_size(db, size_id, size_name)
        return HttpResponseRedirect('/manage/req_size/')
    else:
        return render(request, 'manage_modify_size.html', {'login_user': username, 'flag': True, 'message': '该尺寸已经存在了'})

def req_shop_addr(request):
    if "username" in request.session:
        username = request.session['username']
    shop_addrs_list = mongodb_options.find_shop_addrs(db)
    return render(request, 'manage_address.html', {'login_user': username, 'flag': True, 'shop_addrs_list': shop_addrs_list})

def req_add_shop_addr(request):
    if "username" in request.session:
        username = request.session['username']
    return render(request, 'manage_add_address.html', {'login_user': username, 'flag': True})

def add_shop_addr(request):
    shop_addr_id = uuid.uuid1()
    province_domain = request.POST['provincedomain']
    city_domain = request.POST['citydomain']
    town_domain = request.POST['towndomain']
    info_addr = request.POST['info_addr']
    mongodb_options.insert_shop_addr(db, shop_addr_id, province_domain, city_domain, town_domain, info_addr)
    return HttpResponseRedirect('/manage/req_shop_addr/')

def req_modify_shop_addr(request):
    if "username" in request.session:
        username = request.session['username']
    shop_addr_id = request.GET['shop_addr_id']
    shop_addr = mongodb_options.find_shop_addr_by_id(db, shop_addr_id)
    return render(request, 'manage_modify_address.html', {'login_user': username, 'flag': True, 'shop_addr': shop_addr})

def modify_shop_addr(request):
    shop_addr_id = request.POST['shop_addr_id']
    province_domain = request.POST['provincedomain']
    city_domain = request.POST['citydomain']
    town_domain = request.POST['towndomain']
    info_addr = request.POST['info_addr']
    mongodb_options.update_shop_addr(db, shop_addr_id, province_domain, city_domain, town_domain, info_addr)
    return HttpResponseRedirect('/manage/req_shop_addr/')
