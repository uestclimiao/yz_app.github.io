#! /usr/bin/env python
# coding=utf-8

from django.conf.urls import include, url

urlpatterns = [
    url(r'^client/$', 'yz_app.client_views.index', name='client_index'),
    url(r'^client/brand/$', 'yz_app.client_views.brand', name='client_brand'),
    url(r'^client/design_brand/$', 'yz_app.client_views.design_brand', name='client_design_brand'),

    # 李苗：登录注册地址管理
    url(r'^client/req_register/$', 'yz_app.client_views.req_register', name='client_req_register'),
    url(r'^client/register/$', 'yz_app.client_views.register', name='client_register'),
    url(r'^client/user_active/$', 'yz_app.client_views.user_active', name='client_active'),
    url(r'^client/req_login/$', 'yz_app.client_views.req_login', name='client_req_login'),
    url(r'^client/login/$', 'yz_app.client_views.login', name='client_login'),
    url(r'^client/main_options/$', 'yz_app.client_views.main_options', name='client_main_options'),
    url(r'^client/req_address/$', 'yz_app.client_views.req_address', name='client_req_address'),
    url(r'^client/add_address/$', 'yz_app.client_views.add_address', name='client_add_address'),
    url(r'^client/delete_address/$', 'yz_app.client_views.delete_address', name='client_delete_address'),
    #####################

    url(r'^client/logout/$', 'yz_app.client_views.logout', name='client_logout'),

    # 范：文艺品商品
    url(r'^client/brand/detail/$', 'yz_app.client_views.brand_detail', name='client_brand_detail'),
    url(r'^client/brand/commodity/detail$', 'yz_app.client_views.commodity_detail', name='client_commodity_detail'),
    url(r'^client/artwork_index/$', 'yz_app.client_views.artwork_index', name='client_artwork_index'),
    url(r'^client/artwork_exhibition/$', 'yz_app.client_views.artwork_exhibition', name='client_artwork_exhibition'),
    url(r'^client/add_cart/$', 'yz_app.client_views.add_cart', name='client_add_cart'),
    url(r'^client/show_cart/$', 'yz_app.client_views.show_cart', name='client_show_cart'),
    url(r'^client/del_cart_c/$', 'yz_app.client_views.del_cart_c', name='client_del_cart_c'),
    url(r'^client/confirm_order/$', 'yz_app.client_views.confirm_order', name='client_confirm_order'),
    url(r'^client/pay', 'yz_app.client_views.pay_ali', name='client_pay_ali'),

    url(r'^client/show_order', 'yz_app.client_views.show_order', name='client_show_order'),
    #####################
]
