# -*- coding: utf-8 -*-

# 合作身份者ID，以2088开头的16位纯数字
ALIPAY_PARTNER = '2088812795763044'

# 2088002600212722 范郑乐
# 安全检验码，以数字和字母组成的32位字符
ALIPAY_KEY = 'iq4q3tfx57at0ioo80ws77pmey1vvlku'
# du8v65hihqxggxd1sv7myy0lmz7stexx 范郑乐
# 签约支付宝账号或卖家支付宝帐户
ALIPAY_SELLER_EMAIL = 'andy_wu@luxurybrandlab.com'

# 交易过程中服务器通知的页面 要用 http://格式的完整路径，不允许加?id=123这类自定义参数
ALIPAY_NOTIFY_URL = 'http://example/alipay_notify'

# 付完款后跳转的页面 要用 http://格式的完整路径，不允许加?id=123这类自定义参数
# return_url的域名不能写成http://localhost/js_php_utf8/return_url.php ，否则会导致return_url执行无效
ALIPAY_RETURN_URL = 'http://127.0.0.1:8000/client/show_order'

# 网站商品的展示地址，不允许加?id=123这类自定义参数
ALIPAY_SHOW_URL = 'http://www.baidu.com'

# 签名方式 不需修改
ALIPAY_SIGN_TYPE = 'MD5'

# 字符编码格式 目前支持 GBK 或 utf-8
ALIPAY_INPUT_CHARSET = 'utf-8'

# 访问模式,根据自己的服务器是否支持ssl访问，若支持请选择https；若不支持请选择http
ALIPAY_TRANSPORT = 'http'

